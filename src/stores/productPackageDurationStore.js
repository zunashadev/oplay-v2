import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';
import { useProductStore } from './productStore';
import { useProductPackageStore } from './productPackageStore';
import { handleResponse } from '@/utils/responseHandler';

export const useProductPackageDurationStore = defineStore('productPackageDurationStore', () => {
  const durations = ref([]);
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null); // ini digunakan sebagai keterangan message apabila terjadi error

  // Fungsi : Reset message and error state
  const resetMessageState = () => {
    message.value = null;
    error.value = null;
  };

  // Fetch product package duration berdasarkan product package id
  const fetchProductPackageDurations = async (productPackageId) => {
    loading.value = true;
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
      loading.value = false;
    }
  };

  const addProductPackageDuration = async (product_id, product_package_id, name, value) => {
    loading.value = true;
    resetMessageState();

    try {
      const user_id = useAuthStore().user?.id;
      if (!user_id) {
        throw new Error('User tidak ditemukan/belum login');
      }

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

      // if (insertError) throw insertError;
      if (insertError) {
        console.log(insertError);
        throw insertError;
      }

      durations.value.unshift(data);

      const productStore = useProductStore();
      const product = productStore.products.find((p) => p.id === product_id);

      if (product) {
        // Pastikan paket produk ada dan memiliki array product_package_durations
        const productPackage = product.product_packages.find(
          (pkg) => pkg.id === product_package_id,
        );

        if (productPackage) {
          // Inisialisasi jika belum ada
          productPackage.product_package_durations = productPackage.product_package_durations || [];
          // Menambahkan durasi ke dalam array product_package_durations
          productPackage.product_package_durations.unshift(data);
        }
      }

      handleResponse({ message, error }, 'success', 'menambah durasi paket produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambah durasi paket produk', { err });
    } finally {
      loading.value = false;
    }
  };

  const deleteProductPackageDuration = async (durationId) => {
    loading.value = true;
    resetMessageState();

    try {
      // Hapus paket dari database
      const { error: deleteError } = await supabase
        .from('product_package_durations')
        .delete()
        .eq('id', durationId);

      if (deleteError) throw deleteError;

      // Hapus paket dari state lokal
      durations.value = durations.value.filter((d) => d.id !== durationId);

      // Update produk di store agar UI langsung diperbarui
      const productStore = useProductStore();
      productStore.products.forEach((product) => {
        product.product_packages.forEach((pkg) => {
          // Hapus durasi dari product_package_durations
          pkg.product_package_durations = pkg.product_package_durations.filter(
            (d) => d.id !== durationId,
          );
        });
      });

      handleResponse({ message, error }, 'success', 'menghapus durasi paket produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus durasi paket produk', { err });
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    durations,
    loading,
    message,
    error,

    // Methods
    resetMessageState,
    fetchProductPackageDurations,
    addProductPackageDuration,
    deleteProductPackageDuration,
  };
});
