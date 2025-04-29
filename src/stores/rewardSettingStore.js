import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';

import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/services/storageService';

export const useRewardSettingStore = defineStore('rewardSettingStore', () => {
  /**========================================================================
   **   STATE & COMPUTED
   *========================================================================**/

  // 📌 State
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  const rewardSettings = ref([]);
  const groupedRewardSettings = ref({});
  const currentRewardSetting = ref(null);

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

  // .....

  /**========================================================================
   **   METHODS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Fetch Reward Settings
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
   *    Fetch Reward Setting by ID
   *------------------------------------------------------------------------**/

  const fetchRewardSettingById = async (id) => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('reward_settings')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw new Error(fetchError.message);

      currentRewardSetting.value = data;

      handleResponse({ message, error }, 'success', 'mengambil reward setting berdasarkan id');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil reward setting berdasarkan id', {
        err,
      });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Reward Settings (Grouped by Type)
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
   *    Update is_active Status
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

  /**------------------------------------------------------------------------
   *    Update is_active Status
   *------------------------------------------------------------------------**/

  const updateRewardSettingAmount = async (id, newAmount) => {
    loading.value = true;
    resetMessageState();

    try {
      const { error: updateError } = await supabase
        .from('reward_settings')
        .update({ amount: newAmount })
        .eq('id', id);

      if (updateError) throw new Error(updateError.message);

      handleResponse({ message, error }, 'success', 'mengubah amount reward');

      // Opsional: perbarui data lokal jika currentRewardSetting sedang aktif
      if (currentRewardSetting.value && currentRewardSetting.value.id === id) {
        currentRewardSetting.value.amount = newAmount;
      }

      // Opsional: refresh data utama
      await fetchGroupedRewardSettings();
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengubah amount reward', { err });
    } finally {
      loading.value = false;
    }
  };

  /**========================================================================
   **   RETURNS
   *========================================================================**/

  return {
    loading,
    message,
    error,

    rewardSettings,
    groupedRewardSettings,
    currentRewardSetting,

    fetchAllRewardSettings,
    fetchRewardSettingById,
    fetchGroupedRewardSettings,
    toggleRewardSettingStatus,
    updateRewardSettingAmount,
  };
});
