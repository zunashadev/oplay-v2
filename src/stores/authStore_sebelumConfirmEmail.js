import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { supabase } from '@/lib/supabase';
import { useRewardEventStore } from './rewardEventStore';

import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/services/storageService';
import { deleteUserViaEdge } from '@/services/authService';

export const useAuthStore = defineStore('authStore', () => {
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

  const session = ref(null);
  const user = ref(null);
  const profile = ref(null);

  const users = ref([]);

  // 📌 Computed
  const isAuthenticated = computed(() => !!user.value);
  const userName = computed(() => profile.value?.name || 'Guest');
  const userRole = computed(() => profile.value?.role || 'guest');
  const userAvatar = computed(() => profile.value?.avatar_url || '');

  /**========================================================================
   **   UTILITY FUNCTIONS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Reset Authentication State
   *------------------------------------------------------------------------**/

  const resetAuthState = () => {
    user.value = null;
    session.value = null;
    profile.value = null;
  };

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

  const resetUsers = () => {
    users.value = [];
  };

  /**------------------------------------------------------------------------
   *    Reset All States
   *------------------------------------------------------------------------**/

  const resetAllState = () => {
    resetAuthState();
    resetMessageState();
    resetUsers();
  };

  /**========================================================================
   **   FILE HANDLING
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Upload & Delete Avatar -> Supabase Storage
   *------------------------------------------------------------------------**/

  const uploadAvatar = async (file) => {
    if (!file) return null;

    try {
      const path = await storageService.uploadFile(file, 'user-images', 'avatars', [
        'jpg',
        'jpeg',
        'png',
        'webp',
      ]);

      if (!path) return null;

      handleResponse({ message, error }, 'success', 'mengunggah gambar');
      return path;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengunggah gambar', { err });
      return null;
    }
  };

  const deleteAvatar = async (imagePath) => {
    if (!imagePath) return null;

    try {
      const success = await storageService.deleteFile(imagePath);

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
   **   METHODS - AUTH
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Register (sudah termasuk create profil, wallet, dan reward referral jika ada)
   *------------------------------------------------------------------------**/

  const createWalletForUser = async (accessToken) => {
    try {
      const response = await fetch(
        'https://usiluuzsrawbybmslrml.supabase.co/functions/v1/create-wallet',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await response.json();

      if (response.status !== 201) {
        throw new Error(data.error || 'Gagal membuat wallet');
      }

      console.log('Wallet berhasil dibuat:', data.message);
      return data;
    } catch (error) {
      console.error('createWalletForUser error:', error);
      throw error;
    }
  };

  const giveReferralRewards = async (newUser, referrer_id, referrer_username) => {
    try {
      // 📌 Ambil data reward_settings dari Supabase
      const { data: settings, error } = await supabase
        .from('reward_settings')
        .select('*')
        .eq('type', 'referral') // ! filter berdasarkan type, harus sesuai dengan database
        .in('key', ['referral_new_user', 'referral_referrer']) // ! filter berdasarkan key, harus sesuai dengan database
        .eq('is_active', true);

      if (error || !settings) throw error || new Error('Reward settings tidak ditemukan');

      const referralNewUserSetting = settings.find((s) => s.key === 'referral_new_user');
      const referralReferrerSetting = settings.find((s) => s.key === 'referral_referrer');

      // 📌 Beri reward
      const rewardStore = useRewardEventStore();

      // Reward untuk user baru pengguna kode referral -> jika ada
      if (referralNewUserSetting) {
        await rewardStore.addRewardEvent({
          user_id: newUser.id,
          reward_setting_id: referralNewUserSetting.id,
          amount: referralNewUserSetting.amount,
          note: `Bonus mendaftar dengan kode referral ${referrer_username}`,
          status: 'pending',
          metadata: {
            referrer_username,
          },
        });
      }

      // Reward untuk pemilik referral -> jika ada
      if (referralReferrerSetting) {
        await rewardStore.addRewardEvent({
          user_id: referrer_id,
          reward_setting_id: referralReferrerSetting.id,
          amount: referralReferrerSetting.amount,
          note: `User ${newUser.username} mendaftar menggunakan kode referral Anda`,
          status: 'pending',
          metadata: {
            new_user_username: newUser.username,
          },
        });
      }
    } catch (err) {
      console.warn('Gagal memberi reward referral:', err);
    }
  };

  const register = async (email, password, name, username, referral_code = null) => {
    // 📌 Validasi form awal - ini juga sudah di cek pada komponen input (dsb) menggunakan required
    if (!name || !username || !email || !password) {
      const err = new Error('Nama lengkap, username, email, dan password diperlukan!');
      handleResponse({ message, error }, 'error', 'mendaftar', { err, showToast: false });
      throw err;
    }

    isCreating.value = true;
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
      if (referral_code === username) {
        throw new Error('Kode referral tidak boleh milik sendiri.');
      }

      // 📌 Validasi referral username (apakah ada)
      let referrer_id = null;

      if (referral_code) {
        const { data: referrer, error: referrerError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', referral_code)
          .single();

        if (referrerError || !referrer) {
          throw new Error(`Kode referral "${referral_code}" tidak ditemukan`);
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
        try {
          currentProfile = await fetchUserProfile(); // sudah retry otomatis
        } catch (err) {
          await logout();
          throw new Error('Gagal mengambil data profil. Silakan coba login kembali.');
        }
      }

      // 📌 Membuat wallet baru untuk user
      await createWalletForUser(userData.session.access_token);

      // 📌 Reward referral
      if (referrer_id) {
        await giveReferralRewards(currentProfile, referrer_id, referral_code);
      }

      handleResponse({ message, error }, 'success', 'mendaftar');
      return currentProfile;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mendaftar', { err });
      throw err;
    } finally {
      isCreating.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Login
   *------------------------------------------------------------------------**/

  const login = async (email, password) => {
    if (!email || !password) {
      const err = new Error('Email dan password diperlukan!');
      handleResponse({ message, error }, 'error', 'login', { err });
      throw err;
    }

    isCreating.value = true;
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
      isCreating.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Logout
   *------------------------------------------------------------------------**/

  const logout = async () => {
    isDeleting.value = true;
    resetMessageState();

    try {
      // ? local which only terminates the current session for the user but keep sessions on other devices or browsers active
      const { error: logoutError } = await supabase.auth.signOut({ scope: 'local' });

      if (logoutError) throw logoutError;

      // 📌 Reset semua state
      resetAllState();

      // 📌 Reset data pada store lain
      // ! Sebelum menambahkan ini, coba dulu login sebagai customer dengan 2 akun dan data berbeda misalnya riwayat transaksi untuk melihat perbedaannya
      // ! Lebih baik buat fungsi khusus untuk menampung reset-reset pada store lain -> buat store baru dengan nama resetAllStore.js
      // ...

      handleResponse({ message, error }, 'success', 'logout', { showToast: false });
    } catch (err) {
      handleResponse({ message, error }, 'error', 'logout', { err });
      throw err;
    } finally {
      isDeleting.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch All Users -> sudah termasuk profile nya
   *------------------------------------------------------------------------**/

  const fetchAllUsers = async () => {
    isFetchingList.value = true;
    resetMessageState();
    resetUsers();

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

      handleResponse({ message, error }, 'success', 'mengambil semua pengguna', {
        showToast: false,
      });
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil semua pengguna', { err });
    } finally {
      isFetchingList.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Update User (email/password)
   *!   Masih error
   *------------------------------------------------------------------------**/

  const updateUser = async (newEmail, newPassword) => {
    if (!user.value) {
      const err = new Error('Pengguna tidak terautentikasi');
      handleResponse({ message, error }, 'error', 'memperbarui data pengguna', { err });
      throw err;
    }

    isUpdating.value = true;
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
      isUpdating.value = false;
    }
  };

  /**========================================================================
   **   PROFILE METHODS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Fetch User Profile
   *------------------------------------------------------------------------**/

  const fetchUserProfile = async (maxWaitTime = 5000, interval = 500) => {
    if (!user.value) return null;

    let timeSpent = 0;
    let currentProfile = null;

    try {
      while (timeSpent < maxWaitTime) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.value.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          currentProfile = data;
          break;
        }

        await new Promise((resolve) => setTimeout(resolve, interval));
        timeSpent += interval;
      }

      if (!currentProfile) {
        throw new Error('Profil pengguna tidak ditemukan setelah beberapa percobaan.');
      }

      profile.value = currentProfile;
      return currentProfile;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil profil pengguna', { err });
      throw err;
    }
  };

  /**------------------------------------------------------------------------
   *    Update Profile
   *------------------------------------------------------------------------**/

  const updateProfile = async (updatedData, newAvatarFile = null) => {
    if (!user.value) {
      const err = new Error('Pengguna tidak terautentikasi');
      handleResponse({ message, error }, 'error', 'memperbarui profil', { err });
      throw err;
    }

    isUpdating.value = true;
    resetMessageState();

    try {
      // 📌 Handle avatar upload jika ada
      if (newAvatarFile) {
        const newAvatarPath = await uploadAvatar(newAvatarFile);
        if (!newAvatarPath) return;

        // 📌 Hapus avatar lama jika ada
        if (profile.value?.avatar_image_path) {
          console.log('masukk');
          await deleteAvatar(profile.value.avatar_image_path);
        }

        // 📌 Tambahkan avatar_image_path ke data yang akan diupdate
        updatedData.avatar_image_path = newAvatarPath;
      }

      // 📌 Update profil di Supabase
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
      isUpdating.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Update Role Pengguna
   *    Admnin only / di dashboard user list
   *------------------------------------------------------------------------**/

  const updateUserRole = async (userId, newRole) => {
    if (!userId || !newRole) {
      const err = new Error('User ID dan role baru diperlukan');
      handleResponse({ message, error }, 'error', 'memperbarui role pengguna', { err });
      throw err;
    }

    isUpdating.value = true;
    resetMessageState();

    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) throw updateError;

      await fetchAllUsers();

      handleResponse({ message, error }, 'success', 'memperbarui role pengguna');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'memperbarui role pengguna', { err });
      throw err;
    } finally {
      isUpdating.value = false;
    }
  };

  /**========================================================================
   **   SESSION MANAGEMENT
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Init Auth (nama awalnya -> Get Current Session)
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
   *    Setup Listener for Auth State Changes
   *------------------------------------------------------------------------**/

  const initAuthListener = async () => {
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
              window.location.href = '/auth/login';
            });
          }
        }, 1000);
      } else if (event === 'SIGNED_OUT') {
        resetAuthState();
        // Redirect jika dibutuhkan
        window.location.href = '/auth/login';
      } else if (event === 'TOKEN_REFRESH_FAILED' || event === 'SESSION_EXPIRED') {
        // Logout secara paksa jika token refresh gagal atau sesi kadaluarsa
        resetAuthState();
        // Redirect jika dibutuhkan
        window.location.href = '/auth/login';
      }
    });
  };

  /**========================================================================
   **   RETURNS
   *========================================================================**/

  return {
    // 📌 States
    session,
    user,
    users,
    profile,

    loading,

    isFetchingList,
    isFetchingDetail,
    isCreating,
    isUpdating,
    isDeleting,

    message,
    error,

    // 📌 Computeds
    isAuthenticated,
    userName,
    userRole,
    userAvatar,

    // 📌 Methods
    login,
    register,
    logout,
    updateProfile,
    initAuth,
    resetMessageState,
    resetUsers,
    updateUser,
    updateUserRole,
    fetchAllUsers,

    // ...
    initAuthListener,
  };
});
