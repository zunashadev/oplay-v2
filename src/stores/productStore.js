import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';

export const useProductStore = defineStore('productStore', () => {
  const products = ref([]);
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null); // ini digunakan sebagai keterangan message apabila terjadi error

  // Fungsi : Fetch semua produk
  const fetchProducts = async () => {
    loading.value = true;
    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*, product_packages(*)') // Ambil juga data paket terkait
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Isi products dan usrutkan product_packages secara manual
      products.value = data.map((product) => ({
        ...product,
        product_packages: product.product_packages
          ? product.product_packages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          : [],
      }));
    } catch (err) {
      message.value = 'Gagal mengambil data produk!';
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Fungsi : Upload gambar ke Supabase Storage
  const uploadImage = async (file) => {
    if (!file) return null;

    try {
      // Validasi ekstensi file
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        error.value = 'Format gambar tidak didukung! Gunakan JPG, JPEG, PNG, atau WEBP.';
        return null; // Stop proses upload jika format tidak valid
      }

      const fileName = `${Date.now()}.${fileExt}`; // Buat nama unik
      const filePath = `products/${fileName}`; // Simpan di folder "products"

      // Upload file ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Dapatkan URL publik gambar
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      message.value = 'Gagal mengunggah gambar!';
      error.value = err.message;
      return null;
    }
  };

  // Fungsi : Tambah produk baru
  const addProduct = async (name, category, description, file) => {
    loading.value = true;
    error.value = null;
    message.value = null;

    const user_id = useAuthStore().user?.id;
    if (!user_id) {
      error.value = 'User tidak ditemukan!';
      loading.value = false;
      return;
    }

    try {
      // Upload gambar
      let imageUrl = null;
      if (file) {
        imageUrl = await uploadImage(file);
        if (!imageUrl) {
          message.value = 'Gagal menambahkan produk!';
          loading.value = false;
          return; // Stop eksekusi jika gambar tidak valid
        }
      }

      // Simpan produk ke database
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([{ name, category, user_id, description, image_url: imageUrl }])
        .select()
        .single();

      // Hentikan eksekusi dan lempar error ke blok catch jika terjadi error
      if (insertError) throw insertError;

      // Tambahkan daftar paket kosong agar konsisten
      data.product_packages = [];
      products.value.unshift(data);

      message.value = 'Produk berhasil ditambahkan!';
    } catch (err) {
      message.value = 'Gagal menambahkan produk!';
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Fungsi : Hapus gambar dari Supabase Storage
  const deleteImage = async (imageUrl) => {
    if (!imageUrl) return;

    const parts = imageUrl.split('/storage/v1/object/public/product-images/');
    if (parts.length < 2) return;

    const filePath = parts[1];

    // Hapus gambar dari storage
    const { error: deleteError } = await supabase.storage.from('product-images').remove([filePath]);

    if (deleteError) {
      console.error('Gagal menghapus gambar:', deleteError.message);
    }
  };

  // Fungsi : Hapus produk
  const deleteProduct = async (productId) => {
    loading.value = true;
    error.value = null;
    message.value = null;

    try {
      // Ambil produk berdasarkan ID
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', productId)
        .single();

      if (fetchError) {
        console.error('Gagal mendapatkan produk:', fetchError.message);
        throw fetchError;
      }

      // Hapus gambar jika ada
      if (product?.image_url) {
        await deleteImage(product.image_url);
      }

      // Hapus produk dari database
      const { error: deleteError } = await supabase.from('products').delete().eq('id', productId);
      if (deleteError) {
        console.error('Gagal menghapus produk dari database:', deleteError.message);
        throw deleteError;
      }

      // Hapus produk dari state lokal
      products.value = products.value.filter((p) => p.id !== productId);
      message.value = 'Produk berhasil dihapus!';
    } catch (err) {
      error.value = err.message;
      message.value = 'Gagal menghapus produk!';
    } finally {
      loading.value = false;
    }
  };

  // Filter produk berdasarkan kategori
  const filterByCategory = (category) => {
    return computed(() => products.value.filter((product) => product.category === category));
  };

  return {
    // State
    products,
    loading,
    message,
    error,

    // Methods
    fetchProducts,
    addProduct,
    deleteProduct,
    filterByCategory,
  };
});
