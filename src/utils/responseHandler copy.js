export const handleResponse = (
  state,
  type,
  operation,
  err = null,
  customMessage = null,
  logError = true,
) => {
  if (!state || typeof state !== 'object') return;

  // Harus pakai .value kalau state.message dan state.error adalah ref
  if (type === 'error') {
    state.message.value = customMessage || `Gagal ${operation}!`;
    state.error.value = err?.message || 'Terjadi kesalahan!';
    if (err && logError) console.error(`Gagal ${operation}:`, err.message || err);
  } else if (type === 'success') {
    state.message.value = customMessage || `Berhasil ${operation}!`;
    state.error.value = null;
  }
};
