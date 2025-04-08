import { useToastStore } from '@/stores/toastStore';

export const handleResponse = (
  state,
  type,
  operation,
  err = null,
  customMessage = null,
  logError = true,
) => {
  if (!state || typeof state !== 'object') return;

  const toast = useToastStore(); // 🧠 Panggil store toast

  if (type === 'error') {
    const msg = customMessage || `Gagal ${operation}!`;
    const errMsg = err?.message || 'Terjadi kesalahan!';

    // Set ref message & error di store (jika ada)
    if (state.message) state.message.value = msg;
    if (state.error) state.error.value = errMsg;

    if (err && logError) console.error(`Gagal ${operation}:`, err.message || err);

    // Panggil toast
    toast.showToast({ message: msg, error: errMsg });
  } else if (type === 'success') {
    const msg = customMessage || `Berhasil ${operation}!`;

    if (state.message) state.message.value = msg;
    if (state.error) state.error.value = null;

    // Panggil toast
    toast.showToast({ message: msg });
  }
};
