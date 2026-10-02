import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { usePublicBusiness } from '../../hooks/usePublicBusiness';
import { useStoreMeta } from '../../hooks/useStoreMeta';
import { useStoreManifest } from '../../hooks/useStoreManifest';
import { productService, categoryService, bannerService, testimonialService, promotionService } from '../../services/storeServices';
import type { StoreProduct } from '../../models/product.model';
import type { StoreCategory } from '../../models/category.model';
import type { StoreBanner, StoreTestimonial, StorePromotion } from '../../models/marketing.model';
import { THEME_COLORS } from '../../models/business.model';

import { StoreContext, type StoreContextValue } from './context/StoreContext';
import StoreHeader from './components/StoreHeader';
import StoreHero from './components/StoreHero';
import StoreBanners from './components/StoreBanners';
import StoreCategories from './components/StoreCategories';
import StoreCatalogue from './components/StoreCatalogue';
import StoreFeatured from './components/StoreFeatured';
import StorePromotions from './components/StorePromotions';
import StoreTestimonials from './components/StoreTestimonials';
import StoreContact from './components/StoreContact';
import StoreFooter from './components/StoreFooter';
import StoreProductModal from './components/StoreProductModal';
import StoreWhatsAppFab from './components/StoreWhatsAppFab';
import StoreOwnerReturnBar from './components/StoreOwnerReturnBar';
import NotFoundPage from '../shared/NotFoundPage';

export default function PublicStorePage() {
  const { slug } = useParams<{ slug: string }>();
  const { business, loading: loadingBusiness, notFound } = usePublicBusiness(slug);
  const accent = business ? business.primaryColor ?? THEME_COLORS[business.theme].primary : '#2563eb';
  useStoreMeta(business);
  useStoreManifest(business, accent);

  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [banners, setBanners] = useState<StoreBanner[]>([]);
  const [testimonials, setTestimonials] = useState<StoreTestimonial[]>([]);
  const [promotions, setPromotions] = useState<StorePromotion[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [searchText, setSearchText] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);

  useEffect(() => {
    if (!business) return;
    setLoadingData(true);
    Promise.all([
      productService.listByBusiness(business.id),
      categoryService.listByBusiness(business.id),
      bannerService.listByBusiness(business.id),
      testimonialService.listByBusiness(business.id),
      promotionService.listByBusiness(business.id),
    ]).then(([prods, cats, banns, tests, promos]) => {
      setProducts(prods);
      setCategories(cats.sort((a, b) => a.order - b.order));
      setBanners(banns.sort((a, b) => a.order - b.order));
      setTestimonials(tests);
      setPromotions(promos);
      setLoadingData(false);

      // Deep link support: ?prod=ID opens the product modal directly
      const params = new URLSearchParams(window.location.search);
      const prodId = params.get('prod');
      if (prodId) {
        const match = prods.find((p) => p.id === prodId);
        if (match) setSelectedProduct(match);
      }
    });
  }, [business]);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-out-cubic', once: true, offset: 50 });
  }, []);

  const openProduct = useCallback((product: StoreProduct) => {
    setSelectedProduct(product);
    const url = new URL(window.location.href);
    url.searchParams.set('prod', product.id);
    window.history.replaceState({}, '', url.toString());
  }, []);

  const closeProduct = useCallback(() => {
    setSelectedProduct(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('prod');
    window.history.replaceState({}, '', url.toString());
  }, []);

  const whatsappLink = useCallback(
    (message: string): string | null => {
      if (!business?.whatsapp) return null;
      const digits = business.whatsapp.replace(/\D/g, '');
      if (!digits) return null;
      return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
    },
    [business]
  );

  const storeValue: StoreContextValue | null = useMemo(() => {
    if (!business) return null;
    const accentSoft = business.secondaryColor ?? THEME_COLORS[business.theme].secondary;
    return { business, accent, accentSoft, products, categories, banners, testimonials, promotions, whatsappLink, openProduct };
  }, [business, accent, products, categories, banners, testimonials, promotions, whatsappLink, openProduct]);

  const handleExplore = () => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });

  if (loadingBusiness) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={28} />
      </div>
    );
  }

  if (notFound || !business || !storeValue) {
    return <NotFoundPage />;
  }

  return (
    <StoreContext.Provider value={storeValue}>
      <div className="bg-slate-50 min-h-screen text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
        <StoreOwnerReturnBar businessId={business.id} />
        <StoreHeader
          searchValue={searchText}
          onSearchChange={setSearchText}
          activeCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />

        {loadingData ? (
          <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col gap-4">
            <div className="w-10 h-10 border-2 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">A carregar o catálogo...</p>
          </div>
        ) : (
          <>
            <StoreHero onExploreClick={handleExplore} />
            <StoreCategories onCategorySelect={setSelectedCategory} />
            <StoreBanners />
            <StoreCatalogue selectedCategory={selectedCategory} onCategorySelect={setSelectedCategory} searchText={searchText} />
            <StoreFeatured />
            <StorePromotions />
            <StoreTestimonials />
            <StoreContact />
          </>
        )}

        <StoreFooter />
        {selectedProduct && <StoreProductModal product={selectedProduct} onClose={closeProduct} />}
        <StoreWhatsAppFab />
      </div>
    </StoreContext.Provider>
  );
}
