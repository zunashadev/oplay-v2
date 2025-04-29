import { supabase } from '@/lib/supabase';

export const generateSlug = async (name, table, column = 'slug') => {
  if (!name || !table) {
    throw new Error('Parameter "name" dan "table" wajib diisi!');
  }

  let slug = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Ganti spasi dengan "-"
    .replace(/[^a-z0-9-]+/g, '') // Hapus karakter selain huruf, angka, dan dash
    .replace(/-+/g, '-') // Gabungkan dash yang berurutan
    .replace(/^-|-$/g, ''); // Hapus dash di awal/akhir

  let uniqueSlug = slug;
  let count = 1;

  while (true) {
    const { data, error } = await supabase.from(table).select('id').eq(column, uniqueSlug);
    if (error) {
      console.error('Error saat memeriksa slug:', error);
      return slug;
    }

    if (!data || data.length === 0) break;

    uniqueSlug = `${slug}-${count}`;
    count++;
  }

  return uniqueSlug;
};
