import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { supabase } from '@/lib/supabase';

import { useAuthStore } from './authStore';
import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/utils/storageService';

export const usePaymentMethodStore = defineStore('paymentMethod', () => {
  /**========================================================================
   *    STATE & COMPUTED
   *========================================================================**/

  //   State
  const paymentMethods = ref([]);
  const paymentMethod = ref(null);

  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  //   Computed
  //   ...

  /**========================================================================
   *    UTILITY FUNCTIONS
   *========================================================================**/

  // Reset message dan error state
  const resetMessageState = () => {
    message.value = null;
    error.value = null;
  };

  /**========================================================================
   *    FILE HANDLING
   *========================================================================**/

  //   Upload gambar QR Code ke Supabase Storage
  const uploadQRCodeImage = async (file) => {
    if (!file) return null;

    try {
      const publicUrl = await storageService.uploadFile(file, 'payment-method-images', 'qr-code', [
        'jpg',
        'jpeg',
        'png',
        'webp',
      ]);

      if (!publicUrl) return null;

      handleResponse({ message, error }, 'success', 'mengunggah gambar QR Code');
      return publicUrl;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengunggah gambar QR Code', err);
      return null;
    }
  };

  // Hapus gambar QR Code ke Supabase Storage
  const deleteQRCodeImage = async (imageUrl) => {
    if (!imageUrl) return null;

    try {
      const success = await storageService.deleteFile(imageUrl, 'payment-method-images');

      if (success) {
        handleResponse({ message, error }, 'success', 'menghapus gambar QR Code');
      }

      return success;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus gambar QR Code', err);
      return null;
    }
  };

  //   Upload gambar QR Code ke Supabase Storage
  const uploadLogoImage = async (file) => {
    if (!file) return null;

    try {
      const publicUrl = await storageService.uploadFile(file, 'payment-method-images', 'logo', [
        'jpg',
        'jpeg',
        'png',
        'webp',
      ]);

      if (!publicUrl) return null;

      handleResponse({ message, error }, 'success', 'mengunggah gambar Logo');
      return publicUrl;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengunggah gambar Logo', err);
      return null;
    }
  };

  // Hapus gambar QR Code ke Supabase Storage
  const deleteLogoImage = async (imageUrl) => {
    if (!imageUrl) return null;

    try {
      const success = await storageService.deleteFile(imageUrl, 'payment-method-images');

      if (success) {
        handleResponse({ message, error }, 'success', 'menghapus gambar Logo');
      }

      return success;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus gambar Logo', err);
      return null;
    }
  };

  /**========================================================================
   *    PAYMENT METHOD METHODS
   *========================================================================**/

  //   Fetch Payment Methods
  const fetchPaymentMethods = async () => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('payment_methods')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      paymentMethods.value = data;
      handleResponse({ message, error }, 'success', 'mengambil data payment methods');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil data payment methods', err);
    } finally {
      loading.value = false;
    }
  };

  //   Fetch Payment Method by ID
  const fetchPaymentMethodById = async (id) => {
    loading.value = true;
    resetMessageState();

    try {
      const { data, error: fetchError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      paymentMethod.value = data;
      handleResponse({ message, error }, 'success', 'mengambil payment method berdasarkan ID');
      return data;
    } catch (err) {
      paymentMethod.value = null;
      handleResponse({ message, error }, 'error', 'mengambil payment method berdasarkan ID', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  //   Add Payment Method
  const addPaymentMethod = async (
    name,
    type,
    account_name,
    account_number = null,
    qr_code_file = null,
    logo_file = null,
    is_active = true,
  ) => {
    loading.value = true;
    resetMessageState();

    try {
      // Cek user
      const user_id = useAuthStore().user?.id;
      if (!user_id) {
        throw new Error('User tidak ditemukan/belum login');
      }

      //   Upload gambar QR Code
      let qr_code_image_url = null;
      if (qr_code_file) {
        console.log('mulai upload qr code');
        qr_code_image_url = await uploadQRCodeImage(qr_code_file);
        if (!qr_code_image_url) return;
      }

      //   Upload gambar Logo
      let logo_image_url = null;
      if (logo_file) {
        console.log('mulai upload logo');
        logo_image_url = await uploadLogoImage(logo_file);
        if (!logo_image_url) return;
      }

      //   Simpan ke database
      const { data, error: insertError } = await supabase
        .from('payment_methods')
        .insert([
          {
            name,
            type,
            account_name,
            account_number,
            qr_code_image_url,
            logo_image_url,
            is_active,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      paymentMethods.value.unshift(data);

      handleResponse({ message, error }, 'success', 'menambah payment method');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambah payment method', err);
    } finally {
      loading.value = false;
    }
  };

  //   Delete Payment Method
  const deletePaymentMethod = async (id) => {
    loading.value = true;
    resetMessageState();

    try {
      // Ambil data payment method berdasarkan ID
      const { data: paymentMethod, error: fetchError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Hapus gambar QR Code jika ada
      if (paymentMethod?.qr_code_image_url) {
        const QRCodeImageDeleted = await deleteQRCodeImage(paymentMethod.qr_code_image_url);

        if (!QRCodeImageDeleted) {
          console.error('Gagal menghapus gambar QR Code, metode pembayaran tidak akan dihapus.');
          return;
        }
      }

      // Hapus gambar Logo jika ada
      if (paymentMethod?.logo_image_url) {
        const logoImageDeleted = await deleteLogoImage(paymentMethod.logo_image_url);

        if (!logoImageDeleted) {
          console.error('Gagal menghapus gambar Logo, metode pembayaran tidak akan dihapus.');
          return;
        }
      }

      // Hapus metode pembayaran dari database
      const { error: deleteError } = await supabase.from('payment_methods').delete().eq('id', id);

      if (deleteError) throw deleteError;

      // Hapus metode pembayaran dari state lokal
      paymentMethods.value = paymentMethods.value.filter((pm) => pm.id !== id);

      handleResponse({ message, error }, 'success', 'menghapus metode pembayaran');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus metode pembayaran', err);
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    message,
    error,

    paymentMethods,
    paymentMethod,

    resetMessageState,
    fetchPaymentMethods,
    fetchPaymentMethodById,
    addPaymentMethod,
    deletePaymentMethod,
  };
});
