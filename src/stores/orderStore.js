import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';
import { useProductDeliveryStore } from './productDeliveryStore';

import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/services/storageService';
import { sendTelegramNotification } from '@/services/telegramService';

export const useOrderStore = defineStore('orderStore', () => {
  /**========================================================================
   **   STATE & COMPUTED
   *========================================================================**/

  // State
  const loading = ref(false);

  const isFetchingList = ref(false);
  const isFetchingDetail = ref(false);
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);

  const message = ref(null);
  const error = ref(null);

  const orders = ref([]);
  const currentOrder = ref(null);

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
   **   FILE HANDLING
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Upload & Delete Payment Proof Image -> Supabase Storage
   *------------------------------------------------------------------------**/

  const uploadPaymentProofImage = async (file) => {
    if (!file) return null;

    try {
      const path = await storageService.uploadFile(file, 'order-images', 'payment-proof', [
        'jpg',
        'jpeg',
        'png',
        'webp',
      ]);

      if (!path) return null;

      handleResponse({ message, error }, 'success', 'mengunggah gambar');
      return path;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengunggah gambar', { err });
      return null;
    }
  };

  const deletePaymentProofImage = async (imagePath) => {
    if (!imagePath) return null;

    try {
      const success = await storageService.deleteFile(imagePath);

      if (success) {
        handleResponse({ message, error }, 'success', 'menghapus payment proof');
      }

      return success;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus payment proof', { err });
      return null;
    }
  };

  /**========================================================================
   **   METHODS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Fetch Orders
   *------------------------------------------------------------------------**/

  const fetchOrders = async () => {
    isFetchingList.value = true;
    resetMessageState();

    try {
      const { data: ordersData, error: fetchError } = await supabase
        .from('orders')
        .select('*, profiles(*), product_deliveries(*)')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      orders.value = ordersData;
      handleResponse({ message, error }, 'success', 'mengambil semua data pesanan');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil semua data pesanan', { err });
    } finally {
      isFetchingList.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Orders By User
   *------------------------------------------------------------------------**/

  const fetchOrdersByUser = async () => {
    isFetchingList.value = true;
    resetMessageState();

    try {
      const user_id = useAuthStore().user?.id;
      if (!user_id) throw new Error('User tidak ditemukan/belum login');

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      orders.value = data;
      handleResponse({ message, error }, 'success', 'mengambil data pesanan', {
        showToast: false,
      });
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil data pesanan', { err });
    } finally {
      isFetchingList.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Order By ID
   *------------------------------------------------------------------------**/

  const fetchOrderById = async (orderId) => {
    isFetchingDetail.value = true;
    resetMessageState();

    try {
      const userId = useAuthStore().user?.id;

      if (!userId) throw new Error('User belum login');

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .eq('user_id', userId) // Batasi ke order milik user saja
        .single();

      if (fetchError) throw fetchError;

      currentOrder.value = data;
      handleResponse({ message, error }, 'success', 'mengambil data pesanan berdasarkan id', {
        showToast: false,
      });
    } catch (err) {
      currentOrder.value = null;
      handleResponse({ message, error }, 'error', 'mengambil data pesanan berdasarkan id', { err });
    } finally {
      isFetchingDetail.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Add Order
   *------------------------------------------------------------------------**/

  const addOrder = async (
    product,
    pkg,
    duration,
    total_price,
    status = 'pending',
    productDeliveryMetadata,
  ) => {
    isCreating.value = true;
    resetMessageState();

    try {
      // 📌 User
      const user_id = useAuthStore().user?.id;
      if (!user_id) throw new Error('User tidak ditemukan/belum login');

      // 📌 Validasi Input
      if (!product || !pkg || !duration || !total_price) throw new Error('Data kurang lengkap');

      // 📌 Insert ke Supabase
      const { data, error: insertError } = await supabase
        .from('orders')
        .insert([
          {
            // User ID
            user_id,

            // Produk
            product_name: product.name,
            product_category: product.product_categories.name,
            product_image_path: product.product_image_path,

            // Paket
            product_package_name: pkg.name,
            product_package_price: pkg.price,
            product_package_is_best_seller: pkg.is_best_seller,
            product_package_discount_type: pkg.discount_type,
            product_package_discount_value: pkg.discount_value,

            // Durasi
            product_package_duration_name: duration.name,
            product_package_duration_value: duration.value,

            // Other
            total_price,
            status,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      orders.value.unshift(data);

      // 📌 Insert ke Supabase -> product_deliveries
      const productDeliveryStore = useProductDeliveryStore();

      productDeliveryStore.addProductDelivery(
        data.id, // ID product
        product.delivery_type_id, // Delivery Type
        'pending', // Status
        productDeliveryMetadata, // Metadata
      );

      // 📌 Kirim Notifikasi Bot Telegram
      const botTelegramNotificationPayload = {
        customer_name: useAuthStore().profile?.name || 'Nama user tidak ditemukan',
        customer_username: useAuthStore().profile?.username || 'Username tidak ditemukan',
        product_name: product.name,
        price: total_price,
        status: status,
      };

      const jwtToken = useAuthStore().session?.access_token;

      // !!! Jangan Lupa diaktifkan
      // await sendTelegramNotification(botTelegramNotificationPayload, jwtToken);

      handleResponse({ message, error }, 'success', 'menambahkan pesanan');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambahkan pesanan', { err });
      return null;
    } finally {
      isCreating.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Submit Payment Proof
   *------------------------------------------------------------------------**/

  const submitPaymentProof = async (orderId, paymentProofImageFile) => {
    isUpdating.value = true;
    resetMessageState();

    let payment_proof_image_path = null;

    try {
      if (!orderId || !paymentProofImageFile) throw new Error('Order ID atau file tidak tersedia');

      // Upload gambar ke Supabase Storage
      if (paymentProofImageFile) {
        payment_proof_image_path = await uploadPaymentProofImage(paymentProofImageFile);
        if (!payment_proof_image_path) throw new Error('Gagal upload bukti pembayaran');
      }

      // Simpan path ke kolom payment_proof_image_path di tabel orders
      const { error: updateError } = await supabase
        .from('orders')
        .update({ payment_proof_image_path })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // Refresh data currentOrder jika sedang dibuka
      if (currentOrder.value?.id === orderId) {
        await fetchOrderById(orderId);
      }

      handleResponse({ message, error }, 'success', 'bukti pembayaran berhasil dikirim');
      return payment_proof_image_path;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengirim bukti pembayaran', { err });

      // 📌 Hapus Gambar Produk dari Supabase Storage
      if (payment_proof_image_path) {
        await deletePaymentProofImage(payment_proof_image_path);
      }

      return null;
    } finally {
      isUpdating.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Update Order Status
   *------------------------------------------------------------------------**/

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!orderId || !newStatus) {
      const err = new Error('Order ID dan status pesanan baru diperlukan');
      handleResponse({ message, error }, 'error', 'memperbarui status pesanan', { err });
      throw err;
    }

    isUpdating.value = true;
    resetMessageState();

    try {
      const { data, error: updateError } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select()
        .single();

      if (updateError) throw updateError;

      const index = orders.value.findIndex((order) => order.id === orderId);
      if (index !== -1) {
        orders.value[index].status = newStatus;
      }

      handleResponse({ message, error }, 'success', 'memperbarui status pesanan');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'memperbarui status pesanan', { err });
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Delete Order
   *------------------------------------------------------------------------**/

  const deleteOrder = async (orderId) => {
    isDeleting.value = true;
    resetMessageState();

    try {
      // Validasi
      if (!orderId) throw new Error('ID pesanan tidak valid');

      // Cek dulu apakah order-nya ada dan ambil payment_proof_image_path jika ada
      const { data: existingOrder, error: fetchError } = await supabase
        .from('orders')
        .select('payment_proof_image_path')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      // Hapus file payment proof jika ada
      if (existingOrder?.payment_proof_image_path) {
        await deletePaymentProofImage(existingOrder.payment_proof_image_path);
      }

      // Hapus order dari database
      const { error: deleteError } = await supabase.from('orders').delete().eq('id', orderId);

      if (deleteError) throw deleteError;

      // Hapus dari state orders
      orders.value = orders.value.filter((order) => order.id !== orderId);

      // Kosongkan currentOrder jika sedang dibuka
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = null;
      }

      handleResponse({ message, error }, 'success', 'menghapus pesanan');
      return true;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus pesanan', { err });
      return false;
    } finally {
      isDeleting.value = false;
    }
  };

  /**========================================================================
   **   RETURNS
   *========================================================================**/

  return {
    // 📌 States
    loading,

    isFetchingList,
    isFetchingDetail,
    isCreating,
    isUpdating,
    isDeleting,

    message,
    error,

    orders,
    currentOrder,

    // 📌 Methods
    resetMessageState,
    fetchOrders,
    fetchOrdersByUser,
    fetchOrderById,
    addOrder,
    submitPaymentProof,
    updateOrderStatus,
    deleteOrder,
  };
});
