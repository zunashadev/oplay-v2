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
  const error = ref(null);

  // Fungsi : Reset message and error state
  const resetMessageState = () => {
    message.value = null;
    error.value = null;
  };

  // Fetch product package berdasarkan product id
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

  // Ambil satu paket produk berdasarkan ID
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
    resetMessageState();

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
      handleResponse({ message, error }, 'error', 'menambah paket produk', { err });
    } finally {
      loading.value = false;
    }
  };

  // Hapus paket
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
      handleResponse({ message, error }, 'error', 'menghapus paket produk', { err });
    } finally {
      loading.value = false;
    }
  };

  // Edit paket produk
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

      // Update state lokal
      const index = packages.value.findIndex((pkg) => pkg.id === packageId);
      if (index !== -1) {
        packages.value[index] = data;
      }

      // Update juga productStore supaya sync
      const productStore = useProductStore();
      productStore.products.forEach((product) => {
        if (product.product_packages) {
          const pkgIndex = product.product_packages.findIndex((pkg) => pkg.id === packageId);
          if (pkgIndex !== -1) {
            product.product_packages[pkgIndex] = data;
          }
        }
      });

      handleResponse({ message, error }, 'success', 'mengedit paket produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengedit paket produk', { err });
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
    resetMessageState,
    fetchProductPackages,
    addProductPackage,
    deleteProductPackage,
    updateProductPackage,
    getProductPackageById,
  };
});
