import { defineStore } from 'pinia';
import { ref } from 'vue';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from './authStore';

import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/services/storageService';

export const useRewardEventStore = defineStore('rewardEventStore', () => {
  /**========================================================================
   **   STATE & COMPUTED
   *========================================================================**/

  // 📌 State
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  const rewardEvents = ref([]);
  const currentRewardEvent = ref(null);

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

  //   .....

  /**========================================================================
   **   METHODS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Fetch Reward Events (Admin)
   *------------------------------------------------------------------------**/

  const fetchAllRewardEvents = async () => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('reward_events')
        .select(
          `
          *,
          profile: user_id (*),
          reward_settings: reward_setting_id (*)
        `,
        )
        .order('created_at', { ascending: false });

      if (fetchError) throw new Error(fetchError.message);

      rewardEvents.value = data;

      handleResponse({ message, error }, 'success', 'mengambil semua reward event');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil semua reward event', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Reward Event by User
   *------------------------------------------------------------------------**/

  const fetchRewardEventsByUser = async () => {
    loading.value = true;
    resetMessageState();

    try {
      // 📌 Dapatkan id user
      const user_id = useAuthStore().user?.id;
      if (!user_id) throw new Error('User tidak ditemukan/belum login');

      // 📌 Query untuk mendapatkan reward events berdasarkan user_id
      const { data, error: fetchError } = await supabase
        .from('reward_events')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

      if (fetchError) throw new Error(fetchError.message);

      // 📌 Menyimpan hasil ke state
      rewardEvents.value = data;

      handleResponse({ message, error }, 'success', 'mengambil reward events', {
        showToast: false,
      });
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil reward events', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Add Reward Event (Edge Function)
   *------------------------------------------------------------------------**/

  const addRewardEvent = async (payload) => {
    loading.value = true;
    resetMessageState();

    try {
      // 📌 Dapatkan akses token
      const authStore = useAuthStore();
      const accessToken = authStore.session?.access_token;

      if (!accessToken) throw new Error('Tidak ada akses token');

      // 📌 Validasi payload minimal
      if (!payload || !payload.user_id || !payload.reward_setting_id || !payload.status) {
        throw new Error('Data reward tidak lengkap atau tidak valid.');
      }

      // 📌 Validasi metadata objek
      if (payload.metadata && typeof payload.metadata !== 'object') {
        throw new Error('Metadata harus berupa object.');
      }

      // 📌 Menambah reward event -> Edge Function
      const res = await fetch(
        'https://usiluuzsrawbybmslrml.supabase.co/functions/v1/create-reward-events',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      // 📌 Handle response
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Error ${res.status}: ${errText}`);
      }

      // 📌 Parse response data
      const data = await res.json();

      // 📌 Validasi isi response
      if (!data.message || data.message !== 'Reward event created') {
        throw new Error('Response dari server tidak sesuai.');
      }

      handleResponse({ message, error }, 'success', 'menambahkan reward');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambahkan reward', { err });
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Claim Reward Event (Edge Function)
   *------------------------------------------------------------------------**/

  const claimRewardEvent = async (reward_event_id) => {
    loading.value = true;
    resetMessageState();

    try {
      // 📌 Dapatkan akses token
      const authStore = useAuthStore();
      const accessToken = authStore.session?.access_token;

      if (!accessToken) throw new Error('Tidak ada akses token');

      // 📌 Validasi parameter
      if (!reward_event_id) throw new Error('Reward event ID tidak valid');

      // 📌 Panggil Edge Function untuk klaim reward
      const res = await fetch(
        'https://usiluuzsrawbybmslrml.supabase.co/functions/v1/claim-reward',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ reward_event_id }),
        },
      );

      // Coba parse respons sebagai JSON terlebih dahulu
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const textData = await res.text();
        throw new Error(`Format respons tidak sesuai: ${textData}`);
      }

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${data.error || 'Error tidak dikenal'}`);
      }

      // 📌 Pemeriksaan pesan yang lebih fleksibel
      if (!data.message || !data.message.includes('claimed')) {
        throw new Error('Response dari server tidak sesuai.');
      }

      handleResponse({ message, error }, 'success', 'mengklaim reward');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengklaim reward', { err });
      return null;
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

    rewardEvents,
    currentRewardEvent,

    fetchAllRewardEvents,
    fetchRewardEventsByUser,
    addRewardEvent,
    claimRewardEvent,
  };
});
