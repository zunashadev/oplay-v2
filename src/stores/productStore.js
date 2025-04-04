import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';

export const useProductStore = defineStore('productStore', () => {
  const products = ref([]);
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

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

  // Fungsi : Generate Slug dari Nama Produk
  const generateSlug = async (name) => {
    let slug = name
      .toLowerCase()
      .replace(/\s+/g, '-') // Ganti spasi dengan "-"
      .replace(/[^\w-]+/g, ''); // Hapus karakter spesial

    let uniqueSlug = slug;
    let count = 1;

    // Cek apakah slug sudah ada di database
    while (true) {
      const { data, error } = await supabase.from('products').select('id').eq('slug', uniqueSlug);
      if (error) {
        console.error('Error saat memeriksa slug:', error);
        return slug;
      }
      if (!data || data.length === 0) break; // Jika slug belum ada, gunakan slug ini

      // Jika slug sudah ada, tambahkan angka di belakangnya
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    return uniqueSlug;
  };

  // Fungsi : Fetch semua produk
  const fetchProducts = async () => {
    loading.value = true;
    error.value = null;
    message.value = null;

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
      handleResponse('error', 'mengambil data produk', err);
    } finally {
      loading.value = false;
    }
  };

  // Fungsi : Ambil produk berdasarkan Slug
  const fetchProductBySlug = async (slug) => {
    loading.value = true;
    error.value = null;
    message.value = null;

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
      handleResponse('error', 'mengambil detail produk', err);
      return null;
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
        throw new Error('Format gambar tidak didukung! Gunakan JPG, JPEG, PNG, atau WEBP.');
      }

      // Buat nama unik & simpan di folder "products"
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Upload file ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Dapatkan URL publik gambar
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);

      handleResponse('success', 'mengunggah gambar');
      return data.publicUrl;
    } catch (err) {
      handleResponse('error', 'mengunggah gambar', err);
      return null;
    }
  };

  // Fungsi : Tambah produk baru
  const addProduct = async (name, category, description, file) => {
    loading.value = true;
    error.value = null;
    message.value = null;

    try {
      // Cek user
      const user_id = useAuthStore().user?.id;
      if (!user_id) {
        throw new Error('User tidak ditemukan/belum login');
      }

      // Generate slug unik
      const slug = await generateSlug(name);

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

      handleResponse('success', 'menambah produk');
    } catch (err) {
      handleResponse('error', 'menambah produk', err);
    } finally {
      loading.value = false;
    }
  };

  // Fungsi : Hapus gambar dari Supabase Storage
  const deleteImage = async (imageUrl) => {
    if (!imageUrl) return null;

    try {
      // Ekstrak nama file dari URL dengan cara yang lebih sederhana
      const fileName = imageUrl.split('/').pop(); // mengambil elemen terakhir, yaitu nama file
      const filePath = `products/${fileName}`;

      // Hapus gambar dari storage
      const { error: deleteError } = await supabase.storage
        .from('product-images')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      handleResponse('success', 'menghapus gambar');
      return true;
    } catch (err) {
      handleResponse('error', 'menghapus gambar', err);
      return null;
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

      handleResponse('success', 'menghapus produk');
    } catch (err) {
      handleResponse('error', 'menghapus produk', err);
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
    fetchProducts,
    fetchProductBySlug,
    addProduct,
    deleteProduct,
  };
});
