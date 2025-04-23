import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';

import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/services/storageService';

export const useRewardSettingStore = defineStore('rewardSettingStore', () => {
  /**========================================================================
   *    STATE & COMPUTED
   *========================================================================**/

  // 📌 State
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  const rewardSettings = ref([]);
  const groupedRewardSettings = ref({});
  const currentRewardSetting = ref(null);

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
   **   Fetch Reward Settings
   *------------------------------------------------------------------------**/

  const fetchAllRewardSettings = async () => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('reward_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw new Error(fetchError.message);

      rewardSettings.value = data;

      handleResponse({ message, error }, 'success', 'mengambil semua reward setting');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil semua reward setting', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   **   Fetch Reward Settings (Grouped by Type)
   *------------------------------------------------------------------------**/

  const fetchGroupedRewardSettings = async () => {
    loading.value = true;
    resetMessageState();

    try {
      // 📌 Fetch data dari supabase
      const { data, error: fetchError } = await supabase
        .from('reward_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw new Error(fetchError.message);

      // 📌 Kelompokkan berdasarkan type
      groupedRewardSettings.value = data.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
      }, {});

      handleResponse({ message, error }, 'success', 'mengambil reward setting terkelompok');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil reward setting terkelompok', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   **   Edit is_active Status
   *------------------------------------------------------------------------**/

  const toggleRewardSettingStatus = async (id, newStatus) => {
    loading.value = true;
    resetMessageState();

    try {
      const { error: updateError } = await supabase
        .from('reward_settings')
        .update({ is_active: newStatus })
        .eq('id', id);

      if (updateError) throw new Error(updateError.message);

      handleResponse({ message, error }, 'success', 'mengubah status is_active');

      // Optionally: refresh data
      await fetchGroupedRewardSettings();
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengubah status is_active', { err });
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

    rewardSettings,
    groupedRewardSettings,
    currentRewardSetting,

    fetchAllRewardSettings,
    fetchGroupedRewardSettings,
    toggleRewardSettingStatus,
  };
});
