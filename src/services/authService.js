export async function deleteUserViaEdge(userId, accessToken, isRollback = false) {
  // 📌 Memastikan userId dan accessToken valid
  if (!userId || !accessToken) {
    console.error('[Error] userId atau accessToken tidak valid');
    throw new Error('userId dan accessToken harus valid');
  }

  try {
    // 📌 Mengirim permintaan DELETE ke Edge Function
    const response = await fetch(
      'https://usiluuzsrawbybmslrml.supabase.co/functions/v1/delete-user',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ user_id: userId, isRollback }),
      },
    );

    // 📌 Jika respons tidak OK, coba ambil teks dan parsing JSON jika ada error
    if (!response.ok) {
      const errorText = await response.text();
      try {
        const { error } = JSON.parse(errorText);
        console.error('[Edge Function Error]', error);
        throw new Error(error || 'Gagal menghapus user melalui Edge Function');
      } catch (jsonParseError) {
        console.error('[Edge Function Error - JSON Parse]', jsonParseError);
        throw new Error('Gagal menghapus user melalui Edge Function (Tidak bisa memparse respons)');
      }
    }

    // 📌 Jika berhasil menghapus user
    console.log('[Edge Function] User berhasil dihapus');
  } catch (err) {
    // 📌 Menangani kesalahan dari permintaan atau penghapusan user
    console.error('[Rollback Gagal] Tidak bisa hapus user:', err?.message || err);

    // 📌 Menambahkan stack trace untuk informasi lebih lanjut
    if (err instanceof Error) console.error('[Error Stack]:', err.stack);

    // 📌 Mengirimkan error yang sudah ditangani
    throw err;
  }
}
