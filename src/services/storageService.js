import { supabase } from '@/lib/supabase';

export const storageService = {
  // 📌 Upload File
  async uploadFile(file, bucket, folder = '', allowedExtensions = null) {
    if (!file) return null;

    try {
      // 📌 Validasi ekstensi file jika diperlukan
      if (allowedExtensions) {
        const fileExt = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExt)) {
          throw new Error(`Format file tidak didukung! Gunakan: ${allowedExtensions.join(', ')}`);
        }
      }

      // 📌 Buat nama unik
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const fileExt = file.name.split('.').pop().toLowerCase();
      const pathWithoutBucket = folder
        ? `${folder}/${fileName}.${fileExt}`
        : `${fileName}.${fileExt}`;
      const fullPath = `${bucket}/${pathWithoutBucket}`;

      // 📌 Upload file ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(pathWithoutBucket, file);

      if (uploadError) throw uploadError;

      return fullPath;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    }
  },

  // 📌 Hapus File
  async deleteFile(fullPath) {
    if (!fullPath) return false;

    try {
      // 📌 Pecah path menjadi bucket dan path
      const [bucket, ...pathParts] = fullPath.split('/');
      const pathWithoutBucket = pathParts.join('/');

      // 📌 Hapus file dari storage
      const { error: deleteError } = await supabase.storage
        .from(bucket)
        .remove([pathWithoutBucket]);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      console.error('Error deleting file:', err);
      throw err;
    }
  },
};
