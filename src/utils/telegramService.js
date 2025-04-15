export const sendTelegramNotification = async (payload, jwtToken) => {
  try {
    const response = await fetch(
      'https://usiluuzsrawbybmslrml.supabase.co/functions/v1/send-telegram-notification',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      const errorResponse = await response.text();
      console.error('Telegram Error:', errorResponse);
      throw new Error('Gagal mengirim notifikasi Telegram');
    }

    return true;
  } catch (err) {
    console.error('Telegram Notification Error:', err.message);
    return false;
  }
};
