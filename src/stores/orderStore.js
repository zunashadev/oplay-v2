import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';
import { handleResponse } from '@/utils/responseHandler';

export const useOrderStore = defineStore('orderStore', () => {
  const orders = ref([]);
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  // Fungsi : Reset message and error state
  const resetMessageState = () => {
    message.value = null;
    error.value = null;
  };

  // Fungsi : Fetch order by user_id
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

  // Fungsi : Tambah Order
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

      handleResponse({ message, error }, 'success', 'menambahkan pesanan');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambahkan pesanan', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    orders,
    loading,
    message,
    error,
    resetMessageState,
    fetchOrdersByUser,
    addOrder,
  };
});
