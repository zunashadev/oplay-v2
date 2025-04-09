import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { supabase } from '@/lib/supabase';

import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/utils/storageService';

export const useAuthStore = defineStore('authStore', () => {
  /**========================================================================
   *    STATE & COMPUTED
   *========================================================================**/

  // State
  const user = ref(null);
  const session = ref(null);
  const profile = ref(null);
  const profiles = ref([]);
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  // Computed
  const isAuthenticated = computed(() => !!user.value);
  const userName = computed(() => profile.value?.name || 'Guest');
  const userRole = computed(() => profile.value?.role || 'guest');
  const userAvatar = computed(() => profile.value?.avatar_url || '');

  /**========================================================================
   *    UTILITY FUNCTIONS
   *========================================================================**/

  // Reset authentication state
  const resetAuthState = () => {
    user.value = null;
    session.value = null;
    profile.value = null;
  };

  // Reset message dan error state
  const resetMessageState = () => {
    message.value = null;
    error.value = null;
  };

  /**========================================================================
   *    AVATAR / FILE HANDLING
   *========================================================================**/

  // Upload avatar ke Supabase Storage
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
      handleResponse({ message, error }, 'error', 'mengunggah gambar', err);
      return null;
    }
  };

  // Hapus avatar dari Supabase Storage
  const deleteAvatar = async (imageUrl) => {
    if (!imageUrl) return null;

    try {
      const success = await storageService.deleteFile(imageUrl, 'user-images');

      if (success) {
        handleResponse({ message, error }, 'success', 'menghapus avatar');
      }

      return success;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus gambar', err);
      return null;
    }
  };

  /**========================================================================
   *    AUTH METHODS
   *========================================================================**/

  // Login
  const login = async (email, password) => {
    if (!email || !password) {
      const err = new Error('Email dan password diperlukan!');
      handleResponse({ message, error }, 'error', 'login', err);
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
      handleResponse({ message, error }, 'error', 'login', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Register
  // ? Kode lumayan panjang karena untuk memastikan registrasi tidak terjadi error
  // ! Saat ini, ketika sudah sampai tahap pembuatan profile dan gagal, user akan tetap dibuat (ini perlu diperbaiki)
  const register = async (
    email,
    password,
    name,
    username,
    avatar_url,
    referral_username = null,
  ) => {
    if (!email || !password || !name || !username) {
      const err = new Error('Email, password, name, dan username diperlukan!');
      handleResponse({ message, error }, 'error', 'mendaftar', err);
      throw err;
    }

    loading.value = true;
    resetMessageState();

    try {
      // Validasi username unik
      const { data: existingUsername } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (existingUsername) throw new Error(`Username "${username}" sudah digunakan`);

      // Validasi referral username (apakah ada)
      let referrer_id = null;

      if (referral_username) {
        const { data: referrer, error: referrerError } = await supabase
          .from('profiles')
          .select('id')
          .eq('username', referral_username)
          .single();

        if (referrerError || !referrer) {
          throw new Error(`Kode referral "${referral_username}" tidak ditemukan`);
        } else {
          referrer_id = referrer.id;
        }
      }

      // Register user dengan Supabase Auth
      const { data, error: registerError } = await supabase.auth.signUp({ email, password });
      if (registerError) throw registerError;

      console.log('Pengguna berhasil dibuat:', data.user);

      user.value = data.user;
      session.value = data.session;

      // Siapkan data profil
      const profilePayload = {
        id: data.user.id,
        name,
        username,
        avatar_url,
        role: 'customer',
        referral_code: username, // Referral code = username pengguna ini
        ...(referrer_id && { referrer_id }), // Tambahkan hanya jika ada
      };

      console.log('Membuat profil dengan payload:', profilePayload);

      // Buat profil di database dan langsung ambil data yang dibuat
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([profilePayload])
        .select();

      console.log('Hasil pembuatan profil:', { profileData, profileError });

      if (profileError) throw profileError;

      // Gunakan data profil yang baru dibuat (tanpa perlu fetch ulang)
      if (profileData && profileData.length > 0) {
        profile.value = profileData[0];

        console.log('Profil yang diambil setelah pembuatan:', profile.value);

        handleResponse({ message, error }, 'success', 'mendaftar');
        return profileData[0];
      } else {
        // Jika tidak ada data yang dikembalikan dari insert, coba fetch
        console.log('Tidak ada data profil yang dikembalikan saat insert, mencoba fetch...');

        // Delay untuk memastikan database sudah diupdate
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Fetch profil
        try {
          const fetchedProfile = await fetchUserProfile();

          if (fetchedProfile) {
            console.log('Berhasil mengambil profil setelah delay:', fetchedProfile);
            return fetchedProfile;
          } else {
            throw new Error('Tidak dapat mengambil profil pengguna setelah registrasi');
          }
        } catch (fetchErr) {
          console.error('Gagal mengambil profil setelah registrasi:', fetchErr);

          // Jika gagal fetch, kita tetap memiliki user auth tapi tidak profil
          // Bisa coba logout dan minta user login kembali

          await logout();
          throw new Error('Gagal membuat profil pengguna. Silakan coba login kembali.');
        }
      }
    } catch (err) {
      console.error('Error registrasi:', err);
      handleResponse({ message, error }, 'error', 'mendaftar', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Logout
  const logout = async () => {
    loading.value = true;
    resetMessageState();

    try {
      const { error: logoutError } = await supabase.auth.signOut();
      if (logoutError) throw logoutError;

      resetAuthState();
      handleResponse({ message, error }, 'success', 'logout');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'logout', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update data user (email / password)
  // ! Ini masih error
  const updateUser = async (newEmail, newPassword) => {
    if (!user.value) {
      const err = new Error('Pengguna tidak terautentikasi');
      handleResponse({ message, error }, 'error', 'memperbarui data pengguna', err);
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
      handleResponse({ message, error }, 'error', 'memperbarui data pengguna', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**========================================================================
   *    PROFILE METHODS
   *========================================================================**/

  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!user.value) return null;

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .maybeSingle(); // Gunakan maybeSingle alih-alih single

      if (fetchError) {
        throw fetchError;
      }

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
      handleResponse({ message, error }, 'error', 'mengambil profil pengguna', err);
      throw err;
    }
  };

  // Fetch All Profiles
  const fetchAllProfiles = async () => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      profiles.value = data;
      handleResponse({ message, error }, 'success', 'mengambil semua profil');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil semua profil', err);
    } finally {
      loading.value = false;
    }
  };

  // Method Update Profile
  const updateProfile = async (updatedData, newAvatarFile = null) => {
    if (!user.value) {
      const err = new Error('Pengguna tidak terautentikasi');
      handleResponse({ message, error }, 'error', 'memperbarui profil', err);
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
      handleResponse({ message, error }, 'error', 'memperbarui profil', err);
    } finally {
      loading.value = false;
    }
  };

  // Update Role Pengguna (admin only atau di dashboard user list)
  const updateUserRole = async (userId, newRole) => {
    if (!userId || !newRole) {
      const err = new Error('User ID dan role baru diperlukan');
      handleResponse({ message, error }, 'error', 'memperbarui role pengguna', err);
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
      const index = profiles.value.findIndex((user) => user.id === userId);
      if (index !== -1) {
        profiles.value[index].role = newRole;
      }

      handleResponse({ message, error }, 'success', 'memperbarui role pengguna');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'memperbarui role pengguna', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**========================================================================
   *    SESSION MANAGEMENT
   *========================================================================**/

  // Get Current Session
  const getCurrentSession = async () => {
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
      handleResponse({ message, error }, 'error', 'mengambil sesi pengguna', err);
      resetAuthState();
      return null;
    }
  };

  // Setup listener for Auth State Changes
  supabase.auth.onAuthStateChange((event, currentSession) => {
    if (event === 'SIGNED_IN') {
      user.value = currentSession?.user || null;
      session.value = currentSession || null;

      // Tambahkan delay sebelum mencoba fetch profil
      setTimeout(() => {
        fetchUserProfile().catch((err) => {
          console.error('Failed to fetch profile after auth state change:', err);
          // Bisa tambahkan logic untuk handle kasus ketika profil tidak ditemukan
          // misalnya redirect ke halaman untuk melengkapi profil
        });
      }, 800); // Berikan delay yang cukup agar database terupdate
    } else if (event === 'SIGNED_OUT') {
      resetAuthState();
    }
  });

  return {
    // State
    user,
    session,
    profile,
    profiles,
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
    getCurrentSession,
    fetchAllProfiles,
    resetMessageState,
    updateUser,
    updateUserRole,
  };
});
