import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';
import { useProductStore } from './productStore';
import { useProductPackageStore } from './productPackageStore';
import { handleResponse } from '@/utils/responseHandler';

export const useProductPackageDurationStore = defineStore('productPackageDurationStore', () => {
  /**========================================================================
   **   STATE & COMPUTED
   *========================================================================**/

  // 📌 State
  const loading = ref(false);

  const isFetchingList = ref(false);
  const isFetchingDetail = ref(false);
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);

  const message = ref(null);
  const error = ref(null);

  const durations = ref([]);

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
   *    Fetch Products Package Duration by Product Package ID
   *------------------------------------------------------------------------**/

  const fetchProductPackageDurations = async (productPackageId) => {
    isFetchingList.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('product_package_durations')
        .select('*')
        .eq('product_package_id', productPackageId)
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      durations.value = data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil data durasi paket produk', { err });
    } finally {
      isFetchingDetail.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Add Products Package Duration
   *------------------------------------------------------------------------**/

  const addProductPackageDuration = async (product_package_id, name, value) => {
    isCreating.value = true;
    resetMessageState();

    console.log('Masuk store');

    try {
      const user_id = useAuthStore().user?.id;
      if (!user_id) throw new Error('User tidak ditemukan/belum login');

      const { data, error: insertError } = await supabase
        .from('product_package_durations')
        .insert([
          {
            user_id,
            product_package_id,
            name,
            value,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 📌 Fetch ulang produk
      const productStore = useProductStore();
      await productStore.fetchProducts();

      handleResponse({ message, error }, 'success', 'menambah durasi paket produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambah durasi paket produk', { err });
    } finally {
      isCreating.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Delete Products Package Duration
   *------------------------------------------------------------------------**/

  const deleteProductPackageDuration = async (durationId) => {
    isDeleting.value = true;
    resetMessageState();

    try {
      // Hapus paket dari database
      const { error: deleteError } = await supabase
        .from('product_package_durations')
        .delete()
        .eq('id', durationId);

      if (deleteError) throw deleteError;

      // 📌 Fetch ulang produk
      const productStore = useProductStore();
      await productStore.fetchProducts();

      handleResponse({ message, error }, 'success', 'menghapus durasi paket produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus durasi paket produk', { err });
    } finally {
      isDeleting.value = false;
    }
  };

  /**========================================================================
   **   RETURNS
   *========================================================================**/

  return {
    // State
    loading,

    isFetchingList,
    isFetchingDetail,
    isCreating,
    isUpdating,
    isDeleting,

    message,
    error,

    durations,

    // Methods
    resetMessageState,
    fetchProductPackageDurations,
    addProductPackageDuration,
    deleteProductPackageDuration,
  };
});
