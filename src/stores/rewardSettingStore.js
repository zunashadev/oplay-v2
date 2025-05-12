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

  const isFetchingList = ref(false);
  const isFetchingDetail = ref(false);
  const isCreating = ref(false);
  const isUpdating = ref(false);
  const isDeleting = ref(false);

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
   *    Generate Reward Settings
   *------------------------------------------------------------------------**/

  const generateRewardSettings = async () => {
    const rewardSettingsData = [
      {
        type: 'referral',
        key: 'referral_new_user',
        description: 'Bonus untuk user baru yang mendaftar',
        amount: 5000,
        is_active: false,
      },
      {
        type: 'referral',
        key: 'referral_referrer',
        description: 'Bonus untuk user yang mengundang user lain',
        amount: 3000,
        is_active: false,
      },
      {
        type: 'purchase',
        key: 'first_purchase',
        description: 'Bonus untuk pembelian pertama',
        amount: 10000,
        is_active: false,
      },
      {
        type: 'purchase',
        key: 'product_purchase',
        description: 'Reward untuk setiap pembelian produk',
        amount: 1000,
        is_active: false,
      },
      {
        type: 'manual',
        key: 'manual_reward',
        description: 'Reward khusus yang diberikan oleh admin untuk alasan tertentu',
        amount: 10000,
        is_active: false,
      },
    ];

    if (rewardSettings) {
      for (const reward of rewardSettingsData) {
        await addRewardSetting(
          reward.type,
          reward.key,
          reward.description,
          reward.amount,
          reward.is_active,
        );
      }
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Reward Settings
   *------------------------------------------------------------------------**/

  const fetchAllRewardSettings = async () => {
    isFetchingList.value = true;
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
      isFetchingList.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Reward Setting by ID
   *------------------------------------------------------------------------**/

  const fetchRewardSettingById = async (id) => {
    isFetchingDetail.value = true;
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
      isFetchingDetail.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Reward Settings (Grouped by Type)
   *------------------------------------------------------------------------**/

  const fetchGroupedRewardSettings = async () => {
    isFetchingList.value = true;
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
      isFetchingList.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Add Reward Setting
   *------------------------------------------------------------------------**/

  const addRewardSetting = async (type, key, description, amount, is_active = false) => {
    isCreating.value = true;
    resetMessageState();

    try {
      // 📌 Cek user
      const user_id = useAuthStore().user?.id;
      if (!user_id) {
        throw new Error('User tidak ditemukan/belum login');
      }

      // 📌 Simpan reward setting ke database
      const { data, error: insertError } = await supabase
        .from('reward_settings')
        .insert([
          {
            type,
            key,
            description,
            amount,
            is_active,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 📌 Fetch ulang kategori
      await fetchGroupedRewardSettings();

      handleResponse({ message, error }, 'success', 'menambah reward setting');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambah reward setting', { err });
      throw err;
    } finally {
      isCreating.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Update is_active Status
   *------------------------------------------------------------------------**/

  const toggleRewardSettingStatus = async (id, newStatus) => {
    isUpdating.value = true;
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
      isUpdating.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Update Amount
   *------------------------------------------------------------------------**/

  const updateRewardSettingAmount = async (id, newAmount) => {
    isUpdating.value = true;
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

    rewardSettings,
    groupedRewardSettings,
    currentRewardSetting,

    generateRewardSettings,
    fetchAllRewardSettings,
    fetchRewardSettingById,
    fetchGroupedRewardSettings,
    addRewardSetting,
    toggleRewardSettingStatus,
    updateRewardSettingAmount,
  };
});
