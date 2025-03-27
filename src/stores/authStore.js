import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { supabase } from '@/lib/supabase';

export const useAuthStore = defineStore('authStore', () => {
  // State Pengguna
  const user = ref(null);
  const session = ref(null);
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  // Computed Properties
  const isAuthenticated = computed(() => !!user.value);
  // Computed Properties - Metadata
  const userName = computed(() => user.value?.user_metadata?.name || 'Nama sepertinya error :(');
  const userRole = computed(() => user.value?.user_metadata?.role || 'Role sepertinya error :(');

  // Method Login
  const login = async (email, password) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;

      user.value = data.user;
      session.value = data.session;
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Method Register
  const register = async (email, password, metadata = {}) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: registerError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: metadata.name || 'Anonym',
            role: metadata.role || 'admin',
          },
        },
      });

      if (registerError) throw registerError;

      user.value = data.user;
      session.value = data.session;
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Method Logout
  const logout = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) throw logoutError;

      user.value = null;
      session.value = null;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Method Reset Password
  const resetPassword = async (email) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: import.meta.env.VITE_PASSWORD_RESET_REDIRECT_URL,
      });

      if (resetError) throw resetError;

      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Method Update Password
  const updatePassword = async (newPassword) => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Method Update User Metadata
  const updateProfile = async (metadata) => {
    loading.value = true;
    error.value = null;
    message.value = null;

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (updateError) throw updateError;

      // Update local user data
      user.value = data.user;
      return data;
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      message.value = 'Edit profile berhasil!';
      loading.value = false;
    }
  };

  // Method Get Current Session
  const getCurrentSession = async () => {
    try {
      const {
        data: { session: currentSession },
        error,
      } = await supabase.auth.getSession();

      if (error) throw error;

      if (currentSession) {
        user.value = currentSession.user;
        session.value = currentSession;
      } else {
        user.value = null;
        session.value = null;
      }

      return currentSession;
    } catch (err) {
      error.value = err.message;
      user.value = null;
      session.value = null;
      return null;
    }
  };

  // Listener untuk perubahan auth state
  supabase.auth.onAuthStateChange((event, currentSession) => {
    if (event === 'SIGNED_IN') {
      user.value = currentSession?.user || null;
      session.value = currentSession || null;
    } else if (event === 'SIGNED_OUT') {
      user.value = null;
      session.value = null;
    }
  });

  // Method untuk memeriksa otorisasi role
  const canAccess = (requiredRoles = []) => {
    if (requiredRoles.length === 0) return true;
    return requiredRoles.includes(userRole.value);
  };

  // Reset seluruh state
  const resetState = () => {
    user.value = null;
    session.value = null;
    loading.value = false;
    error.value = null;
  };

  // Expose state dan methods
  return {
    // State
    user,
    session,
    isAuthenticated,
    userName,
    userRole,
    loading,
    message,
    error,

    // Methods
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    updateProfile,
    getCurrentSession,
    canAccess,
    resetState,
  };
});
