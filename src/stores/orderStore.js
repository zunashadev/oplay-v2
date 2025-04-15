import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';

import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/utils/storageService';
import { sendTelegramNotification } from '@/utils/telegramService';

export const useOrderStore = defineStore('orderStore', () => {
  /**========================================================================
   *    STATE & COMPUTED
   *========================================================================**/

  // State
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  const orders = ref([]);
  const currentOrder = ref(null); // order yang sedang diakses per id

  /**========================================================================
   *    UTILITY FUNCTIONS
   *========================================================================**/

  // Reset message and error state
  const resetMessageState = () => {
    message.value = null;
    error.value = null;
  };

  /**========================================================================
   *    FILE HANDLING
   *========================================================================**/

  // Upload paymet proof ke Supabase Storage
  const uploadPaymentProof = async (file) => {
    if (!file) return null;

    try {
      const publicUrl = await storageService.uploadFile(file, 'order-images', 'payment-proof', [
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

  // Hapus paymet proof ke Supabase Storage
  const deletePaymentProof = async (imageUrl) => {
    if (!imageUrl) return null;

    try {
      const success = await storageService.deleteFile(imageUrl, 'order-images');

      if (success) {
        handleResponse({ message, error }, 'success', 'menghapus payment proof');
      }

      return success;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus payment proof', err);
      return null;
    }
  };

  /**========================================================================
   *    ORDER METHODS
   *========================================================================**/

  // Fetch orders
  const fetchOrders = async () => {
    loading.value = true;
    resetMessageState();

    try {
      const { data: ordersData, error: fetchError } = await supabase
        .from('orders')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      orders.value = ordersData;
      handleResponse({ message, error }, 'success', 'mengambil semua data pesanan');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil semua data pesanan', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch orders by user_id
  const fetchOrdersByUser = async () => {
    loading.value = true;
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
      handleResponse({ message, error }, 'success', 'mengambil data pesanan');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil data pesanan', err);
    } finally {
      loading.value = false;
    }
  };

  // Fetch order by id
  const fetchOrderById = async (orderId) => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      currentOrder.value = data;
      handleResponse({ message, error }, 'success', 'mengambil data pesanan berdasarkan id');
    } catch (err) {
      currentOrder.value = null;
      handleResponse({ message, error }, 'error', 'mengambil data pesanan berdasarkan id', err);
    } finally {
      loading.value = false;
    }
  };

  // Tambah Order
  const addOrder = async (product, pkg, duration, total_price, status = 'pending') => {
    loading.value = true;
    resetMessageState();

    try {
      // User
      const user_id = useAuthStore().user?.id;
      if (!user_id) throw new Error('User tidak ditemukan/belum login');

      // ....
      if (!product || !pkg || !duration || !total_price) {
        throw new Error('Data kurang lengkap');
      }

      //   console.log(product.name);

      // ....
      const { data, error: insertError } = await supabase
        .from('orders')
        .insert([
          {
            user_id,
            product_name: product.name,
            product_category: product.category,
            product_image_url: product.image_url,
            product_package_name: pkg.name,
            product_package_price: pkg.price,
            product_package_is_best_seller: pkg.is_best_seller,
            product_package_discount_type: pkg.discount_type,
            product_package_discount_value: pkg.discount_value,
            product_package_duration_name: duration.name,
            product_package_duration_value: duration.value,
            total_price,
            status,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      orders.value.unshift(data);

      // START : Kirim Notifikasi Bot Telegram
      const botTelegramNotificationPayload = {
        customer_name: useAuthStore().profile?.name || 'Nama user tidak ditemukan',
        customer_username: useAuthStore().profile?.username || 'Username tidak ditemukan',
        product_name: product.name,
        price: total_price,
        status: status,
      };

      const jwtToken = useAuthStore().session?.access_token; // Ambil JWT token dari store auth

      await sendTelegramNotification(botTelegramNotificationPayload, jwtToken);
      // END : Kirim Notifikasi Bot Telegram

      handleResponse({ message, error }, 'success', 'menambahkan pesanan');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambahkan pesanan', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Submit bukti pembayaran dan simpan URL ke database
  const submitPaymentProof = async (orderId, file) => {
    loading.value = true;
    resetMessageState();

    try {
      if (!orderId || !file) throw new Error('Order ID atau file tidak tersedia');

      // 1. Upload gambar ke Supabase Storage
      const imageUrl = await uploadPaymentProof(file);
      if (!imageUrl) throw new Error('Gagal upload bukti pembayaran');

      // 2. Simpan URL ke kolom payment_proof_image_url di tabel orders
      const { error: updateError } = await supabase
        .from('orders')
        .update({ payment_proof_image_url: imageUrl })
        .eq('id', orderId);

      if (updateError) throw updateError;

      // 3. Refresh data currentOrder jika sedang dibuka
      if (currentOrder.value?.id === orderId) {
        await fetchOrderById(orderId);
      }

      handleResponse({ message, error }, 'success', 'bukti pembayaran berhasil dikirim');
      return imageUrl;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengirim bukti pembayaran', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    if (!orderId || !newStatus) {
      const err = new Error('Order ID dan status pesanan baru diperlukan');
      handleResponse({ message, error }, 'error', 'memperbarui status pesanan', err);
      throw err;
    }

    loading.value = true;
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
      handleResponse({ message, error }, 'error', 'memperbarui status pesanan', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Hapus order berdasarkan ID
  const deleteOrder = async (orderId) => {
    loading.value = true;
    resetMessageState();

    try {
      // Validasi
      if (!orderId) throw new Error('ID pesanan tidak valid');

      // Cek dulu apakah order-nya ada dan ambil payment_proof_image_url jika ada
      const { data: existingOrder, error: fetchError } = await supabase
        .from('orders')
        .select('payment_proof_image_url')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      // Hapus file payment proof jika ada
      if (existingOrder?.payment_proof_image_url) {
        await deletePaymentProof(existingOrder.payment_proof_image_url);
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
      handleResponse({ message, error }, 'error', 'menghapus pesanan', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    message,
    error,

    orders,
    currentOrder,

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
