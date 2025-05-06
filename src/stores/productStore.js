import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';

import { useAuthStore } from './authStore';
import { handleResponse } from '@/utils/responseHandler';
import { generateSlug } from '@/utils/slug';
import { storageService } from '@/services/storageService';

export const useProductStore = defineStore('productStore', () => {
  /**========================================================================
   **   STATE & COMPUTED
   *========================================================================**/

  // 📌 State
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  const products = ref([]);

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

  /**------------------------------------------------------------------------
   *    Reset Products State
   *------------------------------------------------------------------------**/

  const resetProductsState = () => {
    products.value = [];
  };

  /**========================================================================
   **   FILE HANDLING
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Upload & Delete Product Image -> Supabase Storage
   *------------------------------------------------------------------------**/

  const uploadProductImage = async (file) => {
    if (!file) return null;

    try {
      const path = await storageService.uploadFile(file, 'product-images', 'products', [
        'jpg',
        'jpeg',
        'png',
        'webp',
      ]);

      if (!path) return null;

      handleResponse({ message, error }, 'success', 'mengunggah gambar produk');
      return path;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengunggah gambar produk', { err });
      return null;
    }
  };

  const deleteProductImage = async (imagePath) => {
    if (!imagePath) return null;

    try {
      const success = await storageService.deleteFile(imagePath);

      if (success) {
        handleResponse({ message, error }, 'success', 'menghapus gambar produk');
      }

      return success;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus gambar produk', { err });
      return null;
    }
  };

  /**------------------------------------------------------------------------
   *    Upload & Delete Product Banner Image -> Supabase Storage
   *------------------------------------------------------------------------**/

  const uploadProductBannerImage = async (file) => {
    if (!file) return null;

    try {
      const path = await storageService.uploadFile(file, 'product-images', 'banners', [
        'jpg',
        'jpeg',
        'png',
        'webp',
      ]);

      if (!path) return null;

      handleResponse({ message, error }, 'success', 'mengunggah gambar banner produk');
      return path;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengunggah gambar banner produk', { err });
      return null;
    }
  };

  const deleteProductBannerImage = async (imagePath) => {
    if (!imagePath) return null;

    try {
      const success = await storageService.deleteFile(imagePath);

      if (success) {
        handleResponse({ message, error }, 'success', 'menghapus gambar banner produk');
      }

      return success;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus gambar banner produk', { err });
      return null;
    }
  };

  /**========================================================================
   **   METHODS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Fetch Products
   *------------------------------------------------------------------------**/

  const fetchProducts = async () => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(
          '*, product_categories(*), delivery_types(*), product_packages (*, product_package_durations (*))',
        )
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // 📌 Isi products dan urutkan product_packages serta product_package_durations secara manual
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

      handleResponse({ message, error }, 'success', 'mengambil data produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil data produk', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Product by Slug
   *------------------------------------------------------------------------**/

  const fetchProductBySlug = async (slug) => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(
          '*, product_categories(*), delivery_types(*), product_packages (*, product_package_durations (*))',
        )
        .eq('slug', slug)
        .single();

      if (fetchError) throw fetchError;

      // 📌 Urutkan product_packages dan product_package_durations
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

      handleResponse({ message, error }, 'success', 'mengambil detail produk');
      return product;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil detail produk', { err });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Product by ID
   *------------------------------------------------------------------------**/

  const fetchProductById = async (id) => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('products')
        .select(
          '*, product_categories(*), delivery_types(*), product_packages (*, product_package_durations (*))',
        )
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // 📌 Urutkan product_packages dan product_package_durations
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

      handleResponse({ message, error }, 'success', 'mengambil produk berdasarkan ID');
      return product;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil produk berdasarkan ID', { err });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Add Product
   *------------------------------------------------------------------------**/

  const addProduct = async (
    name,
    categoryId,
    deliveryTypeId,
    description,
    productImageFile,
    productBannerImageFile,
  ) => {
    loading.value = true;
    resetMessageState();

    let product_image_path = null;
    let product_banner_image_path = null;

    try {
      // 📌 Cek user
      const user_id = useAuthStore().user?.id;
      if (!user_id) {
        throw new Error('User tidak ditemukan/belum login');
      }

      // 📌 Generate slug
      const slug = await generateSlug(name, 'products');

      // 📌 Upload gambar product
      if (productImageFile) {
        product_image_path = await uploadProductImage(productImageFile);
        if (!product_image_path) throw new Error('Gagal mengupload gambar produk');
      }

      // 📌 Upload gambar banner
      if (productBannerImageFile) {
        product_banner_image_path = await uploadProductBannerImage(productBannerImageFile);
        if (!product_banner_image_path) throw new Error('Gagal mengupload gambar banner produk');
      }

      // 📌 Simpan produk ke database
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([
          {
            user_id,
            name,
            slug,
            category_id: categoryId,
            delivery_type_id: deliveryTypeId,
            description,
            product_image_path,
            product_banner_image_path,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 📌 Fetch ulang produk
      await fetchProducts();

      handleResponse({ message, error }, 'success', 'menambah produk');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambah produk', { err });

      // 📌 Hapus Gambar Produk dari Supabase Storage
      if (product_image_path) {
        await deleteProductImage(product_image_path);
      }

      // 📌 Hapus Gambar Banner Produk dari Supabase Storage
      if (product_banner_image_path) {
        await deleteProductBannerImage(product_banner_image_path);
      }

      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Delete Product
   *!   Belum bisa rollback gambar yang sudah terhapus (disini ada 2 gambar) -> harusnya sudah aman selama kode hapus file(gambar) sudah benar
   *------------------------------------------------------------------------**/

  const deleteProduct = async (productId) => {
    loading.value = true;
    resetMessageState();

    try {
      // 📌 Ambil produk berdasarkan ID -> untuk hapus gambar dari supabase storage
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (fetchError) throw fetchError;

      // 📌 Hapus gambar produk jika ada
      if (product?.product_image_path) {
        const produkImageDeleted = await deleteProductImage(product.product_image_path);

        if (!produkImageDeleted)
          throw new Error('Gagal menghapus gambar produk, produk tidak akan dihapus.');
      }

      // 📌 Hapus gambar banner produk jika ada
      if (product?.product_banner_image_path) {
        const produkBannerImageDeleted = await deleteProductBannerImage(
          product.product_banner_image_path,
        );

        if (!produkBannerImageDeleted) {
          throw new Error('Gagal menghapus gambar banner produk, produk tidak akan dihapus.');
        }
      }

      // 📌 Hapus produk dari database
      const { error: deleteError } = await supabase.from('products').delete().eq('id', productId);

      if (deleteError) throw deleteError;

      // 📌 Fetch ulang data produk setelah penghapusan
      await fetchProducts();

      handleResponse({ message, error }, 'success', 'menghapus produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus produk', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Update Product
   *------------------------------------------------------------------------**/

  const updateProduct = async (
    productId,
    updatedData,
    newProductImageFile = null,
    newProductBannerImageFile = null,
  ) => {
    loading.value = true;
    resetMessageState();

    try {
      // 📌 Ambil produk lama
      const oldProduct = products.value.find((p) => p.id === productId);
      if (!oldProduct) throw new Error('Produk tidak ditemukan');

      // 📌 Jika ada perubahan nama, perbarui slug
      if (updatedData.name && updatedData.name !== oldProduct.name) {
        updatedData.slug = await generateSlug(updatedData.name, 'products');
      }

      // 📌 Jika ada file produk baru, upload gambar baru
      if (newProductImageFile) {
        const newProductImagePath = await uploadProductImage(newProductImageFile);
        if (!newProductImagePath) throw new Error('Gagal mengupload gambar produk yang baru');

        // Hapus gambar lama
        if (oldProduct.product_image_path) {
          await deleteProductImage(oldProduct.product_image_path);
        }

        // Tambahkan image_path ke data yang akan diupdate
        updatedData.product_image_path = newProductImagePath;
      }

      // 📌 Jika ada file banner produk baru, upload gambar baru
      if (newProductBannerImageFile) {
        const newProductBannerImagePath = await uploadProductBannerImage(newProductBannerImageFile);
        if (!newProductBannerImagePath) throw new Error('Gagal mengupload gambar produk yang baru');

        // Hapus gambar lama
        if (oldProduct.product_banner_image_path) {
          await deleteProductBannerImage(oldProduct.product_banner_image_path);
        }

        // Tambahkan image_path ke data yang akan diupdate
        updatedData.product_banner_image_path = newProductBannerImagePath;
      }

      // 📌 Update produk di Supabase
      const { data, error: updateError } = await supabase
        .from('products')
        .update(updatedData)
        .eq('id', productId);

      if (updateError) throw updateError;

      // 📌 Fetch ulang produk
      await fetchProducts();

      handleResponse({ message, error }, 'success', 'mengedit produk');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengedit produk', { err });
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

    products,

    // 📌 Ulitity Functions
    resetMessageState,
    resetProductsState,

    // 📌 Methods
    fetchProducts,

    fetchProductBySlug,
    fetchProductById,

    addProduct,
    deleteProduct,
    updateProduct,
  };
});
