import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';

import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/services/storageService';

export const useWalletStore = defineStore('walletStore', () => {
  /**========================================================================
   *    STATE & COMPUTED
   *========================================================================**/

  // 📌 State
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  const wallets = ref([]);
  const currentWallet = ref(null);

  // 📌 Computed
  // ...

  /**========================================================================
   *    UTILITY FUNCTIONS
   *========================================================================**/

  /**------------------------------------------------------------------------
   **   Reset Message & Error State
   *------------------------------------------------------------------------**/

  const resetMessageState = () => {
    message.value = null;
    error.value = null;
  };

  /**========================================================================
   *    FILE HANDLING
   *========================================================================**/

  // .....

  /**========================================================================
   *    METHODS
   *========================================================================**/

  /**------------------------------------------------------------------------
   **   Fetch Wallet by User
   *------------------------------------------------------------------------**/

  const fetchWalletByUser = async () => {
    loading.value = true;
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

      handleResponse({ message, error }, 'success', 'mengambil wallet berdasarkan id', {
        showToast: false,
      });
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil wallet berdasarkan id', {
        err,
      });
    } finally {
      loading.value = false;
    }
  };

  /**========================================================================
   *    RETURNS
   *========================================================================**/

  return {
    loading,
    message,
    error,

    wallets,
    currentWallet,

    fetchWalletByUser,
  };
});
