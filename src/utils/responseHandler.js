import { useToastStore } from '@/stores/toastStore';

export const handleResponse = (state, type, operation, options = {}) => {
  // 📌 Validasi state
  if (!state || typeof state !== 'object') return;

  // 📌 Default options
  const { err = null, customMessage = null, logError = true, showToast = true } = options;

  // 📌...
  const toast = useToastStore();

  if (type === 'error') {
    // 📌 Set message & error message
    const msg = customMessage || `Gagal ${operation}!`;
    const errMsg = err?.message || 'Terjadi kesalahan!';

    // 📌 Set ref message & error di store (jika ada)
    if (state.message) state.message.value = msg;
    if (state.error) state.error.value = errMsg;

    // 📌 Tampilkan log error di console (jika diizinkan)
    if (err && logError) console.error(`Gagal ${operation}:`, err.message || err);

    // 📌 Tampilkan notifikasi toast (jika diizinkan)
    if (showToast) {
      toast.showToast({ message: msg, error: errMsg });
    }
  } else if (type === 'success') {
    // 📌 Set message
    const msg = customMessage || `Berhasil ${operation}!`;

    // 📌 Set ref message & error di store (jika ada)
    if (state.message) state.message.value = msg;
    if (state.error) state.error.value = null;

    // 📌 Tampilkan notifikasi toast (jika diizinkan)
    if (showToast) {
      toast.showToast({ message: msg });
    }
  }
};
