import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { supabase } from '@/lib/supabase';

import { useAuthStore } from './authStore';
import { handleResponse } from '@/utils/responseHandler';
import { storageService } from '@/services/storageService';

export const usePaymentMethodStore = defineStore('paymentMethod', () => {
  /**========================================================================
   **   STATE & COMPUTED
   *========================================================================**/

  // 📌 State
  const loading = ref(false);
  const message = ref(null);
  const error = ref(null);

  const paymentMethods = ref([]);
  const paymentMethod = ref(null);

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

  /**------------------------------------------------------------------------
   *    Get Payment Methods by Type
   *------------------------------------------------------------------------**/

  const filterPaymentMethodsByType = (type) => {
    return paymentMethods.value.filter((pm) => pm.type === type);
  };

  /**========================================================================
   **   FILE HANDLING
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Upload & Delete QR Code Image -> Supabase Storage
   *------------------------------------------------------------------------**/

  const uploadQRCodeImage = async (file) => {
    if (!file) return null;

    try {
      const path = await storageService.uploadFile(file, 'payment-method-images', 'qr-code', [
        'jpg',
        'jpeg',
        'png',
        'webp',
      ]);

      if (!path) return null;

      handleResponse({ message, error }, 'success', 'mengunggah gambar QR Code');
      return path;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengunggah gambar QR Code', { err });
      return null;
    }
  };

  const deleteQRCodeImage = async (imagePath) => {
    if (!imagePath) return null;

    try {
      const success = await storageService.deleteFile(imagePath, 'payment-method-images');

      if (success) {
        handleResponse({ message, error }, 'success', 'menghapus gambar QR Code');
      }

      return success;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus gambar QR Code', { err });
      return null;
    }
  };

  /**------------------------------------------------------------------------
   *    Upload & Delete Logo Image -> Supabase Storage
   *------------------------------------------------------------------------**/

  const uploadLogoImage = async (file) => {
    if (!file) return null;

    try {
      const path = await storageService.uploadFile(file, 'payment-method-images', 'logo', [
        'jpg',
        'jpeg',
        'png',
        'webp',
      ]);

      if (!path) return null;

      handleResponse({ message, error }, 'success', 'mengunggah gambar Logo');
      return path;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengunggah gambar Logo', { err });
      return null;
    }
  };

  const deleteLogoImage = async (imagePath) => {
    if (!imagePath) return null;

    try {
      const success = await storageService.deleteFile(imagePath, 'payment-method-images');

      if (success) {
        handleResponse({ message, error }, 'success', 'menghapus gambar Logo');
      }

      return success;
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus gambar Logo', { err });
      return null;
    }
  };

  /**========================================================================
   **   METHODS
   *========================================================================**/

  /**------------------------------------------------------------------------
   *    Fetch Payment Methods
   *------------------------------------------------------------------------**/

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
      handleResponse({ message, error }, 'success', 'mengambil data payment methods', {
        showToast: false,
      });
    } catch (err) {
      handleResponse({ message, error }, 'error', 'mengambil data payment methods', { err });
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Fetch Payment Method by ID
   *------------------------------------------------------------------------**/

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
      handleResponse({ message, error }, 'success', 'mengambil payment method berdasarkan ID', {
        showToast: false,
      });
      return data;
    } catch (err) {
      paymentMethod.value = null;
      handleResponse({ message, error }, 'error', 'mengambil payment method berdasarkan ID', {
        err,
      });
      return null;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Add Payment Method
   *------------------------------------------------------------------------**/

  const addPaymentMethod = async (
    name,
    type,
    account_name,
    account_number = null,
    qrCodeImageFile = null,
    logoImageFile = null,
    is_active = true,
  ) => {
    loading.value = true;
    resetMessageState();

    let qr_code_image_path = null;
    let logo_image_path = null;

    try {
      // 📌 Cek user
      const user_id = useAuthStore().user?.id;
      if (!user_id) {
        throw new Error('User tidak ditemukan/belum login');
      }

      // 📌 Upload gambar QR Code
      if (qrCodeImageFile) {
        qr_code_image_path = await uploadQRCodeImage(qrCodeImageFile);
        if (!qr_code_image_path) throw new Error('Gagal mengupload gambar QR Code');
      }

      // 📌 Upload gambar Logo
      if (logoImageFile) {
        logo_image_path = await uploadLogoImage(logoImageFile);
        if (!logo_image_path) throw new Error('Gagal mengupload gambar logo');
      }

      // 📌 Simpan ke database
      const { data, error: insertError } = await supabase
        .from('payment_methods')
        .insert([
          {
            name,
            type,
            account_name,
            account_number,
            qr_code_image_path,
            logo_image_path,
            is_active,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // 📌 Fetch ulang payment methods
      await fetchPaymentMethods();

      handleResponse({ message, error }, 'success', 'menambah payment method');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menambah payment method', { err });

      // 📌 Hapus Gambar QR Code
      if (qr_code_image_path) {
        await deleteQRCodeImage(qr_code_image_path);
      }

      // 📌 Hapus Gambar Logo
      if (logo_image_path) {
        await deleteLogoImage(logo_image_path);
      }

      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**------------------------------------------------------------------------
   *    Delete Payment Method
   *------------------------------------------------------------------------**/

  const deletePaymentMethod = async (id) => {
    loading.value = true;
    resetMessageState();

    try {
      // 📌 Ambil data payment method berdasarkan ID
      const { data: paymentMethod, error: fetchError } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // 📌 Hapus gambar QR Code jika ada
      if (paymentMethod?.qr_code_image_path) {
        const QRCodeImageDeleted = await deleteQRCodeImage(paymentMethod.qr_code_image_path);

        if (!QRCodeImageDeleted)
          throw new Error('Gagal menghapus gambar QR Code, metode pembayaran tidak akan dihapus.');
      }

      // 📌 Hapus gambar Logo jika ada
      if (paymentMethod?.logo_image_path) {
        const logoImageDeleted = await deleteLogoImage(paymentMethod.logo_image_path);

        if (!logoImageDeleted)
          throw new Error('Gagal menghapus gambar Logo, metode pembayaran tidak akan dihapus.');
      }

      // 📌 Hapus metode pembayaran dari database
      const { error: deleteError } = await supabase.from('payment_methods').delete().eq('id', id);

      if (deleteError) throw deleteError;

      // 📌 Fetch ulang payment methods
      await fetchPaymentMethods();

      handleResponse({ message, error }, 'success', 'menghapus metode pembayaran');
    } catch (err) {
      handleResponse({ message, error }, 'error', 'menghapus metode pembayaran', { err });
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

    paymentMethods,
    paymentMethod,

    resetMessageState,

    filterPaymentMethodsByType,

    fetchPaymentMethods,
    fetchPaymentMethodById,
    addPaymentMethod,
    deletePaymentMethod,
  };
});
