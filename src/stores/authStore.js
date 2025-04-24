import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { supabase } from '@/lib/supabase';
import { useRewardEventStore } from './rewardEventStore';

import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/services/storageService';
import { deleteUserViaEdge } from '@/services/authService';

export const useAuthStore = defineStore('authStore', () => {
  /**========================================================================
   *    STATE & COMPUTED
   *========================================================================**/

  // State
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  const session = ref(null);
  const user = ref(null);
  const users = ref([]);
  const profile = ref(null);

  // Computed
  const isAuthenticated = computed(() => !!user.value);
  const userName = computed(() => profile.value?.name || 'Guest');
  const userRole = computed(() => profile.value?.role || 'guest');
  const userAvatar = computed(() => profile.value?.avatar_url || '');

  /**========================================================================
   *    UTILITY FUNCTIONS
   *========================================================================**/

  /**------------------------------------------------------------------------
   **   Reset Authentication State
   *------------------------------------------------------------------------**/

  const resetAuthState = () => {
    user.value = null;
    session.value = null;
    profile.value = null;
  };

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

  /**------------------------------------------------------------------------
   **   Upload Avatar -> Supabase Storage
   *------------------------------------------------------------------------**/

  const uploadAvatar = async (file) => {
    if (!file) return null;

    try {
      const publicUrl = await storageService.uploadFile(file, 'user-images', 'avatars', [
        'jpg',
        'jpeg',
        'png',
        'webp',
      ]);

      if (!publicUrl) return null;

      handleResponse({ message, error }, 'success', 'mengunggah gambar');
      return publicUrl;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengunggah gambar', { err });
      return null;
    }
  };

  /**------------------------------------------------------------------------
   **   Delete Avatar -> Supabase Storage
   *------------------------------------------------------------------------**/

  const deleteAvatar = async (imageUrl) => {
    if (!imageUrl) return null;

    try {
      const success = await storageService.deleteFile(imageUrl, 'user-images');

      if (success) {
        handleResponse({ message, error }, 'success', 'menghapus avatar');
      }

      return success;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus gambar', { err });
      return null;
    }
  };

  /**========================================================================
   *    METHODS - AUTH
   *========================================================================**/

  /**------------------------------------------------------------------------
   **   Register
   *------------------------------------------------------------------------**/

  const giveReferralRewards = async (newUser, referrer_id, referral_username) => {
    const rewardStore = useRewardEventStore();

    try {
      // 📌 Ambil data reward_settings dari Supabase
      const { data: settings, error } = await supabase
        .from('reward_settings')
        .select('*')
        .in('key', ['referral_new_user', 'referral_referrer'])
        .eq('is_active', true);

      if (error || !settings) throw error || new Error('Reward settings tidak ditemukan');

      console.log('Berhasil mendapatkan reward_settings:' + settings);

      const referralUserSetting = settings.find((s) => s.key === 'referral_new_user');
      const referrerSetting = settings.find((s) => s.key === 'referral_referrer');

      console.log('Berhasil mendapatkan referralUserSetting:' + referralUserSetting);
      console.log('Berhasil mendapatkan referrerSetting:' + referrerSetting);

      // 📌 Reward untuk user baru pengguna kode referral
      await rewardStore.addRewardEvent({
        user_id: newUser.id,
        reward_setting_id: referralUserSetting.id,
        amount: referralUserSetting.amount,
        note: `Bonus mendaftar dengan kode referral ${referral_username}`,
        status: 'pending',
        metadata: {
          referral_username,
        },
      });

      // 📌 Reward untuk pemilik referral
      await rewardStore.addRewardEvent({
        user_id: referrer_id,
        reward_setting_id: referrerSetting.id,
        amount: referrerSetting.amount,
        note: `User ${newUser.username} mendaftar menggunakan kode referral Anda`,
        status: 'pending',
        metadata: {
          new_user_username: newUser.username,
        },
      });
    } catch (err) {
      console.warn('Gagal memberi reward referral:', err);
    }
  };

  const register = async (
    email,
    password,
    name,
    username,
    avatar_url,
    referral_username = null,
  ) => {
    // 📌 Validasi form awal - ini juga sudah di cek pada komponen input (dsb) menggunakan required
    if (!name || !username || !email || !password) {
      const err = new Error('Nama lengkap, username, email, dan password diperlukan!');
      handleResponse({ message, error }, 'error', 'mendaftar', { err, showToast: false });

      throw err;
    }

    // 📌 ...
    loading.value = true;
    resetMessageState();

    try {
      // 📌 validasi username unik
      const { data: existingUsername } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (existingUsername) throw new Error(`Username "${username}" sudah digunakan`);

      // 📌 Validasi referral tidak boleh diri sendiri
      if (referral_username === username) {
        throw new Error('Kode referral tidak boleh milik sendiri.');
      }

      // 📌 Validasi referral username (apakah ada)
      let referrer_id = null;

      if (referral_username) {
        const { data: referrer, error: referrerError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', referral_username)
          .single();

        if (referrerError || !referrer) {
          throw new Error(`Kode referral "${referral_username}" tidak ditemukan`);
        }

        referrer_id = referrer.id;
      }

      // 📌 Register user (Supabase Auth)
      const { data: userData, error: registerError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (registerError) throw registerError;

      console.log('User berhasil dibuat:', userData.user);

      user.value = userData.user;
      session.value = userData.session;

      // 📌 Insert ke tabel profiles
      const profilePayload = {
        id: userData.user.id,
        name,
        username,
        avatar_url,
        role: 'customer',
        referral_code: username, // Referral code = username pengguna ini
        ...(referrer_id && { referrer_id }), // Tambahkan hanya jika ada

        // ! 🕵️ Debug error saat insert profil
        // invalid_field: 'tes',
      };

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([profilePayload])
        .select();

      console.log('Mencoba membuat profil:', { profileData, profileError });

      // 📌 Jika gagal membuat profil, rollback dengan menghapus pengguna dari Supabase Auth
      if (profileError) {
        console.log('profileError terdeteksi:', profileError);

        try {
          resetAuthState();
          await deleteUserViaEdge(userData.user.id, userData.session.access_token, true);
          console.log('deleteUserViaEdge berhasil dijalankan');
        } catch (err) {
          console.error('deleteUserViaEdge gagal dijalankan:', err);
        }

        throw new Error(profileError.message);
      }

      // 📌 Ambil profil (dari insert atau fetch ulang menggunakan interval waktu)
      let currentProfile = profileData?.[0];

      if (!currentProfile) {
        let timeSpent = 0;
        const maxWaitTime = 5000;
        const interval = 500;

        while (timeSpent < maxWaitTime) {
          await new Promise((resolve) => setTimeout(resolve, interval));
          currentProfile = await fetchUserProfile();

          if (currentProfile) {
            break;
          }

          timeSpent += interval;
        }

        if (!currentProfile) {
          await logout();
          throw new Error('Gagal mengambil data profil. Silakan coba login kembali.');
        }
      }

      profile.value = currentProfile;

      // 📌 Membuat wallet baru untuk user
      const createWalletResponse = await fetch(
        'https://usiluuzsrawbybmslrml.supabase.co/functions/v1/create-wallet',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${userData.session.access_token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const walletData = await createWalletResponse.json();

      if (createWalletResponse.status !== 201) {
        throw new Error(walletData.error || 'Gagal membuat wallet');
      }

      console.log('Wallet berhasil dibuat:', walletData.message);

      // 📌 Reward referral
      if (referrer_id) {
        await giveReferralRewards(currentProfile, referrer_id, referral_username);
      }

      handleResponse({ message, error }, 'success', 'mendaftar');
      return currentProfile;
    } catch (err) {
      console.error('Error registrasi:', err);
      handleResponse({ message, error }, 'error', 'mendaftar', { err });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   **   Login
   *------------------------------------------------------------------------**/

  const login = async (email, password) => {
    if (!email || !password) {
      const err = new Error('Email dan password diperlukan!');
      handleResponse({ message, error }, 'error', 'login', { err });
      throw err;
    }

    loading.value = true;
    resetMessageState();

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      user.value = data.user;
      session.value = data.session;
      await fetchUserProfile();

      handleResponse({ message, error }, 'success', 'login');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'login', { err });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   **   Logout
   *------------------------------------------------------------------------**/

  const logout = async () => {
    loading.value = true;
    resetMessageState();

    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;

      resetAuthState();
      handleResponse({ message, error }, 'success', 'logout');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'logout', { err });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   **   Fetch All Users
   *------------------------------------------------------------------------**/

  const fetchAllUsers = async () => {
    loading.value = true;
    resetMessageState();

    try {
      const jwtToken = session?.value.access_token;

      const res = await fetch('https://usiluuzsrawbybmslrml.supabase.co/functions/v1/list-users', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Error ${res.status}: ${errText}`);
      }

      const { users: fetchedUsers } = await res.json();
      users.value = fetchedUsers;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil semua pengguna', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   **   Update User (email/password)
   *!   Masih error
   *------------------------------------------------------------------------**/

  const updateUser = async (newEmail, newPassword) => {
    if (!user.value) {
      const err = new Error('Pengguna tidak terautentikasi');
      handleResponse({ message, error }, 'error', 'memperbarui data pengguna', { err });
      throw err;
    }

    loading.value = true;
    resetMessageState();

    try {
      const updates = {};
      if (newEmail) updates.email = newEmail;
      if (newPassword) updates.password = newPassword;

      if (Object.keys(updates).length === 0) {
        throw new Error('Tidak ada data yang diubah.');
      }

      const { data, error: updateError } = await supabase.auth.updateUser(updates);

      console.log('newEmail as sent to Supabase:', `"${newEmail}"`);
      console.log('updates:', updates);

      if (updateError) throw updateError;

      user.value = data.user;

      handleResponse({ message, error }, 'success', 'memperbarui data pengguna');
      return data.user;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'memperbarui data pengguna', { err });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**========================================================================
   *    PROFILE METHODS
   *========================================================================**/

  /**------------------------------------------------------------------------
   **   Fetch User Profile
   *------------------------------------------------------------------------**/

  const fetchUserProfile = async () => {
    if (!user.value) return null;

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .maybeSingle(); // Gunakan maybeSingle alih-alih single

      if (fetchError) throw fetchError;

      if (!data) {
        console.warn('Profil belum tersedia, menunggu...');

        // Tunggu sedikit lebih lama dan coba lagi
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const { data: retryData, error: retryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.value.id)
          .maybeSingle();

        if (retryError) throw retryError;

        if (!retryData) {
          throw new Error('Profil pengguna tidak ditemukan setelah percobaan ulang');
        }

        profile.value = retryData;
        return retryData;
      }

      profile.value = data;
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil profil pengguna', { err });
      throw err;
    }
  };

  /**------------------------------------------------------------------------
   **   Update Profile
   *------------------------------------------------------------------------**/

  const updateProfile = async (updatedData, newAvatarFile = null) => {
    if (!user.value) {
      const err = new Error('Pengguna tidak terautentikasi');
      handleResponse({ message, error }, 'error', 'memperbarui profil', { err });
      throw err;
    }

    loading.value = true;
    resetMessageState();

    try {
      // 1. Handle avatar upload jika ada
      if (newAvatarFile) {
        const newAvatarUrl = await uploadAvatar(newAvatarFile);
        if (!newAvatarUrl) return;

        // 2. Hapus avatar lama jika ada
        if (profile.value?.avatar_url) {
          await deleteAvatar(profile.value.avatar_url);
        }

        // 3. Tambahkan avatar_url ke data yang akan diupdate
        updatedData.avatar_url = newAvatarUrl;
      }

      // 4. Update profil di Supabase
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', profile.value.id)
        .select()
        .single();

      if (updateError) throw updateError;

      profile.value = data;
      handleResponse({ message, error }, 'success', 'memperbarui profil');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'memperbarui profil', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   **   Update Role Pengguna
   *    Admnin only / di dashboard user list
   *------------------------------------------------------------------------**/

  const updateUserRole = async (userId, newRole) => {
    if (!userId || !newRole) {
      const err = new Error('User ID dan role baru diperlukan');
      handleResponse({ message, error }, 'error', 'memperbarui role pengguna', { err });
      throw err;
    }

    loading.value = true;
    resetMessageState();

    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      // Update list profiles agar sinkron
      const index = users.value.findIndex((user) => user.id === userId);
      if (index !== -1 && users.value[index].profile) {
        users.value[index].profile.role = newRole;
      }

      handleResponse({ message, error }, 'success', 'memperbarui role pengguna');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'memperbarui role pengguna', { err });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**========================================================================
   *    SESSION MANAGEMENT
   *========================================================================**/

  /**------------------------------------------------------------------------
   **   Init Auth (nama awalnya -> Get Current Session)
   *------------------------------------------------------------------------**/

  const initAuth = async () => {
    try {
      const {
        data: { session: currentSession },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (currentSession) {
        user.value = currentSession.user;
        session.value = currentSession;

        try {
          await fetchUserProfile(); // Bisa lempar error jika profil tidak ada
        } catch (profileErr) {
          // Profil user tidak ditemukan, logout paksa
          await logout();

          // Redirect ke login atau halaman lain
          window.location.href = '/auth/login';

          throw new Error('Profil pengguna tidak ditemukan. Anda telah logout otomatis.');
        }
        return currentSession;
      } else {
        resetAuthState();
        return null;
      }
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil sesi pengguna', { err });
      resetAuthState();
      return null;
    }
  };

  /**------------------------------------------------------------------------
   **   Setup Listener for Auth State Changes
   *------------------------------------------------------------------------**/

  supabase.auth.onAuthStateChange((event, currentSession) => {
    if (event === 'SIGNED_IN') {
      user.value = currentSession?.user || null;
      session.value = currentSession || null;

      // Tambahkan delay sebelum mencoba fetch profil
      setTimeout(() => {
        // Cek apakah masih dalam session yang valid
        if (user.value && user.value.id) {
          fetchUserProfile().catch((err) => {
            console.error('Failed to fetch profile after auth state change:', err);
            // Jika profile tidak ditemukan, mungkin user telah dihapus
            // Reset auth state dan redirect ke login
            resetAuthState();
            // Redirect jika dibutuhkan
            // window.location.href = '/auth/login';
          });
        }
      }, 1000);
    } else if (event === 'SIGNED_OUT') {
      resetAuthState();
    }
  });

  /**========================================================================
   *    Return
   *========================================================================**/

  return {
    // State
    session,
    user,
    users,
    profile,
    loading,
    message,
    error,

    // Computed
    isAuthenticated,
    userName,
    userRole,
    userAvatar,

    // Methods
    login,
    register,
    logout,
    updateProfile,
    initAuth,
    resetMessageState,
    updateUser,
    updateUserRole,
    fetchAllUsers,
  };
});
