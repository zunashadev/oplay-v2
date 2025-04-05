import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';
import { useProductStore } from './productStore';
import { handleResponse } from '@/utils/responseHandler';

export const useProductPackageStore = defineStore('productPackageStore', () => {
  const packages = ref([]);
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null); // ini digunakan sebagai keterangan message apabila terjadi error

  // Fetch product package berdasarkan product id
  const fetchProductPackages = async (productId) => {
    loading.value = true;
    error.value = null;
    message.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('product_packages')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      packages.value = data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil data paket produk', err);
    } finally {
      loading.value = false;
    }
  };

  // Tambah paket baru
  const addProductPackage = async (
    product_id,
    name,
    price,
    discount_type = null,
    discount_value = 0,
    is_best_seller = false,
  ) => {
    loading.value = true;
    error.value = null;
    message.value = null;

    try {
      // Cek user
      const user_id = useAuthStore().user?.id;
      if (!user_id) {
        throw new Error('User tidak ditemukan/belum login');
      }

      // Validasi input harga dan diskon
      if (price <= 0) throw new Error('Harga harus lebih dari 0');
      if (discount_type && !['percentage', 'fixed_amount'].includes(discount_type)) {
        throw new Error('Jenis diskon tidak valid');
      }
      if (discount_value < 0) throw new Error('Nilai diskon tidak boleh negatif');

      // Simpan paket ke database
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

      // Tambahkan paket baru ke state langsung agar UI langsung diperbarui
      packages.value.unshift(data);

      // Update product di products.value agar UI langsung berubah
      const productStore = useProductStore();
      const product = productStore.products.find((p) => p.id === product_id);

      if (product) {
        // Pastikan daftar paket ada sebelum menambahkan
        product.product_packages = product.product_packages || [];
        product.product_packages.unshift(data);
      }

      handleResponse({ message, error }, 'success', 'menambah paket produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambah paket produk', err);
    } finally {
      loading.value = false;
    }
  };

  // Hapus paket
  const deleteProductPackage = async (packageId) => {
    loading.value = true;
    error.value = null;
    message.value = null;

    try {
      // Hapus paket dari database
      const { error: deleteError } = await supabase
        .from('product_packages')
        .delete()
        .eq('id', packageId);

      if (deleteError) throw deleteError;

      // Hapus paket dari state lokal
      packages.value = packages.value.filter((p) => p.id !== packageId);

      // Update produk di store agar UI langsung diperbarui
      const productStore = useProductStore();
      productStore.products.forEach((product) => {
        if (product.product_packages) {
          product.product_packages = product.product_packages.filter((pkg) => pkg.id !== packageId);
        }
      });

      handleResponse({ message, error }, 'success', 'menghapus paket produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus paket produk', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    packages,
    loading,
    message,
    error,

    // Methods
    fetchProductPackages,
    addProductPackage,
    deleteProductPackage,
  };
});
