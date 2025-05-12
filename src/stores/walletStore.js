import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';

import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/services/storageService';

export const useWalletStore = defineStore('walletStore', () => {
  /**========================================================================
   **   STATE & COMPUTED
   *========================================================================**/

  // 📌 State
  const loading = ref(false);

  const isFetchingList = ref(false);
  const isFetchingDetail = ref(false);
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);

  const message = ref(null);
  const error = ref(null);

  const wallets = ref([]);
  const currentWallet = ref(null);

  // 📌 Computed
  // ...

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
   *    Reset Users
   *------------------------------------------------------------------------**/

  const resetWalletsState = () => {
    wallets.value = [];
  };

  /**========================================================================
   **   FILE HANDLING
   *========================================================================**/

  // .....

  /**========================================================================
   **   METHODS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Fetch Wallets -> Admin
   *------------------------------------------------------------------------**/

  const fetchWallets = async () => {
    isFetchingList.value = true;
    resetMessageState();

    try {
      const { data: walletsData, error: fetchError } = await supabase
        .from('wallets')
        .select('*, profiles(*)')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      wallets.value = walletsData;
      handleResponse({ message, error }, 'success', 'mengambil semua data wallet');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil semua data wallet', { err });
    } finally {
      isFetchingList.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Wallets By ID -> Admin
   *------------------------------------------------------------------------**/

  const fetchWalletById = async (walletId) => {
    isFetchingDetail.value = true;
    resetMessageState();

    try {
      const userId = useAuthStore().user?.id;

      if (!userId) throw new Error('User tidak ditemukan/belum login');

      const { data, error: fetchError } = await supabase
        .from('wallets')
        .select('*')
        .eq('id', walletId)
        .single();

      if (fetchError) throw fetchError;

      currentWallet.value = data;
      handleResponse({ message, error }, 'success', 'mengambil data wallet berdasarkan id', {
        showToast: false,
      });
      return data;
    } catch (err) {
      currentOrder.value = null;
      handleResponse({ message, error }, 'error', 'mengambil data wallet berdasarkan id', { err });
      return null;
    } finally {
      isFetchingDetail.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Wallet by User
   *------------------------------------------------------------------------**/

  const fetchWalletByUser = async () => {
    isFetchingDetail.value = true;
    resetMessageState();

    try {
      const user_id = useAuthStore().user?.id;
      if (!user_id) throw new Error('User tidak ditemukan/belum login');

      const { data, error: fetchError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user_id)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      currentWallet.value = data;

      handleResponse({ message, error }, 'success', 'mengambil wallet berdasarkan user', {
        showToast: false,
      });
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil wallet berdasarkan user', {
        err,
      });
    } finally {
      isFetchingDetail.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *   Update Wallet
   *------------------------------------------------------------------------**/

  const updateWallet = async (walletId, updatedFields = {}) => {
    isUpdating.value = true;
    resetMessageState();

    try {
      if (!walletId) throw new Error('ID wallet tidak ditemukan');

      // 📌 Update ke database
      const { data, error: updateError } = await supabase
        .from('wallets')
        .update(updatedFields)
        .eq('id', walletId)
        .select()
        .single();

      if (updateError) throw updateError;

      // 📌 Fetch ulang wallets
      await fetchWallets();

      handleResponse({ message, error }, 'success', 'mengedit wallet');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengedit wallet', { err });
      return null;
    } finally {
      isUpdating.value = false;
    }
  };

  /**========================================================================
   **   RETURNS
   *========================================================================**/

  return {
    loading,

    isFetchingList,
    isFetchingDetail,
    isCreating,
    isUpdating,
    isDeleting,

    message,
    error,

    wallets,
    currentWallet,

    resetWalletsState,

    fetchWallets,
    fetchWalletById,
    fetchWalletByUser,
    updateWallet,
  };
});
