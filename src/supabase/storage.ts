/**
 * Image Upload Service — Supabase Storage
 *
 * Bucket: "product-images" (público para leitura, escrita restrita a
 * utilizadores autenticados — ver supabase/migrations/0002_storage.sql).
 * Substitui o Cloudinary, que era usado apenas porque o Firebase Storage
 * exigia o plano pago (Blaze). O Supabase Storage tem tier gratuito com
 * 1GB de armazenamento e é servido pelo mesmo projeto do resto dos dados.
 */
import { supabase, isSupabaseConfigured } from './client';
import { LEGACY_BUSINESS_ID } from './tables';

const BUCKET = 'product-images';
const IS_PROD = import.meta.env.PROD;

/**
 * Compresses an image client-side before uploading.
 */
export function compressImage(
  file: File,
  maxDimension = 1200,
  quality = 0.80
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > height) {
          if (width > maxDimension) { height = Math.round(height * maxDimension / width); width = maxDimension; }
        } else {
          if (height > maxDimension) { width = Math.round(width * maxDimension / height); height = maxDimension; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(file); return; }
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => resolve(blob ?? file), 'image/jpeg', quality);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

/**
 * Uploads image to Supabase Storage with (simulated) progress reporting.
 * The Supabase JS client uses `fetch` internally, which doesn't expose
 * granular upload progress like XHR does — so progress is simulated while
 * the request is in flight and jumps to 100% on completion. This preserves
 * the same progress-bar UX the Cloudinary/XHR implementation had.
 * Falls back to base64 preview in development if Supabase isn't configured.
 */
export const uploadProductImage = (
  file: File,
  productId: string,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const compressedBlob = await compressImage(file);

      // ── Supabase Storage upload ─────────────────────────────
      if (isSupabaseConfigured && supabase) {
        const path = `stores/${LEGACY_BUSINESS_ID}/products/${productId}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

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
          reject(new Error(`Upload falhou: ${error.message}`));
          return;
        }

        onProgress(100);
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
        resolve(data.publicUrl);
        return;
      }

      // ── Dev fallback: base64 preview ──────────────────────────
      if (IS_PROD) {
        reject(new Error(
          'Supabase não configurado. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY ao .env.local'
        ));
        return;
      }

      let progress = 0;
      const interval = setInterval(() => {
        progress = Math.min(progress + 20, 100);
        onProgress(progress);
        if (progress >= 100) clearInterval(interval);
      }, 100);

      const reader = new FileReader();
      reader.readAsDataURL(compressedBlob);
      reader.onloadend = () => {
        setTimeout(() => resolve(reader.result as string), 600);
      };
      reader.onerror = (err) => { clearInterval(interval); reject(err); };

    } catch (err) {
      reject(err);
    }
  });
};

// Keep this export for compatibility with existing imports
export { isSupabaseConfigured as isStorageConfigured };
