import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';
import { useProductStore } from './productStore';
import { useProductPackageStore } from './productPackageStore';

export const useProductPackageDurationStore = defineStore('productPackageDurationStore', () => {
  const durations = ref([]);
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null); // ini digunakan sebagai keterangan message apabila terjadi error

  // Handle : Response
  const handleResponse = (type, operation, err = null, customMessage = null, logError = true) => {
    if (type === 'error') {
      if (err && logError) console.error(`Gagal ${operation}:`, err.message || err);
      error.value = err?.message || 'Terjadi kesalahan!';
      message.value = customMessage || `Gagal ${operation}!`;
    } else if (type === 'success') {
      message.value = customMessage || `Berhasil ${operation}!`;
      error.value = null; // Reset error jika sebelumnya ada
    }
  };

  // Fetch product package duration berdasarkan product package id
  const fetchProductPackageDurations = async (productPackageId) => {
    loading.value = true;
    error.value = null;
    message.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from('product_package_durations')
        .select('*')
        .eq('product_package_id', productPackageId)
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      durations.value = data;
    } catch (err) {
      handleResponse('error', 'mengambil data durasi paket produk', err);
    } finally {
      loading.value = false;
    }
  };

  const addProductPackageDuration = async (product_id, product_package_id, unit, value) => {
    loading.value = true;
    error.value = null;
    message.value = null;

    try {
      const user_id = useAuthStore().user?.id;
      if (!user_id) {
        throw new Error('User tidak ditemukan/belum login');
      }

      const { data, error: insertError } = await supabase
        .from('product_package_durations')
        .insert([
          {
            product_package_id,
            unit,
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

      handleResponse('success', 'menambah durasi paket produk');
    } catch (err) {
      handleResponse('error', 'menambah durasi paket produk', err);
    } finally {
      loading.value = false;
    }
  };

  const deleteProductPackageDuration = async (durationId) => {
    loading.value = true;
    error.value = null;
    message.value = null;

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

      handleResponse('success', 'menghapus paket produk');
    } catch (err) {
      handleResponse('error', 'menghapus paket produk', err);
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
    fetchProductPackageDurations,
    addProductPackageDuration,
    deleteProductPackageDuration,
  };
});
