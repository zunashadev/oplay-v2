import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';

import { useAuthStore } from './authStore';
import { handleResponse } from '@/utils/responseHandler';
import { generateSlug } from '@/utils/slug';
import { storageService } from '@/utils/storageService';

export const useProductStore = defineStore('productStore', () => {
  const products = ref([]);

  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  // Fungsi : Reset message and error state
  const resetMessageState = () => {
    message.value = null;
    error.value = null;
  };

  // Fungsi : Upload gambar ke Supabase Storage
  const uploadImage = async (file) => {
    if (!file) return null;

    try {
      const publicUrl = await storageService.uploadFile(file, 'product-images', 'products', [
        'jpg',
        'jpeg',
        'png',
        'webp',
      ]);

      if (!publicUrl) return null;

      handleResponse({ message, error }, 'success', 'mengunggah gambar');
      return publicUrl;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengunggah gambar', err);
      return null;
    }
  };

  // Fungsi : Hapus gambar dari Supabase Storage
  const deleteImage = async (imageUrl) => {
    if (!imageUrl) return null;

    try {
      const success = await storageService.deleteFile(imageUrl, 'product-images');

      if (success) {
        handleResponse({ message, error }, 'success', 'menghapus gambar');
      }

      return success;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus gambar', err);
      return null;
    }
  };

  // Fungsi : Fetch semua produk
  const fetchProducts = async () => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*, product_packages (*, product_package_durations (*))')
        .order('created_at', { ascending: false });

      // Hentikan eksekusi dan lempar error ke blok catch jika terjadi error
      if (fetchError) throw fetchError;

      // Isi products dan urutkan product_packages serta product_package_durations secara manual
      products.value = data.map((product) => ({
        ...product,
        product_packages: product.product_packages
          ? product.product_packages
              .map((productPackage) => ({
                ...productPackage,
                product_package_durations: productPackage.product_package_durations
                  ? productPackage.product_package_durations.sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at),
                    )
                  : [],
              }))
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Urutkan paket produk
          : [],
      }));
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil data produk', err);
    } finally {
      loading.value = false;
    }
  };

  // Fungsi : Ambil produk berdasarkan Slug
  const fetchProductBySlug = async (slug) => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*, product_packages (*, product_package_durations (*))')
        .eq('slug', slug)
        .single();

      if (fetchError) throw fetchError;

      // Urutkan product_packages dan product_package_durations
      const product = {
        ...data,
        product_packages: data.product_packages
          ? data.product_packages
              .map((productPackage) => ({
                ...productPackage,
                product_package_durations: productPackage.product_package_durations
                  ? productPackage.product_package_durations.sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at),
                    )
                  : [],
              }))
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          : [],
      };

      return product;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil detail produk', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Fungsi : Ambil produk berdasarkan ID
  const fetchProductById = async (id) => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*, product_packages (*, product_package_durations (*))')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Urutkan product_packages dan product_package_durations
      const product = {
        ...data,
        product_packages: data.product_packages
          ? data.product_packages
              .map((productPackage) => ({
                ...productPackage,
                product_package_durations: productPackage.product_package_durations
                  ? productPackage.product_package_durations.sort(
                      (a, b) => new Date(b.created_at) - new Date(a.created_at),
                    )
                  : [],
              }))
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          : [],
      };

      return product;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil produk berdasarkan ID', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Fungsi : Tambah produk baru
  const addProduct = async (name, category, description, file) => {
    loading.value = true;
    resetMessageState();

    try {
      // Cek user
      const user_id = useAuthStore().user?.id;
      if (!user_id) {
        throw new Error('User tidak ditemukan/belum login');
      }

      // Generate slug unik
      const slug = await generateSlug(name, 'products');

      // Upload gambar
      let image_url = null;
      if (file) {
        image_url = await uploadImage(file);
        if (!image_url) return; // Stop eksekusi jika gambar tidak valid, message dan error diambil dari fungsi uploadImage()
      }

      // Simpan produk ke database
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([{ name, slug, category, user_id, description, image_url }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Tambahkan daftar paket kosong agar konsisten
      data.product_packages = [];
      products.value.unshift(data);

      handleResponse({ message, error }, 'success', 'menambah produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambah produk', err);
    } finally {
      loading.value = false;
    }
  };

  // Fungsi : Hapus produk
  const deleteProduct = async (productId) => {
    loading.value = true;
    resetMessageState();

    try {
      // Ambil produk berdasarkan ID
      // ! bagian select coba dipertimbangin lagi, hanya butuh image_url atau butuh semua data
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', productId)
        .single();

      if (fetchError) throw fetchError;

      // Hapus gambar jika ada
      if (product?.image_url) {
        const imageDeleted = await deleteImage(product.image_url);
        if (!imageDeleted) {
          console.error('Gagal menghapus gambar, produk tidak akan dihapus.');
          return; // Stop eksekusi jika gagal hapus gambar
        }
      }

      // Hapus produk dari database
      const { error: deleteError } = await supabase.from('products').delete().eq('id', productId);

      if (deleteError) throw deleteError;

      // Hapus produk dari state lokal
      products.value = products.value.filter((p) => p.id !== productId);

      handleResponse({ message, error }, 'success', 'menghapus produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus produk', err);
    } finally {
      loading.value = false;
    }
  };

  // Fungsi : Edit produk
  const updateProduct = async (productId, updatedData, newFile = null) => {
    loading.value = true;
    resetMessageState();

    try {
      // Ambil produk lama
      const oldProduct = products.value.find((p) => p.id === productId);
      if (!oldProduct) throw new Error('Produk tidak ditemukan');

      // Jika ada file baru, upload gambar baru
      if (newFile) {
        const newImageUrl = await uploadImage(newFile);
        if (!newImageUrl) return; // uploadImage akan set message/error jika gagal

        // Hapus gambar lama
        if (oldProduct.image_url) {
          await deleteImage(oldProduct.image_url);
        }

        // Tambahkan image_url ke data yang akan diupdate
        updatedData.image_url = newImageUrl;
      }

      // Update produk di Supabase
      const { data, error: updateError } = await supabase
        .from('products')
        .update(updatedData)
        .eq('id', productId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update produk di state lokal
      const index = products.value.findIndex((p) => p.id === productId);
      if (index !== -1) {
        // Jaga agar product_packages tetap ada
        const oldPackages = products.value[index].product_packages || [];
        products.value[index] = {
          ...updatedData,
          ...data,
          product_packages: oldPackages,
        };
      }

      handleResponse({ message, error }, 'success', 'mengedit produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengedit produk', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    products,
    loading,
    message,
    error,

    // Methods
    resetMessageState,
    fetchProducts,
    fetchProductBySlug,
    fetchProductById,
    addProduct,
    deleteProduct,
    updateProduct,
  };
});
