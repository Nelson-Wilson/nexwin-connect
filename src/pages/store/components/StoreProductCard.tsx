import { motion } from 'motion/react';
import { MessageSquare, Share2, ImageOff } from 'lucide-react';
import type { StoreProduct } from '../../../models/product.model';

/**
 * Shared product card for the public storefront (catalogue + featured).
 * Behaviour is identical to the previous inline cards: clicking opens the
 * product modal, the WhatsApp link opens the order message, sharing copies/shares the deep link.
 */
export default function StoreProductCard({
  product,
  accent,
  orderHref,
  onOpen,
  onShare,
  index = 0,
}: {
  product: StoreProduct;
  accent: string;
  orderHref: string | null;
  onOpen: () => void;
  onShare?: (e: React.MouseEvent) => void;
  index?: number;
}) {
  const soldOut = product.status === 'esgotado';
  const onSale = !!product.originalPrice && product.originalPrice > product.price;
  const discount = onSale ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100) : 0;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
      onClick={onOpen}
      className="group flex flex-col h-full rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-[4/5] w-full bg-slate-100 overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${soldOut ? 'grayscale opacity-70' : ''}`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <ImageOff size={30} />
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
          {soldOut ? (
            <span className="bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">Esgotado</span>
          ) : (
            <>
              {onSale && <span className="bg-rose-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">Promoção · -{discount}%</span>}
              {product.news && <span className="text-white text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: accent }}>Novo</span>}
              {product.bestseller && <span className="bg-amber-400 text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full">Mais vendido</span>}
            </>
          )}
        </div>

        {onShare && (
          <button
            onClick={onShare}
            aria-label="Partilhar produto"
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/95 text-slate-600 hover:text-slate-900 shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
          >
            <Share2 size={14} />
          </button>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs text-slate-400 font-medium">{product.category}</span>
        <h3 className="font-display font-bold text-[15px] text-slate-900 mt-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed min-h-[2rem]">{product.description}</p>

        <div className="mt-auto pt-4 flex items-end justify-between gap-3">
          <div className="flex flex-col leading-tight">
            {onSale && <span className="text-xs text-slate-400 line-through">{product.originalPrice} MT</span>}
            <span className="font-display font-extrabold text-xl text-slate-900">{product.price} MT</span>
          </div>
          {orderHref && (
            <a
              href={orderHref}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-disabled={soldOut}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                soldOut
                  ? 'bg-slate-100 text-slate-400 pointer-events-none'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25 active:scale-95'
              }`}
            >
              <MessageSquare size={14} />
              Pedir
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
