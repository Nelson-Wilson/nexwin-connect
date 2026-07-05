/**
 * Image upload service for the multi-tenant platform — Supabase Storage.
 *
 * Each business gets its own folder so images never mix between tenants:
 * `stores/{businessId}/{context}/...`, no mesmo bucket "product-images"
 * usado pelo catálogo legado (ver src/supabase/storage.ts).
 */
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { compressImage } from '../supabase/storage';

const BUCKET = 'product-images';
const IS_PROD = import.meta.env.PROD;

export { isSupabaseConfigured };

/**
 * Uploads an image scoped to a business folder, e.g.:
 *   uploadBusinessImage(file, 'businessId123', 'products/prod_1', onProgress)
 * -> stores/businessId123/products/prod_1/<file>
 */
export function uploadBusinessImage(
  file: File,
  businessId: string,
  context: string,
  onProgress: (progress: number) => void
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const compressedBlob = await compressImage(file);
      const path = `stores/${businessId}/${context}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

      if (isSupabaseConfigured && supabase) {
        let progress = 0;
        const interval = setInterval(() => {
          progress = Math.min(progress + 12, 90);
          onProgress(progress);
        }, 120);

        const { error } = await supabase.storage
          .from(BUCKET)
          .upload(path, compressedBlob, { contentType: 'image/jpeg', upsert: true });

        clearInterval(interval);

        if (error) {
          reject(new Error(`Falha no upload: ${error.message}`));
          return;
        }

        onProgress(100);
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        resolve(data.publicUrl);
        return;
      }

      if (IS_PROD) {
        reject(new Error('Supabase não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY ao .env.local'));
        return;
      }

      // Dev fallback: base64 preview, mirrors the legacy uploader's behaviour.
      let progress = 0;
      const interval = setInterval(() => {
        progress = Math.min(progress + 20, 100);
        onProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 100);
      const reader = new FileReader();
      reader.readAsDataURL(compressedBlob);
      reader.onloadend = () => setTimeout(() => resolve(reader.result as string), 600);
      reader.onerror = (err) => {
        clearInterval(interval);
        reject(err);
      };
    } catch (err) {
      reject(err);
    }
  });
}
