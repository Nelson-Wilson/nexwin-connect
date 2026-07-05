import { useRef, useState } from 'react';
import { Upload, X, ChevronLeft, ChevronRight, Loader2, ImageOff } from 'lucide-react';
import { uploadBusinessImage } from '../../../services/storageService';

export default function ImageUploader({
  businessId,
  context,
  images,
  onChange,
  maxImages = 10,
  aspect = 'aspect-square',
}: {
  businessId: string;
  context: string;
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState('');

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');
    const slotsLeft = maxImages - images.length;
    if (slotsLeft <= 0) {
      setError(`Máximo de ${maxImages} imagens.`);
      return;
    }
    const toUpload = Array.from(files).slice(0, slotsLeft);
    const uploaded: string[] = [];

    for (const file of toUpload) {
      const key = `${file.name}-${file.size}`;
      try {
        const url = await uploadBusinessImage(file, businessId, context, (p) =>
          setProgress((prev) => ({ ...prev, [key]: p }))
        );
        uploaded.push(url);
      } catch (err: any) {
        setError(err.message ?? 'Falha ao carregar imagem.');
      } finally {
        setProgress((prev) => {
          const { [key]: _omit, ...rest } = prev;
          return rest;
        });
      }
    }
    if (uploaded.length) onChange([...images, ...uploaded]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeAt = (idx: number) => onChange(images.filter((_, i) => i !== idx));

  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const uploading = Object.keys(progress).length > 0;

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
        {images.map((url, idx) => (
          <div key={url + idx} className={`relative group ${aspect} rounded-lg overflow-hidden bg-white/5 border border-white/10`}>
            <img src={url} alt="" className="w-full h-full object-cover" />
            {idx === 0 && (
              <span className="absolute top-1 left-1 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded">
                Principal
              </span>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              {idx > 0 && (
                <button type="button" onClick={() => move(idx, -1)} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                  <ChevronLeft size={13} />
                </button>
              )}
              <button type="button" onClick={() => removeAt(idx)} className="w-6 h-6 rounded bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center">
                <X size={13} />
              </button>
              {idx < images.length - 1 && (
                <button type="button" onClick={() => move(idx, 1)} className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
                  <ChevronRight size={13} />
                </button>
              )}
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={`${aspect} rounded-lg border border-dashed border-white/20 hover:border-blue-500 text-slate-400 hover:text-blue-400 flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-60`}
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            <span className="text-[10px] font-semibold uppercase tracking-wide">
              {uploading ? 'A enviar' : 'Adicionar'}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {images.length === 0 && !uploading && (
        <p className="flex items-center gap-1.5 text-xs text-slate-500">
          <ImageOff size={13} /> Até {maxImages} imagens. A primeira é a imagem principal.
        </p>
      )}
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
