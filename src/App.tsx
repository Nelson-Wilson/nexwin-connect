import { useState, useEffect, useCallback } from 'react';
import { Product, Promotion, Testimonial, Banner } from './types';
import { firestoreService } from './supabase/database';
import { subscribeToAuthChanges, isSupabaseConfigured } from './supabase/auth';

// AOS import for Animate on Scroll
import AOS from 'aos';
import 'aos/dist/aos.css';

// Importing custom components
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Catalogue from './components/Catalogue';
import ProductDetailModal from './components/ProductDetailModal';
import Promotions from './components/Promotions';
import MalambeSection from './components/MalambeSection';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

export default function App() {
  // Sync States
  const [products, setProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Search/Filter states
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'vestuario' | 'calcados' | 'sorvete'>('todos');
  const [searchText, setSearchText] = useState('');
  
  // Details Modal state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Load and refresh lists from DB
  const refreshData = useCallback(async () => {
    try {
      const [prods, promos, tests, bannes] = await Promise.all([
        firestoreService.getProducts(),
        firestoreService.getPromotions(),
        firestoreService.getTestimonials(),
        firestoreService.getBanners(),
      ]);
      setProducts(prods);
      setPromotions(promos);
      setTestimonials(tests);
      setBanners(bannes);
    } catch (err) {
      console.error('Error fetching dynamic data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    // Initialize Animate on Scroll (AOS) with sleek configurations
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });

    // Load initial products & data
    refreshData();

    // Subscribe to real session changes (Supabase Auth / Fallback Local Storage)
    const unsubscribe = subscribeToAuthChanges((user) => {
      setIsAdmin(!!user);
    });

    // Check for shared direct product links (e.g., ?prod=prod_11)
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get('prod');
    if (prodId) {
      firestoreService.getProducts().then((allProds) => {
        const match = allProds.find(p => p.id === prodId);
        if (match) {
          setSelectedProduct(match);
        }
      });
    }

    return () => {
      unsubscribe();
    };
  }, [refreshData]);

  // Handle exploring catalogue from Hero Section
  const handleExploreClick = () => {
    const el = document.getElementById('catalogo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close product detail modal
  const handleCloseDetailModal = () => {
    setSelectedProduct(null);
    // Clean query parameter from URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.delete('prod');
    window.history.replaceState({}, '', url.toString());
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Set query parameter in URL for sharing
    const url = new URL(window.location.href);
    url.searchParams.set('prod', product.id);
    window.history.replaceState({}, '', url.toString());
  };

  return (
    <div className="bg-[#0F172A] min-h-screen text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Top Header */}
      <Header
        onSearchChange={setSearchText}
        searchValue={searchText}
        onCategorySelect={setSelectedCategory}
        activeCategory={selectedCategory}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        showAdminPanel={showAdminPanel}
        setShowAdminPanel={setShowAdminPanel}
      />

      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] flex-col gap-4">
          <div className="w-10 h-10 border-2 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-bold text-[10px] tracking-widest uppercase">Carregando o Catálogo...</p>
        </div>
      ) : showAdminPanel && isAdmin ? (
        /* Administrative Panel View */
        <AdminPanel
          products={products}
          promotions={promotions}
          testimonials={testimonials}
          banners={banners}
          onDataUpdate={refreshData}
          onClose={() => setShowAdminPanel(false)}
        />
      ) : (
        /* Main Catalog / Shop View */
        <>
          {/* Main Hero Banner with sliding parallax info */}
          <Hero onExploreClick={handleExploreClick} />

          {/* Quick categories section displaying beautiful 3D cards */}
          <Categories onCategorySelect={setSelectedCategory} />

          {/* Core products catalog with dynamic filters and searches */}
          <Catalogue
            products={products}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            onProductClick={handleProductSelect}
            searchText={searchText}
          />

          {/* Tailored Section dedicated entirely to Sorvete de Malambe */}
          <MalambeSection
            products={products}
            onProductClick={handleProductSelect}
          />

          {/* Automatic slide carousels highlighting special campaigns */}
          {promotions.length > 0 && (
            <Promotions
              promotions={promotions}
              products={products}
              onProductClick={handleProductSelect}
            />
          )}

          {/* Customer Reviews/Testimonials */}
          {testimonials.length > 0 && (
            <Testimonials testimonials={testimonials} />
          )}

          {/* Contacts Section and Map Location details */}
          <Contact />
        </>
      )}

      {/* Footer Details */}
      <Footer />

      {/* Product Details Lightbox Modal overlay */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={handleCloseDetailModal}
          allProducts={products}
          onRelatedProductClick={handleProductSelect}
        />
      )}

      {/* Persistent floating WhatsApp conversion element */}
      <a
        href="https://wa.me/258866473065?text=Ol%C3%A1!%20Estou%20a%20ver%20o%20cat%C3%A1logo%20e%20gostaria%20de%20fazer%20uma%20pergunta."
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-emerald-500/30 group"
        title="Falar no WhatsApp"
      >
        <i className="fa-brands fa-whatsapp text-2xl" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 text-xs font-bold uppercase tracking-wider block">
          WhatsApp
        </span>
      </a>
    </div>
  );
}
