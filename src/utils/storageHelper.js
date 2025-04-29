const SUPABASE_URL = 'https://usiluuzsrawbybmslrml.supabase.co'; // ! ganti dengan project kamu

export const getPublicImageUrl = (path) => {
  if (!path) {
    console.error('Path tidak valid');
    return '';
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${path}`;
};
