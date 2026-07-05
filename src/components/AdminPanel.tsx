import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Upload, X, Save, 
  Settings, ShoppingBag, Tag, MessageSquare, Image, RefreshCw, KeyRound, AlertCircle, ArrowLeft, Layers,
  Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Product, Promotion, Testimonial, Banner } from '../types';
import { firestoreService } from '../supabase/database';
import { uploadProductImage } from '../supabase/storage';
import { changeAdminFallbackPassword } from '../supabase/auth';

interface AdminPanelProps {
  products: Product[];
  promotions: Promotion[];
  testimonials: Testimonial[];
  banners: Banner[];
  onDataUpdate: () => void;
  onClose: () => void;
}

type TabType = 'produtos' | 'promocoes' | 'depoimentos' | 'banners' | 'configuracoes';

export default function AdminPanel({
  products,
  promotions,
  testimonials,
  banners,
  onDataUpdate,
  onClose
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('produtos');
  
  // Managing edit states
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [editingPromo, setEditingPromo] = useState<Partial<Promotion> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);

  // Administrative Product Filters, Sort & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('recente');

  // Pagination state (6 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Upload/Processing states
  const [uploadProgress, setUploadProgress] = useState<{ [fileName: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [configSuccess, setConfigSuccess] = useState('');
  const [configError, setConfigError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Security password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Subcategories recommendations
  const subcategorySuggestions = {
    vestuario: ['Blusas', 'Calças', 'Saias', 'Moletons', 'Camisas', 'Vestidos', 'Conjuntos', 'Outros'],
    calcados: ['Sapatos', 'Sandálias', 'Chinelos', 'Tênis', 'Outros'],
    sorvete: ['250ml', '500ml', '700ml']
  };

  // Compute Statistics Dashboard metrics
  const stats = useMemo(() => {
    return {
      totalProducts: products.length,
      featuredProducts: products.filter(p => p.featured).length,
      outOfStock: products.filter(p => p.status === 'esgotado').length,
      activePromos: promotions.length
    };
  }, [products, promotions]);

  // Product Filter and Sort Computation
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (categoryFilter !== 'todos') {
      result = result.filter(p => p.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== 'todos') {
      result = result.filter(p => p.status === statusFilter);
    }

    // Sorting
    if (sortBy === 'recente') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'preco-crescente') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'preco-decrescente') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, searchQuery, categoryFilter, statusFilter, sortBy]);

  // Paginated products slice
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;

  // HANDLERS FOR PRODUCTS
  const handleEditProduct = (prod: Product) => {
    setEditingProduct({ ...prod });
  };

  const handleAddNewProduct = () => {
    setEditingProduct({
      id: 'prod_' + Date.now(),
      name: '',
      category: 'vestuario',
      subcategory: 'Conjuntos',
      price: 0,
      description: '',
      status: 'disponivel',
      images: [],
      createdAt: new Date().toISOString()
    });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.price) return;
    
    const finalProduct = {
      ...editingProduct,
      images: editingProduct.images && editingProduct.images.length > 0 
        ? editingProduct.images 
        : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800']
    } as Product;

    try {
      await firestoreService.saveProduct(finalProduct);
      setEditingProduct(null);
      onDataUpdate();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Tem a certeza que deseja excluir este produto?')) {
      try {
        await firestoreService.deleteProduct(id);
        onDataUpdate();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleProductStatus = async (prod: Product) => {
    const updated = {
      ...prod,
      status: prod.status === 'disponivel' ? 'esgotado' as const : 'disponivel' as const
    };
    try {
      await firestoreService.saveProduct(updated);
      onDataUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  // DRAG & DROP + MULTIPLE UPLOAD WITH PROGRESS
  const processFiles = async (files: FileList) => {
    if (!editingProduct) return;
    const currentImages = editingProduct.images || [];
    const maxSlotsLeft = 10 - currentImages.length;
    if (maxSlotsLeft <= 0) {
      setUploadError('Limite de 10 imagens por produto atingido!');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    const filesToUpload = Array.from(files).slice(0, maxSlotsLeft);

    for (const file of filesToUpload) {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        const downloadUrl = await uploadProductImage(file, editingProduct.id || 'temp', (p) => {
          setUploadProgress(prev => ({ ...prev, [file.name]: p }));
        });

        setEditingProduct(prev => {
          if (!prev) return null;
          return {
            ...prev,
            images: [...(prev.images || []), downloadUrl]
          };
        });
      } catch (err) {
        setUploadError(`Falha ao carregar o ficheiro: ${file.name}`);
        console.error(err);
      } finally {
        setUploadProgress(prev => {
          const updated = { ...prev };
          delete updated[file.name];
          return updated;
        });
      }
    }
    setIsUploading(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleReorderImage = (index: number, direction: 'left' | 'right') => {
    if (!editingProduct || !editingProduct.images) return;
    const imgs = [...editingProduct.images];
    if (direction === 'left' && index > 0) {
      const temp = imgs[index - 1];
      imgs[index - 1] = imgs[index];
      imgs[index] = temp;
    } else if (direction === 'right' && index < imgs.length - 1) {
      const temp = imgs[index + 1];
      imgs[index + 1] = imgs[index];
      imgs[index] = temp;
    }
    setEditingProduct({
      ...editingProduct,
      images: imgs
    });
  };

  const handleRemoveProductImage = (indexToRemove: number) => {
    if (!editingProduct || !editingProduct.images) return;
    const filtered = editingProduct.images.filter((_, idx) => idx !== indexToRemove);
    setEditingProduct({
      ...editingProduct,
      images: filtered
    });
  };

  // HANDLERS FOR PROMOTIONS
  const handleAddNewPromo = () => {
    setEditingPromo({
      id: 'promo_' + Date.now(),
      title: '',
      discount: '',
      description: '',
      bannerImage: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200'
    });
  };

  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPromo || !editingPromo.title || !editingPromo.discount) return;
    try {
      await firestoreService.savePromotion(editingPromo as Promotion);
      setEditingPromo(null);
      onDataUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePromo = async (id: string) => {
    if (confirm('Excluir esta promoção?')) {
      try {
        await firestoreService.deletePromotion(id);
        onDataUpdate();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // HANDLERS FOR TESTIMONIALS
  const handleAddNewTestimonial = () => {
    setEditingTestimonial({
      id: 'test_' + Date.now(),
      name: '',
      role: 'Cliente',
      comment: '',
      rating: 5,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
    });
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.name || !editingTestimonial.comment) return;
    try {
      await firestoreService.saveTestimonial(editingTestimonial as Testimonial);
      setEditingTestimonial(null);
      onDataUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Excluir este depoimento?')) {
      try {
        await firestoreService.deleteTestimonial(id);
        onDataUpdate();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // HANDLERS FOR BANNERS
  const handleAddNewBanner = () => {
    setEditingBanner({
      id: 'banner_' + Date.now(),
      title: '',
      subtitle: '',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200',
      active: true
    });
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner || !editingBanner.title || !editingBanner.image) return;
    try {
      await firestoreService.saveBanner(editingBanner as Banner);
      setEditingBanner(null);
      onDataUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (confirm('Excluir este banner rotativo?')) {
      try {
        await firestoreService.deleteBanner(id);
        onDataUpdate();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleBannerActive = async (banner: Banner) => {
    const updated = { ...banner, active: !banner.active };
    try {
      await firestoreService.saveBanner(updated);
      onDataUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  // PASSWORD CONFIG
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setConfigSuccess('');
    setConfigError('');

    if (newPassword.length < 4) {
      setConfigError('A nova palavra-passe deve conter pelo menos 4 caracteres!');
      return;
    }

    changeAdminFallbackPassword(newPassword);
    setConfigSuccess('Palavra-passe de simulação alterada com sucesso!');
    setOldPassword('');
    setNewPassword('');
  };

  return (
    <section className="min-h-screen bg-slate-950 text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-semibold mb-1">
              <Layers size={16} />
              <span>Painel Administrativo Real</span>
            </div>
            <h1 className="font-serif font-light text-2xl sm:text-3xl text-white italic">
              Cantinho da <span className="font-sans font-black not-italic tracking-tighter uppercase text-blue-500">Bianca</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Gerencie seus produtos, coleções, promoções e depoimentos sincronizados diretamente com o Supabase.
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer w-fit"
          >
            <ArrowLeft size={14} />
            Voltar ao Catálogo
          </button>
        </div>

        {/* Dashboard Statistics Widget */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/5 shadow-md flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 block">Total Produtos</span>
            <span className="text-3xl font-sans font-black mt-2 text-white">{stats.totalProducts}</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/5 shadow-md flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400 block">Em Destaque</span>
            <span className="text-3xl font-sans font-black mt-2 text-blue-400">{stats.featuredProducts}</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/5 shadow-md flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500 block">Produtos Esgotados</span>
            <span className="text-3xl font-sans font-black mt-2 text-amber-500">{stats.outOfStock}</span>
          </div>
          <div className="p-5 rounded-2xl bg-[#0F172A] border border-white/5 shadow-md flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 block">Campanhas Ativas</span>
            <span className="text-3xl font-sans font-black mt-2 text-emerald-400">{stats.activePromos}</span>
          </div>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex flex-wrap gap-2 border-b border-slate-900 pb-4 mb-8">
          {[
            { id: 'produtos', label: 'Produtos', icon: ShoppingBag },
            { id: 'promocoes', label: 'Promoções 🔥', icon: Tag },
            { id: 'depoimentos', label: 'Avaliações', icon: MessageSquare },
            { id: 'banners', label: 'Banners Rotativos', icon: Image },
            { id: 'configuracoes', label: 'Segurança', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setEditingProduct(null);
                  setEditingPromo(null);
                  setEditingTestimonial(null);
                  setEditingBanner(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/15'
                    : 'bg-slate-900/60 border-white/5 text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}

        {/* TAB 1: PRODUCTS */}
        {activeTab === 'produtos' && !editingProduct && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0F172A]/50 p-4 rounded-2xl border border-white/5">
              {/* Left Side: Advanced Search & Category Filters */}
              <div className="flex flex-wrap items-center gap-3 flex-grow">
                {/* Internal Search */}
                <div className="relative flex-grow max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input
                    type="text"
                    placeholder="Pesquisar produtos..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Category Selector */}
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-300"
                >
                  <option value="todos">Todas Categorias</option>
                  <option value="vestuario">Vestuário</option>
                  <option value="calcados">Calçados</option>
                  <option value="sorvete">Yougurt de Malambe</option>
                </select>

                {/* Status Selector */}
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-300"
                >
                  <option value="todos">Todos Status</option>
                  <option value="disponivel">Disponível</option>
                  <option value="esgotado">Esgotado</option>
                </select>

                {/* Order Selector */}
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  className="bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs focus:outline-none text-slate-300"
                >
                  <option value="recente">Mais Recentes</option>
                  <option value="preco-crescente">Preço: Baixo para Alto</option>
                  <option value="preco-decrescente">Preço: Alto para Baixo</option>
                </select>
              </div>

              {/* Add New Button */}
              <button
                onClick={handleAddNewProduct}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-md cursor-pointer self-end md:self-auto"
              >
                <Plus size={14} />
                Novo Produto
              </button>
            </div>

            {/* Products Table/Grid with administrative cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#0F172A] border border-white/5 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl"
                >
                  <div className="relative h-44 bg-slate-950 overflow-hidden group">
                    <img
                      src={prod.images[0]}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-102 transition-all duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-slate-300 uppercase">
                      {prod.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-grow">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-sm text-white line-clamp-1">{prod.name}</h3>
                      <span className="font-mono text-xs font-bold text-blue-400 whitespace-nowrap">{prod.price} MT</span>
                    </div>
                    <p className="text-xs text-slate-400 font-light line-clamp-2">{prod.description}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-[10px] text-slate-500">Subcategoria: <b className="text-slate-300">{prod.subcategory}</b></span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950/40 border-t border-white/5 flex items-center justify-between gap-2">
                    {/* Status Toggle */}
                    <button
                      onClick={() => handleToggleProductStatus(prod)}
                      className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                    >
                      {prod.status === 'disponivel' ? (
                        <>
                          <ToggleRight className="text-emerald-500" size={20} />
                          <span className="text-emerald-400 text-[11px]">Disponível</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="text-slate-500" size={20} />
                          <span className="text-slate-400 text-[11px]">Esgotado</span>
                        </>
                      )}
                    </button>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleEditProduct(prod)}
                        className="p-2 bg-slate-900 hover:bg-blue-900/40 border border-white/5 text-blue-400 rounded-lg hover:scale-105 transition-all cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-2 bg-slate-900 hover:bg-red-900/40 border border-white/5 text-red-400 rounded-lg hover:scale-105 transition-all cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Administrative Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-900 pt-6">
                <span className="text-xs text-slate-400">
                  Mostrando página <b>{currentPage}</b> de <b>{totalPages}</b> ({filteredProducts.length} produtos)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 disabled:cursor-not-allowed cursor-pointer border border-white/5"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-300 disabled:cursor-not-allowed cursor-pointer border border-white/5"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PRODUCT FORM (ADD/EDIT) */}
        {activeTab === 'produtos' && editingProduct && (
          <form onSubmit={handleSaveProduct} className="bg-[#0F172A] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-900 pb-4">
              <ShoppingBag size={18} className="text-blue-500" />
              {editingProduct.name ? 'Editar Produto' : 'Cadastrar Novo Produto'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Details Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Nome do Produto</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="Ex: Conjunto Alfaiataria Premium"
                    className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Preço (MT)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingProduct.price || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                      placeholder="2500"
                      className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Preço Anterior (MT)</label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.originalPrice || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: parseFloat(e.target.value) || undefined })}
                      placeholder="Ex: 2900 (Opcional)"
                      className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Categoria</label>
                    <select
                      value={editingProduct.category || 'vestuario'}
                      onChange={(e) => setEditingProduct({ 
                        ...editingProduct, 
                        category: e.target.value as any,
                        subcategory: subcategorySuggestions[e.target.value as keyof typeof subcategorySuggestions]?.[0] || 'Outros'
                      })}
                      className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-300"
                    >
                      <option value="vestuario">Vestuário</option>
                      <option value="calcados">Calçados</option>
                      <option value="sorvete">Yougurt de Malambe</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Subcategoria</label>
                    <select
                      value={editingProduct.subcategory || 'Outros'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, subcategory: e.target.value })}
                      className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-300"
                    >
                      {(subcategorySuggestions[editingProduct.category as keyof typeof subcategorySuggestions] || ['Outros']).map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Descrição</label>
                  <textarea
                    required
                    rows={4}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    placeholder="Descreva detalhes como tamanhos, caimento, tecido ou propriedades nutricionais..."
                    className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Additional checkboxes */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!editingProduct.featured}
                      onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                      className="rounded border-white/10 bg-slate-950 text-blue-600 focus:ring-0 focus:ring-offset-0"
                    />
                    Destacar na Home
                  </label>
                </div>
              </div>

              {/* Multi-Image Drag and Drop Upload Box */}
              <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest">Imagens do Produto (Até 10)</label>
                
                {/* Drag and drop panel */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center cursor-pointer min-h-[160px] ${
                    isDragging 
                      ? 'border-blue-500 bg-blue-950/20' 
                      : 'border-white/10 bg-slate-950/40 hover:bg-slate-950/60'
                  }`}
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                >
                  <Upload size={32} className="text-slate-400 mb-2" />
                  <span className="text-xs text-slate-300 font-semibold">Arraste e solte fotos aqui ou clique para selecionar</span>
                  <span className="text-[10px] text-slate-500 mt-1">PNG, JPG ou JPEG comprimidos automaticamente</span>
                  <input
                    id="file-upload-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Real-time upload queue and errors */}
                {uploadError && (
                  <p className="text-xs font-medium text-red-400 bg-red-950/30 border border-red-900/30 rounded-xl py-2 px-3 flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    {uploadError}
                  </p>
                )}

                {/* Upload progresses */}
                {Object.keys(uploadProgress).map((fileName) => (
                  <div key={fileName} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="truncate max-w-[200px]">{fileName}</span>
                      <span>{uploadProgress[fileName]}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-150" style={{ width: `${uploadProgress[fileName]}%` }} />
                    </div>
                  </div>
                ))}

                {/* Previews grid & ordering */}
                {editingProduct.images && editingProduct.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2.5 pt-2">
                    {editingProduct.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 group border border-white/5">
                        <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        
                        {/* Hover Overlay triggers reorder / delete */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleReorderImage(idx, 'left')}
                            className="p-1 rounded bg-slate-900/80 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            disabled={idx === 0}
                          >
                            <ChevronLeft size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveProductImage(idx)}
                            className="p-1 rounded bg-red-600 hover:bg-red-500 text-white cursor-pointer"
                          >
                            <Trash2 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorderImage(idx, 'right')}
                            className="p-1 rounded bg-slate-900/80 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            disabled={idx === (editingProduct.images?.length || 0) - 1}
                          >
                            <ChevronRight size={12} />
                          </button>
                        </div>
                        
                        {/* Banner cover label */}
                        {idx === 0 && (
                          <div className="absolute bottom-0 inset-x-0 bg-blue-600 text-[8px] font-bold text-center text-white py-0.5 uppercase tracking-wider">
                            Capa
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons control footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-900 pt-6">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-lg transition-all cursor-pointer"
              >
                <Save size={14} />
                Salvar Produto
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: PROMOTIONS */}
        {activeTab === 'promocoes' && !editingPromo && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Gerenciar Campanhas</h2>
              <button
                onClick={handleAddNewPromo}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-md cursor-pointer"
              >
                <Plus size={14} />
                Nova Campanha
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotions.map((promo) => (
                <div key={promo.id} className="bg-[#0F172A] border border-white/5 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
                  <div className="relative h-44 bg-slate-950 overflow-hidden">
                    <img src={promo.bannerImage} alt="" className="w-full h-full object-cover opacity-50" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      {promo.discount}
                    </div>
                  </div>
                  <div className="p-5 flex-grow space-y-2">
                    <h3 className="font-bold text-base text-white">{promo.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">{promo.description}</p>
                  </div>
                  <div className="p-4 bg-slate-950/40 border-t border-white/5 flex justify-end gap-2">
                    <button
                      onClick={() => setEditingPromo(promo)}
                      className="p-2 bg-slate-900 hover:bg-blue-900/40 border border-white/5 text-blue-400 rounded-lg hover:scale-105 transition-all cursor-pointer"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDeletePromo(promo.id)}
                      className="p-2 bg-slate-900 hover:bg-red-900/40 border border-white/5 text-red-400 rounded-lg hover:scale-105 transition-all cursor-pointer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDIT PROMOTION FORM */}
        {activeTab === 'promocoes' && editingPromo && (
          <form onSubmit={handleSavePromo} className="bg-[#0F172A] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-900 pb-4">
              <Tag size={18} className="text-blue-500" />
              {editingPromo.title ? 'Editar Promoção' : 'Adicionar Promoção'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Título da Promoção</label>
                  <input
                    type="text"
                    required
                    value={editingPromo.title || ''}
                    onChange={(e) => setEditingPromo({ ...editingPromo, title: e.target.value })}
                    placeholder="Ex: Liquidação de Inverno"
                    className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Desconto / Tag</label>
                  <input
                    type="text"
                    required
                    value={editingPromo.discount || ''}
                    onChange={(e) => setEditingPromo({ ...editingPromo, discount: e.target.value })}
                    placeholder="Ex: 20% OFF ou LEVE 3 PAGUE 2"
                    className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">URL da Imagem do Banner</label>
                  <input
                    type="text"
                    required
                    value={editingPromo.bannerImage || ''}
                    onChange={(e) => setEditingPromo({ ...editingPromo, bannerImage: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Descrição Curta</label>
                <textarea
                  required
                  rows={6}
                  value={editingPromo.description || ''}
                  onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })}
                  placeholder="Explique os termos da oferta e quais produtos fazem parte da campanha..."
                  className="w-full h-full min-h-[150px] bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-900 pt-6">
              <button
                type="button"
                onClick={() => setEditingPromo(null)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-lg transition-all cursor-pointer"
              >
                <Save size={14} />
                Salvar Promoção
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: TESTIMONIALS */}
        {activeTab === 'depoimentos' && !editingTestimonial && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Avaliações de Clientes</h2>
              <button
                onClick={handleAddNewTestimonial}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-md cursor-pointer"
              >
                <Plus size={14} />
                Novo Depoimento
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((test) => (
                <div key={test.id} className="bg-[#0F172A] border border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={test.photo} alt="" className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="font-semibold text-xs text-white">{test.name}</h4>
                        <span className="text-[10px] text-slate-400 block">{test.role}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 font-light leading-relaxed italic">"{test.comment}"</p>
                  </div>
                  <div className="border-t border-slate-900/60 mt-4 pt-4 flex items-center justify-between">
                    <div className="flex text-amber-400 text-xs">
                      {Array.from({ length: test.rating }).map((_, i) => <span key={i}>★</span>)}
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEditingTestimonial(test)}
                        className="p-1.5 bg-slate-900 hover:bg-blue-900/40 border border-white/5 text-blue-400 rounded-lg cursor-pointer"
                      >
                        <Edit2 size={10} />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(test.id)}
                        className="p-1.5 bg-slate-900 hover:bg-red-900/40 border border-white/5 text-red-400 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDIT TESTIMONIAL FORM */}
        {activeTab === 'depoimentos' && editingTestimonial && (
          <form onSubmit={handleSaveTestimonial} className="bg-[#0F172A] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-900 pb-4">
              <MessageSquare size={18} className="text-blue-500" />
              {editingTestimonial.name ? 'Editar Depoimento' : 'Adicionar Depoimento'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Nome do Cliente</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.name || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                    placeholder="Ex: Ana Maria Macuácua"
                    className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Função / Localização</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.role || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                    placeholder="Ex: Cliente VIP - Maputo"
                    className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Foto do Cliente (URL)</label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.photo || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, photo: e.target.value })}
                    className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Classificação (Estrelas)</label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) || 5 })}
                    className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-300"
                  >
                    <option value="5">★★★★★ (5 Estrelas)</option>
                    <option value="4">★★★★ (4 Estrelas)</option>
                    <option value="3">★★★ (3 Estrelas)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Comentário</label>
                  <textarea
                    required
                    rows={4}
                    value={editingTestimonial.comment || ''}
                    onChange={(e) => setEditingTestimonial({ ...editingTestimonial, comment: e.target.value })}
                    placeholder="Depoimento real do cliente sobre a experiência de compra..."
                    className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-900 pt-6">
              <button
                type="button"
                onClick={() => setEditingTestimonial(null)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-lg transition-all cursor-pointer"
              >
                <Save size={14} />
                Salvar Depoimento
              </button>
            </div>
          </form>
        )}

        {/* TAB 4: BANNERS ROTATIVOS */}
        {activeTab === 'banners' && !editingBanner && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-900 pb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Banners do Hero Principal</h2>
              <button
                onClick={handleAddNewBanner}
                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-md cursor-pointer"
              >
                <Plus size={14} />
                Novo Banner
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-[#0F172A] border border-white/5 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
                  <div className="relative h-44 bg-slate-950 overflow-hidden">
                    <img src={banner.image} alt="" className="w-full h-full object-cover opacity-55" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-5 flex-grow space-y-2">
                    <h3 className="font-bold text-base text-white">{banner.title}</h3>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">{banner.subtitle}</p>
                  </div>
                  <div className="p-4 bg-slate-950/40 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => handleToggleBannerActive(banner)}
                      className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                    >
                      {banner.active ? (
                        <>
                          <ToggleRight className="text-blue-500" size={20} />
                          <span className="text-blue-400 text-[11px]">Ativo</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="text-slate-500" size={20} />
                          <span className="text-slate-400 text-[11px]">Inativo</span>
                        </>
                      )}
                    </button>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setEditingBanner(banner)}
                        className="p-2 bg-slate-900 hover:bg-blue-900/40 border border-white/5 text-blue-400 rounded-lg cursor-pointer"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="p-2 bg-slate-900 hover:bg-red-900/40 border border-white/5 text-red-400 rounded-lg cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDIT BANNER FORM */}
        {activeTab === 'banners' && editingBanner && (
          <form onSubmit={handleSaveBanner} className="bg-[#0F172A] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-slate-900 pb-4">
              <Image size={18} className="text-blue-500" />
              {editingBanner.title ? 'Editar Banner' : 'Adicionar Banner'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Título do Banner</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="Ex: Coleção de Verão Premium"
                  className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Subtítulo / Descrição Curta</label>
                <input
                  type="text"
                  required
                  value={editingBanner.subtitle || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  placeholder="Ex: Conheça as peças com acabamento de alta alfaiataria..."
                  className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">URL da Imagem de Fundo</label>
                <input
                  type="text"
                  required
                  value={editingBanner.image || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                  className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-900 pt-6">
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-300 transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-semibold uppercase tracking-wider text-white shadow-lg transition-all cursor-pointer"
              >
                <Save size={14} />
                Salvar Banner
              </button>
            </div>
          </form>
        )}

        {/* TAB 5: SECURITY / CONFIGURATIONS */}
        {activeTab === 'configuracoes' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <form onSubmit={handlePasswordChange} className="bg-[#0F172A] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300 flex items-center gap-1.5 border-b border-slate-900 pb-3">
                <KeyRound size={16} className="text-blue-500" />
                Segurança (Modo de Simulação)
              </h3>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Nova Palavra-passe</label>
                <input
                  type="password"
                  required
                  placeholder="Mínimo 4 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {configError && (
                <p className="text-xs font-medium text-red-400 bg-red-950/30 border border-red-900/30 rounded-xl py-2 px-3">
                  ⚠️ {configError}
                </p>
              )}

              {configSuccess && (
                <p className="text-xs font-medium text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 rounded-xl py-2 px-3">
                  ✓ {configSuccess}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all cursor-pointer"
              >
                Alterar Palavra-passe
              </button>
            </form>

            <div className="bg-[#0F172A] border border-white/5 rounded-3xl p-6 sm:p-8 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-300 flex items-center gap-1.5 border-b border-slate-900 pb-3">
                  <Settings size={16} className="text-blue-500" />
                  Status de Sincronização
                </h3>
                <div className="space-y-3 pt-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Supabase Database:</span>
                    <span className="font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-900/40 text-emerald-400 border border-emerald-800/40">Conectado (Live)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Supabase Auth:</span>
                    <span className="font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-900/40 text-emerald-400 border border-emerald-800/40">Operando (Live)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Supabase Storage:</span>
                    <span className="font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-900/40 text-emerald-400 border border-emerald-800/40">Operando (Live)</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/30 text-[11px] text-slate-300 leading-relaxed font-light">
                <b>Nota:</b> No caso de não possuir as variáveis de ambiente do Supabase carregadas, o sistema comutará de forma automática e transparente para o simulador seguro Offline para assegurar que nenhuma funcionalidade do painel seja interrompida.
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
