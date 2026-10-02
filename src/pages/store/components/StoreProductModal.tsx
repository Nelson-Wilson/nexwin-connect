import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { X, MessageSquare, Share2, ChevronLeft, ChevronRight, CheckCircle2, XCircle, ZoomIn } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import type { StoreProduct } from '../../../models/product.model';

export default function StoreProductModal({ product, onClose }: { product: StoreProduct; onClose: () => void }) {
  const { business, accent, products, whatsappLink, openProduct } = useStore();
  const [activeImg, setActiveImg] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  const images = product.images.length > 0 ? product.images : [];

  const related = useMemo(
    () => products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3),
    [products, product]
  );

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/loja/${business.slug}?prod=${product.id}`;
    if (navigator.share) {
      navigator.share({ title: product.name, text: `Vê este produto: ${product.name}!`, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const wa = whatsappLink(
    `Olá, tenho interesse no produto *${product.name}*.\nPreço: ${product.price} MT\nPor favor, gostaria de combinar a entrega e o pagamento!`
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      {isZoomed && images[activeImg] && (
        <div className="fixed inset-0 z-[110] bg-black/95 flex flex-col items-center justify-center cursor-zoom-out p-4" onClick={() => setIsZoomed(false)}>
          <button className="absolute top-4 right-4 p-2 rounded-full bg-white text-slate-500 hover:text-slate-900" onClick={() => setIsZoomed(false)}>
            <X size={24} />
          </button>
          <img src={images[activeImg]} alt={product.name} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-5xl rounded-3xl ui-modal p-6 sm:p-8 md:p-10 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white/90 text-slate-500 hover:text-slate-900 border border-slate-200 transition-colors">
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-slate-100 overflow-hidden border border-slate-100 shadow-md">
              {images[activeImg] ? (
                <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">Sem imagem</div>
              )}
              {images.length > 1 && (
                <>
                  <button onClick={() => setActiveImg((i) => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-slate-100 text-slate-900 border border-slate-200 shadow-md z-10">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setActiveImg((i) => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-slate-100 text-slate-900 border border-slate-200 shadow-md z-10">
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              {images[activeImg] && (
                <button onClick={() => setIsZoomed(true)} className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 shadow-md z-10">
                  <ZoomIn size={16} />
                </button>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex flex-wrap gap-2.5">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImg(index)}
                    className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border transition-all shrink-0"
                    style={activeImg === index ? { borderColor: accent } : { borderColor: '#1e293b' }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between gap-4 pr-12">
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: accent }}>{product.category}</span>
                {product.status === 'disponivel' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <CheckCircle2 size={14} /> Disponível
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                    <XCircle size={14} /> Esgotado
                  </span>
                )}
              </div>

              <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-2">{product.name}</h2>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="font-display font-bold text-2xl sm:text-3xl font-mono" style={{ color: accent }}>{product.price} MT</span>
                {product.originalPrice && <span className="text-sm text-slate-400 line-through font-medium">{product.originalPrice} MT</span>}
              </div>

              {product.description && (
                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2">Descrição</h4>
                  <p className="text-sm text-slate-600 font-light leading-relaxed mt-3 whitespace-pre-line">{product.description}</p>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row gap-3">
                {wa && (
                  <a
                    href={wa}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl py-3.5 text-sm shadow-md transition-all ${
                      product.status === 'esgotado' ? 'bg-white text-slate-500 pointer-events-none' : ''
                    }`}
                  >
                    <MessageSquare size={16} />
                    Encomendar via WhatsApp
                  </a>
                )}
                <button onClick={handleShare} className="px-4 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-white border border-slate-200 flex items-center justify-center gap-2 transition-all text-sm">
                  <Share2 size={16} />
                  {copied ? 'Copiado!' : 'Partilhar'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-100">
            <h3 className="font-display font-bold text-lg text-slate-900 mb-6">Produtos Relacionados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((p) => (
                <div
                  key={p.id}
                  onClick={() => { openProduct(p); setActiveImg(0); }}
                  className="group bg-slate-100/40 border border-slate-100 p-3 rounded-xl cursor-pointer hover:border-slate-300 transition-all flex gap-3"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    {p.images[0] && <img src={p.images[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden">
                    <h4 className="font-semibold text-xs text-slate-800 truncate">{p.name}</h4>
                    <span className="font-mono text-xs font-bold mt-1" style={{ color: accent }}>{p.price} MT</span>
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
