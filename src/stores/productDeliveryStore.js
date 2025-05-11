import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';

import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/services/storageService';

export const useProductDeliveryStore = defineStore('productDeliveryStore', () => {
  /**========================================================================
   **   STATE & COMPUTED
   *========================================================================**/

  // 📌 States
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  const productDeliveries = ref([]);
  const currentProductDelivery = ref(null);

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

  //    ...

  /**========================================================================
   **   METHODS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Fetch Product Deliveries
   *------------------------------------------------------------------------**/

  //   ...

  /**------------------------------------------------------------------------
   *    Fetch Product Deliveries by Users
   *------------------------------------------------------------------------**/

  const fetchProductDeliveriesByUser = async (statusFilter = null) => {
    loading.value = true;
    resetMessageState();

    try {
      // 📌 Cek User
      const user_id = useAuthStore().user?.id;
      if (!user_id) throw new Error('User tidak ditemukan/belum login');

      // 📌 Select Supabase
      const { data, error: fetchError } = await supabase
        .from('product_deliveries')
        .select(`*, orders (*), delivery_types(*)`)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // 📌 Filter hasil data berdasarkan user_id dari relasi orders
      let filteredData = data.filter((delivery) => delivery.orders?.user_id === user_id);

      // 📌 Jika statusFilter diberikan, filter juga berdasarkan status
      if (statusFilter) {
        filteredData = filteredData.filter((delivery) => delivery.status === statusFilter);
      }

      productDeliveries.value = filteredData;
      handleResponse({ message, error }, 'success', 'mengambil data pengiriman produk', {
        showToast: false,
      });
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil data pengiriman produk', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Product Delivery by ID
   *------------------------------------------------------------------------**/

  const fetchProductDeliveryById = async (productDeliveryId) => {
    loading.value = true;
    resetMessageState();

    try {
      const userId = useAuthStore().user?.id;
      if (!userId) throw new Error('User belum login');

      const { data, error: fetchError } = await supabase
        .from('product_deliveries')
        .select('*, delivery_types(*)')
        .eq('id', productDeliveryId)
        .single();

      if (fetchError) throw fetchError;

      currentProductDelivery.value = data;

      handleResponse(
        { message, error },
        'success',
        'mengambil data pengiriman produk berdasarkan id',
        {
          showToast: true,
        },
      );
      return data;
    } catch (err) {
      currentProductDelivery.value = null;

      handleResponse(
        { message, error },
        'error',
        'mengambil data pengiriman produk berdasarkan id',
        { err },
      );
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Add Product Delivery
   *------------------------------------------------------------------------**/

  const addProductDelivery = async (orderId, deliveryTypeId, status = 'pending', metadata = {}) => {
    loading.value = true;
    resetMessageState();

    try {
      // 📌 User
      const user_id = useAuthStore().user?.id;
      if (!user_id) throw new Error('User tidak ditemukan/belum login');

      // 📌 Cek kelengkapan data
      if (!orderId || !deliveryTypeId) throw new Error('Data kurang lengkap');

      // 📌 Insert ke Supabase
      const { data, error: insertError } = await supabase
        .from('product_deliveries')
        .insert([
          {
            order_id: orderId,
            delivery_type_id: deliveryTypeId,
            status: status, // pending, delivered, confirmed, failed
            metadata: metadata,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      //   orders.value.unshift(data);

      handleResponse({ message, error }, 'success', 'menambahkan product delivery');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambahkan product delivery', { err });
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Update Product Delivery
   *------------------------------------------------------------------------**/

  const updateProductDelivery = async (productDeliveryId, updatedData) => {
    if (!productDeliveryId) {
      const err = new Error('Order ID diperlukan');
      handleResponse({ message, error }, 'error', 'memperbarui status pesanan', { err });
      throw err;
    }

    loading.value = true;
    resetMessageState();

    try {
      // 📌 Update pengiriman produk di Supabase
      const { data, error: updateError } = await supabase
        .from('product_deliveries')
        .update(updatedData)
        .eq('id', productDeliveryId);

      if (updateError) throw updateError;

      handleResponse({ message, error }, 'success', 'memperbarui data pengiriman produk');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'memperbarui data pengiriman produk', { err });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Confirm Product Delivery -> Mengubah status ke 'confirmed'
   *------------------------------------------------------------------------**/

  const confirmProductDelivery = async (productDeliveryId) => {
    if (!productDeliveryId) {
      const err = new Error('ID Pengiriman Produk diperlukan');
      handleResponse({ message, error }, 'error', 'konfirmasi pengiriman produk', { err });
      throw err;
    }

    loading.value = true;
    resetMessageState();

    try {
      const { data, error: updateError } = await supabase
        .from('product_deliveries')
        .update({ status: 'confirmed' })
        .eq('id', productDeliveryId)
        .select()
        .single();

      if (updateError) throw updateError;

      handleResponse({ message, error }, 'success', 'konfirmasi pengiriman produk');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'konfirmasi pengiriman produk', { err });
      throw err;
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

    productDeliveries,
    currentProductDelivery,

    // 📌 Methods
    fetchProductDeliveriesByUser,
    fetchProductDeliveryById,
    addProductDelivery,
    updateProductDelivery,
    confirmProductDelivery,
  };
});
