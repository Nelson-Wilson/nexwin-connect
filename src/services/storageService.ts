/**
 * Image upload service for the multi-tenant platform — Supabase Storage.
 *
 * Path convention: stores/{ownerId}/{businessId}/{context}/{ficheiro}
 *
 * `ownerId` (o auth.uid() de quem está a fazer upload) é o segmento que a
 * política de RLS do storage verifica — uma simples comparação de string,
 * sem nenhuma subquery a outra tabela. `businessId` fica no caminho só
 * para organização/legibilidade dos ficheiros no bucket.
 */
import { supabase, isSupabaseConfigured } from '../supabase/client';
import { compressImage } from '../supabase/storage';

const BUCKET = 'product-images';
const IS_PROD = import.meta.env.PROD;

export { isSupabaseConfigured };

/**
 * Uploads an image scoped to a business folder, e.g.:
 *   uploadBusinessImage(file, 'businessId123', 'products/prod_1', onProgress)
 * -> stores/{ownerId}/businessId123/products/prod_1/<file>
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

      if (isSupabaseConfigured && supabase) {
        const { data: sessionData } = await supabase.auth.getSession();
        const ownerId = sessionData.session?.user?.id;
        if (!ownerId) {
          reject(new Error('Sessão expirada. Inicie sessão novamente antes de enviar imagens.'));
          return;
        }

        const path = `stores/${ownerId}/${businessId}/${context}/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

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
