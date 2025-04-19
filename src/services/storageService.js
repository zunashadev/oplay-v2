import { supabase } from '@/lib/supabase';

export const storageService = {
  // Upload File
  async uploadFile(file, bucket, folder, allowedExtensions = null) {
    if (!file) return null;

    try {
      // Validasi ekstensi file jika diperlukan
      if (allowedExtensions) {
        const fileExt = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExt)) {
          throw new Error(`Format file tidak didukung! Gunakan: ${allowedExtensions.join(', ')}`);
        }
      }

      // Buat nama unik
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const fileExt = file.name.split('.').pop().toLowerCase();
      const filePath = folder ? `${folder}/${fileName}.${fileExt}` : `${fileName}.${fileExt}`;

      // Upload file ke Supabase Storage
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

      if (uploadError) throw uploadError;

      // Dapatkan URL publik gambar
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    }
  },

  //   Hapus File
  async deleteFile(fileUrl, bucket) {
    if (!fileUrl) return false;

    try {
      // Ekstrak path file dari URL
      const urlParts = fileUrl.split(`${bucket}/`);
      if (urlParts.length < 2) {
        throw new Error('Format URL tidak valid');
      }

      const filePath = urlParts[1];

      // Hapus file dari storage
      const { error: deleteError } = await supabase.storage.from(bucket).remove([filePath]);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      console.error('Error deleting file:', err);
      throw err;
    }
  },
};
