import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Share2, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Heart, ZoomIn, Leaf, Star } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  allProducts: Product[];
  onRelatedProductClick: (p: Product) => void;
}

export default function ProductDetailModal({
  product,
  onClose,
  allProducts,
  onRelatedProductClick
}: ProductDetailModalProps) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const images = useMemo(() => {
    return product.images && product.images.length > 0 
      ? product.images 
      : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'];
  }, [product]);

  const relatedProducts = useMemo(() => {
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [allProducts, product]);

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}?prod=${product.id}`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Veja este produto incrível: ${product.name}!`,
        url: shareUrl,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getWhatsAppLink = () => {
    const message = `Olá, tenho interesse no produto *${product.name}* do catálogo.
Categoria: ${product.category.toUpperCase()} (${product.subcategory})
Preço: ${product.price} MT
Por favor, gostaria de combinar a entrega e o pagamento!`;
    return `https://wa.me/258866473065?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Lightbox Mode Overlay */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center cursor-zoom-out p-4"
          onClick={() => setIsZoomed(false)}
        >
          <button 
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white"
            onClick={() => setIsZoomed(false)}
          >
            <X size={24} />
          </button>
          
          <img 
            src={images[activeImgIndex]} 
            alt={product.name} 
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
          />
          
          <div className="mt-4 text-xs text-slate-400 font-mono">
            {activeImgIndex + 1} de {images.length} • Clique em qualquer lugar para fechar
          </div>
        </div>
      )}

      {/* Main Modal Box */}
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-5xl rounded-3xl glass-modal p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-800/80 overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Absolute Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          {/* Left Column: Image Viewer */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-950 overflow-hidden group border border-slate-900 shadow-md">
              <img
                src={images[activeImgIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500"
                referrerPolicy="no-referrer"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-800 shadow-md transition-colors z-10"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={handleNextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-white border border-slate-800 shadow-md transition-colors z-10"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {/* Lightbox Zoom Icon Overlay */}
              <button
                onClick={() => setIsZoomed(true)}
                className="absolute bottom-4 right-4 p-2.5 rounded-full bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 shadow-md transition-all z-10 cursor-zoom-in"
                title="Ampliar Imagem"
              >
                <ZoomIn size={16} />
              </button>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex flex-wrap gap-2.5 pt-1 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImgIndex(index)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden bg-slate-950 border transition-all cursor-pointer flex-shrink-0 ${
                      activeImgIndex === index ? 'border-blue-500 ring-2 ring-blue-500/20 scale-105' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information Panel */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Category Breadcrumb & Status */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
                  {product.category === 'vestuario' ? 'Vestuário' : product.category === 'calcados' ? 'Calçados' : 'Yougurt de Malambe'}
                </span>
                
                <div className="flex items-center gap-1.5">
                  {product.status === 'disponivel' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 size={14} className="fill-emerald-400/10" />
                      Disponível
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-400">
                      <XCircle size={14} className="fill-red-400/10" />
                      Esgotado
                    </span>
                  )}
                </div>
              </div>

              {/* Product Title */}
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight mt-2">
                {product.name}
              </h2>

              {/* Price Details */}
              <div className="flex items-baseline gap-3 mt-4">
                <span className="font-display font-bold text-2xl sm:text-3xl text-amber-400 font-mono">
                  {product.price} MT
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-500 line-through font-mono">
                    {product.originalPrice} MT
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-6">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-900 pb-2">Descrição do Produto</h4>
                <p className="text-sm text-slate-300 font-light leading-relaxed mt-3 whitespace-pre-line">
                  {product.description}
                </p>
              </div>

              {/* Nutri info box if category is "sorvete" */}
              {product.category === 'sorvete' && product.nutritionalInfo && (
                <div className="mt-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <Leaf size={16} className="text-amber-400" />
                    <h5 className="font-display font-bold text-xs text-amber-300 uppercase tracking-wider">Benefícios Nutritivos (Malambe)</h5>
                  </div>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed font-light">
                    O Malambe é rico em Vitamina C (mais que a laranja), ferro, potássio, fibras solúveis e antioxidantes que reforçam a imunidade.
                  </p>
                  <div className="grid grid-cols-4 gap-2 text-center pt-1">
                    {Object.entries(product.nutritionalInfo).map(([key, value]) => (
                      <div key={key} className="bg-slate-950/60 p-2 rounded-xl border border-slate-900">
                        <span className="block text-[9px] uppercase text-slate-500 font-bold tracking-wider">
                          {key === 'calories' ? 'Calorias' : key === 'vitaminC' ? 'Vit. C' : key === 'calcium' ? 'Cálcio' : 'Fibra'}
                        </span>
                        <span className="block font-mono text-xs font-bold text-amber-400 mt-0.5">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Panel */}
            <div className="space-y-4 pt-6 border-t border-slate-900/80">
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl py-3.5 text-sm shadow-md transition-all cursor-pointer ${
                    product.status === 'esgotado' ? 'bg-slate-900 text-slate-500 cursor-not-allowed pointer-events-none' : ''
                  }`}
                >
                  <MessageSquare size={16} className="fill-white" />
                  Encomendar via WhatsApp
                </a>

                <button
                  onClick={handleShare}
                  className="px-4 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
                >
                  <Share2 size={16} />
                  <span>{copiedLink ? 'Copiado!' : 'Partilhar'}</span>
                </button>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-slate-500">
                  ⚠️ Encomendas finalizadas diretamente no WhatsApp Oficial: <strong>+258 866473065</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-900/80">
            <h3 className="font-display font-bold text-lg text-white mb-6">Produtos Relacionados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    onRelatedProductClick(p);
                    setActiveImgIndex(0);
                  }}
                  className="group bg-slate-950/40 border border-slate-900 p-3 rounded-xl cursor-pointer hover:border-slate-800 transition-all flex gap-3"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0">
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden">
                    <h4 className="font-semibold text-xs text-slate-200 group-hover:text-blue-400 transition-colors truncate">
                      {p.name}
                    </h4>
                    <span className="font-mono text-xs text-amber-400 font-bold mt-1">{p.price} MT</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
