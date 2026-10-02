import { motion } from 'motion/react';
import { MessageSquare, Share2, ImageOff, Heart } from 'lucide-react';
import type { StoreProduct } from '../../../models/product.model';

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
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(15,23,42,0.08)]"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
        {product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${soldOut ? 'grayscale opacity-70' : ''}`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-300">
            <ImageOff size={30} />
          </div>
        )}

        <div className="absolute left-3 top-3 z-10 flex flex-wrap items-center gap-1.5">
          {soldOut ? (
            <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">Esgotado</span>
          ) : (
            <>
              {onSale && <span className="rounded-full bg-rose-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">Promoção -{discount}%</span>}
              {product.news && <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white" style={{ backgroundColor: accent }}>Novo</span>}
              {product.bestseller && <span className="rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-900">Mais vendido</span>}
            </>
          )}
        </div>

        <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
          <button
            type="button"
            aria-label="Guardar produto"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition-colors hover:text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <Heart size={15} />
          </button>
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              aria-label="Partilhar produto"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm transition-colors hover:text-slate-900"
            >
              <Share2 size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{product.category}</span>
        <h3 className="mt-2 text-lg font-extrabold tracking-[-0.04em] text-slate-900">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">{product.description}</p>

        <div className="mt-auto pt-4">
          <div className="flex items-baseline gap-2">
            {onSale && <span className="text-sm text-slate-400 line-through">{product.originalPrice} MT</span>}
            <span className="text-xl font-extrabold tracking-[-0.04em]" style={{ color: accent }}>{product.price} MT</span>
          </div>

          {orderHref && (
            <a
              href={orderHref}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-disabled={soldOut}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                soldOut ? 'pointer-events-none bg-slate-100 text-slate-400' : 'text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5'
              }`}
              style={{ backgroundColor: soldOut ? undefined : accent }}
            >
              <MessageSquare size={15} />
              Ver detalhes
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
