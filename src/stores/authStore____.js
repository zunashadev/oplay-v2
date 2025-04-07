import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { supabase } from '@/lib/supabase';

import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/utils/storageService';

export const useAuthStore = defineStore('authStore', () => {
  // State
  const user = ref(null);
  const session = ref(null);
  const profile = ref(null);
  const allProfiles = ref([]);
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  // Computed Properties
  const isAuthenticated = computed(() => !!user.value);
  const userName = computed(() => profile.value?.name || 'Guest');
  const userRole = computed(() => profile.value?.role || 'guest');
  const userAvatar = computed(() => profile.value?.avatar_url || '');

  // Fungsi : Reset authentication state
  const resetAuthState = () => {
    user.value = null;
    session.value = null;
    profile.value = null;
  };

  // Fungsi : Reset message and error state
  const resetMessageState = () => {
    message.value = null;
    error.value = null;
  };

  // Fungsi : Fetch user profile
  const fetchUserProfile = async () => {
    if (!user.value) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single();

      if (fetchError || !data) {
        throw fetchError ?? new Error('Profil pengguna tidak ditemukan');
      }

      profile.value = data;
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil profil pengguna', err);
      throw err;
    }
  };

  // Fungsi : Login
  const login = async (email, password) => {
    if (!email || !password) {
      const err = new Error('Email dan password diperlukan');
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

  // Fungsi : Register
  const register = async (email, password, name, username, avatar_url) => {
    if (!email || !password || !name || !username) {
      const err = new Error('Email, password, name, dan username diperlukan');
      handleResponse({ message, error }, 'error', 'mendaftar', err);
      throw err;
    }

    loading.value = true;
    resetMessageState();

    try {
      const { data, error: registerError } = await supabase.auth.signUp({ email, password });
      if (registerError) throw registerError;

      user.value = data.user;
      session.value = data.session;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, name, username, avatar_url, role: 'customer' }]);

      if (profileError) throw profileError;

      await fetchUserProfile();
      handleResponse({ message, error }, 'success', 'mendaftar');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mendaftar', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Fungsi : Logout
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

  // Fungsi : Upload gambar ke Supabase Storage
  const uploadAvatar = async (file) => {
    if (!file) return null;

    try {
      // Validasi ekstensi file
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
      const fileExt = file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExt)) {
        throw new Error('Format gambar tidak didukung! Gunakan JPG, JPEG, PNG, atau WEBP.');
      }

      // Buat nama unik & simpan di folder "products"
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload file ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Dapatkan URL publik gambar
      const { data } = supabase.storage.from('user-images').getPublicUrl(filePath);

      handleResponse({ message, error }, 'success', 'mengunggah gambar');
      return data.publicUrl;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengunggah gambar', err);
      return null;
    }
  };

  // Fungsi : Hapus gambar dari Supabase Storage
  const deleteAvatar = async (imageUrl) => {
    if (!imageUrl) return null;

    try {
      // Ekstrak nama file dari URL dengan cara yang lebih sederhana
      const fileName = imageUrl.split('/').pop(); // mengambil elemen terakhir, yaitu nama file
      const filePath = `avatars/${fileName}`;

      // Hapus gambar dari storage
      const { error: deleteError } = await supabase.storage.from('user-images').remove([filePath]);

      if (deleteError) throw deleteError;

      handleResponse({ message, error }, 'success', 'menghapus gambar');
      return true;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus gambar', err);
      return null;
    }
  };

  // Fungsi : Update data pengguna (email / password)
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

      // Perbarui state user lokal
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

  // Fungsi : Method Update Profile
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

  // Fungsi : Get Current Session
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

  // Fungsi : Fetch All Profiles
  const fetchAllProfiles = async () => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      allProfiles.value = data;
      handleResponse({ message, error }, 'success', 'mengambil semua profil');
      return data;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil semua profil', err);
    } finally {
      loading.value = false;
    }
  };

  // Setup listener for Auth State Changes
  supabase.auth.onAuthStateChange((event, currentSession) => {
    if (event === 'SIGNED_IN') {
      user.value = currentSession?.user || null;
      session.value = currentSession || null;
      // fetchUserProfile();
      fetchUserProfile().catch((err) => {
        console.error('Failed to fetch profile after auth state change:', err);
      });
    } else if (event === 'SIGNED_OUT') {
      resetAuthState();
    }
  });

  return {
    // State
    user,
    session,
    profile,
    isAuthenticated,
    userName,
    userRole,
    userAvatar,
    allProfiles,
    loading,
    message,
    error,

    // Methods
    login,
    register,
    logout,
    updateProfile,
    getCurrentSession,
    fetchAllProfiles,
    resetMessageState,
    updateUser,
  };
});
