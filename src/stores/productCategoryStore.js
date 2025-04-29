import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';

import { useAuthStore } from './authStore';
import { handleResponse } from '@/utils/responseHandler';
import { generateSlug } from '@/utils/slug';
import { storageService } from '@/services/storageService';

export const useProductCategoryStore = defineStore('productCategoryStore', () => {
  /**========================================================================
   **   STATE & COMPUTED
   *========================================================================**/

  // 📌 State
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  const categories = ref([]);

  /**========================================================================
   **   UTILITY FUNCTIONS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Reset Message & Error State
   *------------------------------------------------------------------------**/

  const resetMessageState = () => {
    message.value = null;
    error.value = null;
  };

  /**========================================================================
   **   METHODS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Fetch Categories
   *------------------------------------------------------------------------**/

  const fetchCategories = async () => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('product_categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // 📌 Simpan hasil fetch ke state
      categories.value = data || [];

      handleResponse({ message, error }, 'success', 'mengambil data kategori');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil data kategori', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Add Category
   *------------------------------------------------------------------------**/

  const addCategory = async (name) => {
    loading.value = true;
    resetMessageState();

    try {
      // 📌 Cek user
      const user_id = useAuthStore().user?.id;
      if (!user_id) {
        throw new Error('User tidak ditemukan/belum login');
      }

      // 📌 Generate slug
      const slug = await generateSlug(name, 'product_categories');

      // 📌 Simpan kategori ke database
      const { data, error: insertError } = await supabase
        .from('product_categories')
        .insert([
          {
            user_id,
            name,
            slug,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 📌 Fetch ulang kategori
      await fetchCategories();

      handleResponse({ message, error }, 'success', 'menambah kategori');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambah kategori', { err });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Delete Category
   *------------------------------------------------------------------------**/

  const deleteCategory = async (categoryId) => {
    loading.value = true;
    resetMessageState();

    try {
      // 📌 Hapus kategori dari database
      const { error: deleteError } = await supabase
        .from('product_categories')
        .delete()
        .eq('id', categoryId);

      if (deleteError) throw deleteError;

      // 📌 Fetch ulang kategori
      await fetchCategories();

      handleResponse({ message, error }, 'success', 'menghapus kategori produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus kategori produk', { err });
    } finally {
      loading.value = false;
    }
  };

  /**========================================================================
   **   RETURNS
   *========================================================================**/

  return {
    // 📌 States
    loading,
    message,
    error,
    categories,

    // 📌 Methods
    fetchCategories,
    addCategory,
    deleteCategory,
  };
});
