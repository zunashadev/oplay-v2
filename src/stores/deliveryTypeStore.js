import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';

import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/services/storageService';

export const useDeliveryTypeStore = defineStore('deliveryTypeStore', () => {
  /**========================================================================
   **   STATE & COMPUTED
   *========================================================================**/

  // 📌 States
  const loading = ref(false);

  const isFetchingList = ref(false);
  const isFetchingDetail = ref(false);
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);

  const message = ref(null);
  const error = ref(null);

  const deliveryTypes = ref([]);
  const currentDeliveryType = ref(null);

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
   *    Reset Delivery Types State
   *------------------------------------------------------------------------**/

  const resetDeliveryTypesState = () => {
    deliveryTypes.value = [];
  };

  /**========================================================================
   **   FILE HANDLING
   *========================================================================**/

  //    ...

  /**========================================================================
   **   METHODS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Fetch Delivery Types
   *------------------------------------------------------------------------**/

  const fetchDeliveryTypes = async () => {
    isFetchingList.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('delivery_types')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      deliveryTypes.value = data;
      handleResponse({ message, error }, 'success', 'mengambil semua data delivery types');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil semua data delivery types', { err });
    } finally {
      isFetchingList.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Delivery TYpe by ID
   *------------------------------------------------------------------------**/

  const fetchDeliveryTypeById = async (id) => {
    isFetchingDetail.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('delivery_types')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      handleResponse({ message, error }, 'success', 'mengambil metode pemesanan berdasarkan ID');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil metode pemesanan berdasarkan ID', {
        err,
      });
      throw err;
    } finally {
      isFetchingDetail.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Add Delivery Type
   *------------------------------------------------------------------------**/

  const addDeliveryType = async (direction, key, label, description, requiredMetadataFields) => {
    isCreating.value = true;
    resetMessageState();

    try {
      // 📌 User
      const user_id = useAuthStore().user?.id;
      if (!user_id) throw new Error('User tidak ditemukan/belum login');

      // 📌 Cek kelengkapan data
      if (!direction || !key || !label || !description || !requiredMetadataFields)
        throw new Error('Data kurang lengkap');

      // 📌 Insert ke Supabase
      const { data, error: insertError } = await supabase
        .from('delivery_types')
        .insert([
          {
            direction: direction, // admin_to_customer atau customer_to_admin
            key: key,
            label: label,
            description: description,
            required_metadata_fields: requiredMetadataFields,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 📌 Fetch ulang state deliveryTypes
      fetchDeliveryTypes();

      handleResponse({ message, error }, 'success', 'menambahkan delivery type');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambahkan delivery type', { err });
      return null;
    } finally {
      isCreating.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Update Delivery Type
   *------------------------------------------------------------------------**/

  const updateDeliveryType = async (deliveryTypeId, updatedData) => {
    isUpdating.value = true;
    resetMessageState();

    try {
      // 📌 Update metode pemesanan di Supabase
      const { data, error: updateError } = await supabase
        .from('delivery_types')
        .update(updatedData)
        .eq('id', deliveryTypeId);

      if (updateError) throw updateError;

      // 📌 Fetch ulang metode pemesanan
      await fetchDeliveryTypes();

      handleResponse({ message, error }, 'success', 'mengedit metode pemesanan');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengedit metode pemesanan', { err });
    } finally {
      isUpdating.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Delete Delivery Type
   *------------------------------------------------------------------------**/

  const deleteDeliveryType = async (deliveryTypeId) => {
    isDeleting.value = true;
    resetMessageState();

    try {
      // 📌 Validasi ID
      if (!deliveryTypeId) throw new Error('ID metode pengiriman tidak valid');

      // 📌 Hapus metode pengiriman dari database
      const { error: deleteError } = await supabase
        .from('delivery_types')
        .delete()
        .eq('id', deliveryTypeId);

      if (deleteError) throw deleteError;

      // 📌 Fetch ulang state deliveryTypes
      fetchDeliveryTypes();

      // 📌 Kosongkan currentDeliveryTypes jika sedang dibuka
      if (currentDeliveryType.value?.id === deliveryTypeId) {
        currentDeliveryType.value = null;
      }

      handleResponse({ message, error }, 'success', 'menghapus metode pengiriman');
      return true;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus metode pengiriman', { err });
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

    deliveryTypes,
    currentDeliveryType,

    resetDeliveryTypesState,

    // 📌 Methods
    fetchDeliveryTypes,
    fetchDeliveryTypeById,
    addDeliveryType,
    updateDeliveryType,
    deleteDeliveryType,
  };
});
