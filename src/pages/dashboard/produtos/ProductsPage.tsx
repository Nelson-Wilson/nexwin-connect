import { useEffect, useMemo, useState } from 'react';
import { Search, Pencil, Trash2, Copy, Package, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useBusiness } from '../../../hooks/useBusiness';
import { productService, categoryService } from '../../../services/storeServices';
import type { StoreProduct } from '../../../models/product.model';
import type { StoreCategory } from '../../../models/category.model';
import { PageHeader, EmptyState } from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import ProductFormModal from './ProductFormModal';

export default function ProductsPage() {
  const { business } = useBusiness();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todas');
  const [statusFilter, setStatusFilter] = useState<'todas' | 'disponivel' | 'esgotado'>('todas');
  const [editing, setEditing] = useState<StoreProduct | 'new' | null>(null);
  const [toDelete, setToDelete] = useState<StoreProduct | null>(null);

  const load = async () => {
    if (!business) return;
    setLoading(true);
    const [prods, cats] = await Promise.all([
      productService.listByBusiness(business.id),
      categoryService.listByBusiness(business.id),
    ]);
    setProducts(prods.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    setCategories(cats.sort((a, b) => a.order - b.order));
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'todas' && p.category !== categoryFilter) return false;
      if (statusFilter !== 'todas' && p.status !== statusFilter) return false;
      return true;
    });
  }, [products, search, categoryFilter, statusFilter]);

  if (!business) return null;

  const handleDelete = async () => {
    if (!toDelete) return;
    await productService.remove(toDelete.id);
    setToDelete(null);
    load();
  };

  const handleDuplicate = async (product: StoreProduct) => {
    const id = productService.newId();
    const now = new Date().toISOString();
    await productService.create({
      ...product,
      id,
      name: `${product.name} (cópia)`,
      createdAt: now,
      updatedAt: now,
    });
    load();
  };

  const toggleStatus = async (product: StoreProduct) => {
    const status = product.status === 'disponivel' ? 'esgotado' : 'disponivel';
    await productService.update(product.id, { status });
    load();
  };

  return (
    <div className="p-8 max-w-6xl">
      <PageHeader
        title="Produtos"
        description={`${products.length} produto${products.length === 1 ? '' : 's'} na tua loja.`}
        actionLabel="Novo produto"
        onAction={() => setEditing('new')}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar produtos..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="todas" className="bg-[#0F172A]">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name} className="bg-[#0F172A]">{c.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="todas" className="bg-[#0F172A]">Todos os estados</option>
          <option value="disponivel" className="bg-[#0F172A]">Disponível</option>
          <option value="esgotado" className="bg-[#0F172A]">Esgotado</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="animate-spin text-blue-500" size={24} />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Package size={32} />}
          title={products.length === 0 ? 'Ainda não tens produtos' : 'Nenhum produto encontrado'}
          description={
            products.length === 0
              ? 'Adiciona o teu primeiro produto para começar a vender.'
              : 'Tenta ajustar a pesquisa ou os filtros.'
          }
        />
      ) : (
        <div className="glass-card rounded-xl divide-y divide-white/5">
          {filtered.map((product) => (
            <div key={product.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden shrink-0">
                {product.images[0] && (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{product.name}</p>
                <p className="text-xs text-slate-500">{product.category}</p>
              </div>
              <p className="text-sm text-white font-semibold w-24 text-right shrink-0">{product.price} MT</p>
              <button
                onClick={() => toggleStatus(product)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 transition-colors ${
                  product.status === 'disponivel'
                    ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-slate-500/10 text-slate-400 hover:bg-slate-500/20'
                }`}
              >
                {product.status === 'disponivel' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {product.status === 'disponivel' ? 'Disponível' : 'Esgotado'}
              </button>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleDuplicate(product)}
                  title="Duplicar"
                  className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => setEditing(product)}
                  title="Editar"
                  className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => setToDelete(product)}
                  title="Eliminar"
                  className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <ProductFormModal
          businessId={business.id}
          product={editing === 'new' ? null : editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar produto"
          message={`Tens a certeza que queres eliminar "${toDelete.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}
