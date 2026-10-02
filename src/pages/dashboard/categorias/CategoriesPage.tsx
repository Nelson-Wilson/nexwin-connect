import { useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Pencil, Trash2, FolderTree, Loader2 } from 'lucide-react';
import { useBusiness } from '../../../hooks/useBusiness';
import { categoryService } from '../../../services/storeServices';
import type { StoreCategory } from '../../../models/category.model';
import { PageHeader, EmptyState } from '../components/PageHeader';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import { FormField, inputClass } from '../components/FormField';
import { CATEGORY_ICON_NAMES, CATEGORY_COLORS, getCategoryIcon } from '../components/iconRegistry';

export default function CategoriesPage() {
  const { business } = useBusiness();
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<StoreCategory | 'new' | null>(null);
  const [toDelete, setToDelete] = useState<StoreCategory | null>(null);

  const load = async () => {
    if (!business) return;
    setLoading(true);
    const list = await categoryService.listByBusiness(business.id);
    setCategories(list.sort((a, b) => a.order - b.order));
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business]);

  if (!business) return null;

  const handleDelete = async () => {
    if (!toDelete) return;
    await categoryService.remove(toDelete.id);
    setToDelete(null);
    load();
  };

  const move = async (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= categories.length) return;
    const a = categories[idx];
    const b = categories[target];
    await Promise.all([
      categoryService.update(a.id, { order: b.order }),
      categoryService.update(b.id, { order: a.order }),
    ]);
    load();
  };

  return (
    <div className="p-8 max-w-4xl">
      <PageHeader
        title="Categorias"
        description="Organiza os teus produtos em categorias na loja."
        actionLabel="Nova categoria"
        onAction={() => setEditing('new')}
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-blue-600" size={24} />
        </div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<FolderTree size={32} />}
          title="Ainda não tens categorias"
          description="Cria a primeira categoria para começar a organizar os teus produtos."
        />
      ) : (
        <div className="ui-card rounded-xl divide-y divide-slate-100">
          {categories.map((cat, idx) => {
            const Icon = getCategoryIcon(cat.icon);
            return (
              <div key={cat.id} className="flex items-center gap-4 px-5 py-3.5">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${cat.color ?? '#2563eb'}22`, color: cat.color ?? '#2563eb' }}
                >
                  <Icon size={16} />
                </span>
                <p className="text-sm font-semibold text-slate-900 flex-1">{cat.name}</p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 transition-colors"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => move(idx, 1)}
                    disabled={idx === categories.length - 1}
                    className="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-20 transition-colors"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    onClick={() => setEditing(cat)}
                    className="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => setToDelete(cat)}
                    className="w-7 h-7 rounded flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {editing && (
        <CategoryFormModal
          businessId={business.id}
          category={editing === 'new' ? null : editing}
          nextOrder={categories.length}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar categoria"
          message={`Tens a certeza que queres eliminar "${toDelete.name}"? Os produtos já criados mantêm o nome da categoria, mas ela deixa de aparecer na lista.`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}

function CategoryFormModal({
  businessId,
  category,
  nextOrder,
  onClose,
  onSaved,
}: {
  businessId: string;
  category: StoreCategory | null;
  nextOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(category?.name ?? '');
  const [icon, setIcon] = useState(category?.icon ?? CATEGORY_ICON_NAMES[0]);
  const [color, setColor] = useState(category?.color ?? CATEGORY_COLORS[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Indica o nome da categoria.');
      return;
    }
    setSaving(true);
    try {
      if (category) {
        await categoryService.update(category.id, { name: name.trim(), icon, color });
      } else {
        const id = categoryService.newId();
        await categoryService.create({
          id,
          businessId,
          name: name.trim(),
          icon,
          color,
          order: nextOrder,
          createdAt: new Date().toISOString(),
        });
      }
      onSaved();
    } catch (err: any) {
      setError(err.message ?? 'Não foi possível guardar.');
      setSaving(false);
    }
  };

  return (
    <Modal title={category ? 'Editar categoria' : 'Nova categoria'} onClose={onClose}>
      <div className="space-y-4">
        <FormField label="Nome">
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Vestidos"
            className={inputClass}
          />
        </FormField>

        <FormField label="Ícone">
          <div className="grid grid-cols-8 gap-2">
            {CATEGORY_ICON_NAMES.map((iconName) => {
              const Icon = getCategoryIcon(iconName);
              const active = icon === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  className={`aspect-square rounded-lg flex items-center justify-center border transition-colors ${
                    active ? 'border-blue-500 bg-blue-500/15 text-blue-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <Icon size={15} />
                </button>
              );
            })}
          </div>
        </FormField>

        <FormField label="Cor">
          <div className="flex gap-2">
            {CATEGORY_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full ring-offset-2 ring-offset-[#111c33] transition-all ${
                  color === c ? 'ring-2 ring-white' : ''
                }`}
                style={{ backgroundColor: c }}
              />
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
            Guardar
          </button>
        </div>
      </div>
    </Modal>
  );
}
