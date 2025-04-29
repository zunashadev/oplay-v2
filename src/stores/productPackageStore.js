import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';
import { useProductStore } from './productStore';
import { handleResponse } from '@/utils/responseHandler';

export const useProductPackageStore = defineStore('productPackageStore', () => {
  /**========================================================================
   **    STATE & COMPUTED
   *========================================================================**/

  // 📌 State
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  const packages = ref([]);

  /**========================================================================
   **    UTILITY FUNCTIONS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *   Reset Message & Error State
   *------------------------------------------------------------------------**/

  const resetMessageState = () => {
    message.value = null;
    error.value = null;
  };

  /**========================================================================
   **    METHODS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *   Fetch Product Packages by Product ID
   *------------------------------------------------------------------------**/

  const fetchProductPackages = async (productId) => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('product_packages')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      packages.value = data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil data paket produk', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *   Get Product Package by Package ID
   *------------------------------------------------------------------------**/

  const getProductPackageById = async (packageId) => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('product_packages')
        .select('*')
        .eq('id', packageId)
        .single();

      if (fetchError) throw fetchError;

      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil detail paket produk', { err });
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *   Add Product Package
   *------------------------------------------------------------------------**/

  const addProductPackage = async (
    product_id,
    name,
    price,
    discount_type = null,
    discount_value = 0,
    is_best_seller = false,
  ) => {
    loading.value = true;
    resetMessageState();

    try {
      // 📌 Cek user
      const user_id = useAuthStore().user?.id;
      if (!user_id) {
        throw new Error('User tidak ditemukan/belum login');
      }

      // 📌 Validasi input harga dan diskon
      if (price <= 0) throw new Error('Harga harus lebih dari 0');
      if (discount_type && !['percentage', 'fixed_amount'].includes(discount_type)) {
        throw new Error('Jenis diskon tidak valid');
      }
      if (discount_value < 0) throw new Error('Nilai diskon tidak boleh negatif');

      // 📌 Simpan paket ke database
      const { data, error: insertError } = await supabase
        .from('product_packages')
        .insert([
          {
            product_id,
            name,
            price,
            user_id,
            discount_type: discount_type || null, // ini akan mengubah undefined, null, "", dan false menjadi null
            discount_value: discount_value || 0, // ini akan mengubah undefined, null, "", dan false menjadi 0
            is_best_seller,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 📌 Fetch ulang produk
      const productStore = useProductStore();
      await productStore.fetchProducts();

      handleResponse({ message, error }, 'success', 'menambah paket produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambah paket produk', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *   Delete Product Package
   *------------------------------------------------------------------------**/

  const deleteProductPackage = async (packageId) => {
    loading.value = true;
    resetMessageState();

    try {
      // Hapus paket dari database
      const { error: deleteError } = await supabase
        .from('product_packages')
        .delete()
        .eq('id', packageId);

      if (deleteError) throw deleteError;

      // 📌 Fetch ulang produk
      const productStore = useProductStore();
      await productStore.fetchProducts();

      handleResponse({ message, error }, 'success', 'menghapus paket produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus paket produk', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *   Update Product Package
   *------------------------------------------------------------------------**/

  const updateProductPackage = async (
    packageId,
    updatedFields = {}, // { name, price, discount_type, discount_value, is_best_seller }
  ) => {
    loading.value = true;
    resetMessageState();

    try {
      if (!packageId) throw new Error('ID paket tidak ditemukan');

      // Validasi jika ada harga/diskon yang diubah
      if ('price' in updatedFields && updatedFields.price <= 0) {
        throw new Error('Harga harus lebih dari 0');
      }
      if (
        'discount_type' in updatedFields &&
        updatedFields.discount_type &&
        !['percentage', 'fixed_amount'].includes(updatedFields.discount_type)
      ) {
        throw new Error('Jenis diskon tidak valid');
      }
      if ('discount_value' in updatedFields && updatedFields.discount_value < 0) {
        throw new Error('Nilai diskon tidak boleh negatif');
      }

      // Update ke database
      const { data, error: updateError } = await supabase
        .from('product_packages')
        .update(updatedFields)
        .eq('id', packageId)
        .select()
        .single();

      if (updateError) throw updateError;

      // 📌 Fetch ulang produk
      const productStore = useProductStore();
      await productStore.fetchProducts();

      handleResponse({ message, error }, 'success', 'mengedit paket produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengedit paket produk', { err });
    } finally {
      loading.value = false;
    }
  };

  /**========================================================================
   **    RETURNS
   *========================================================================**/

  return {
    // 📌 States
    packages,
    loading,
    message,
    error,

    // 📌 Methods
    resetMessageState,
    fetchProductPackages,
    addProductPackage,
    deleteProductPackage,
    updateProductPackage,
    getProductPackageById,
  };
});
