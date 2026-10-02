import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { productService } from '../../../services/storeServices';
import type { StoreProduct } from '../../../models/product.model';
import type { StoreCategory } from '../../../models/category.model';
import Modal from '../components/Modal';
import ImageUploader from '../components/ImageUploader';
import { FormField, inputClass } from '../components/FormField';

export default function ProductFormModal({
  businessId,
  product,
  categories,
  onClose,
  onSaved,
}: {
  businessId: string;
  product: StoreProduct | null;
  categories: StoreCategory[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [id] = useState(product?.id ?? productService.newId());
  const [name, setName] = useState(product?.name ?? '');
  const [category, setCategory] = useState(product?.category ?? categories[0]?.name ?? '');
  const [price, setPrice] = useState(product?.price?.toString() ?? '');
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice?.toString() ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [status, setStatus] = useState<'disponivel' | 'esgotado'>(product?.status ?? 'disponivel');
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [bestseller, setBestseller] = useState(product?.bestseller ?? false);
  const [news, setNews] = useState(product?.news ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setError('');
    const priceNum = parseFloat(price);
    if (!name.trim()) return setError('Indica o nome do produto.');
    if (!category) return setError('Escolhe (ou cria primeiro) uma categoria.');
    if (Number.isNaN(priceNum) || priceNum <= 0) return setError('Indica um preço válido.');

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload: StoreProduct = {
        id,
        businessId,
        name: name.trim(),
        category,
        price: priceNum,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        description: description.trim(),
        status,
        images,
        featured,
        bestseller,
        news,
        createdAt: product?.createdAt ?? now,
        updatedAt: now,
      };
      if (product) {
        await productService.update(id, payload);
      } else {
        await productService.create(payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message ?? 'Não foi possível guardar o produto.');
      setSaving(false);
    }
  };

  return (
    <Modal title={product ? 'Editar produto' : 'Novo produto'} onClose={onClose} maxWidth="max-w-2xl">
      <div className="space-y-4">
        <FormField label="Imagens" hint="Até 10 imagens. A primeira aparece como imagem principal.">
          <ImageUploader
            businessId={businessId}
            context={`products/${id}`}
            images={images}
            onChange={setImages}
            maxImages={10}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Nome do produto">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Vestido Floral"
              className={inputClass}
            />
          </FormField>

          <FormField label="Categoria">
            {categories.length === 0 ? (
              <p className="text-xs text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2.5">
                Cria uma categoria primeiro, em "Categorias".
              </p>
            ) : (
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                {categories.map((c) => (
                  <option key={c.id} value={c.name} className="bg-slate-50">{c.name}</option>
                ))}
              </select>
            )}
          </FormField>

          <FormField label="Preço (MT)">
            <input
              type="number"
              min={0}
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className={inputClass}
            />
          </FormField>

          <FormField label="Preço antes do desconto (opcional)">
            <input
              type="number"
              min={0}
              step="0.01"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="0.00"
              className={inputClass}
            />
          </FormField>
        </div>

        <FormField label="Descrição">
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreve o produto..."
            className={`${inputClass} resize-none`}
          />
        </FormField>

        <FormField label="Disponibilidade">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStatus('disponivel')}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold border transition-colors ${
                status === 'disponivel'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              Disponível
            </button>
            <button
              type="button"
              onClick={() => setStatus('esgotado')}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold border transition-colors ${
                status === 'esgotado'
                  ? 'border-slate-400 bg-slate-500/10 text-slate-600'
                  : 'border-slate-200 text-slate-500'
              }`}
            >
              Esgotado
            </button>
          </div>
        </FormField>

        <FormField label="Destaques">
          <div className="flex flex-wrap gap-4">
            {[
              { label: 'Produto em destaque', value: featured, set: setFeatured },
              { label: 'Mais vendido', value: bestseller, set: setBestseller },
              { label: 'Novidade', value: news, set: setNews },
            ].map(({ label, value, set }) => (
              <label key={label} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => set(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-600"
                />
                {label}
              </label>
            ))}
          </div>
        </FormField>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Guardar produto
          </button>
        </div>
      </div>
    </Modal>
  );
}
