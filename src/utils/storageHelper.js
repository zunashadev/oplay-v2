const SUPABASE_URL = 'https://usiluuzsrawbybmslrml.supabase.co'; // ! ganti dengan project kamu

export const getPublicImageUrl = (path, type = 'default') => {
  // 📌 Daftar fallback image per tipe
  const fallbackImages = {
    avatar: '/images/fallback-images/default-avatar.jpg',
    product: '/images/fallback-images/default-product.jpg',
    banner: '/images/fallback-images/default-banner.jpg',
    default: '/images/fallback-images/default.jpg', // fallback global jika type tidak dikenali
  };

  // Jika path tidak valid, kembalikan fallback sesuai tipe atau default
  if (!path || typeof path !== 'string' || path.trim() === '') {
    return fallbackImages[type] || fallbackImages.default;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${path}`;
};
