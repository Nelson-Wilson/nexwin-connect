import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Store, Package, Eye } from 'lucide-react';
import { platformStatsService, type PlatformStats } from '../../services/platformStatsService';

interface StatDefinition {
  key: keyof PlatformStats;
  icon: typeof Store;
  label: string;
}

const STAT_DEFINITIONS: StatDefinition[] = [
  { key: 'businesses', icon: Store, label: 'Lojas Criadas' },
  { key: 'products', icon: Package, label: 'Produtos Publicados' },
  { key: 'pageViews', icon: Eye, label: 'Visualizações da Página' },
];

function CountUp({ value, isVisible }: { value: number; isVisible: boolean }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1200;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, value]);

  return <span>{display.toLocaleString('pt-PT')}</span>;
}

export default function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    let active = true;
    platformStatsService
      .getStats()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch(() => {
        if (active) setStats({ businesses: 0, products: 0, pageViews: 0 });
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section ref={ref} className="py-16 sm:py-20 bg-gradient-to-b from-[#0F172A] to-[#0B1120] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 mb-10">
          Números reais da plataforma, actualizados em directo
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STAT_DEFINITIONS.map((stat, index) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <stat.icon className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <p className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white min-h-[2.5rem] flex items-center justify-center gap-0.5">
                {stats === null ? (
                  <span className="inline-block w-16 h-9 rounded-md bg-white/5 animate-pulse" />
                ) : (
                  <>
                    <CountUp value={stats[stat.key]} isVisible={isInView} />
                    <span className="text-blue-500">+</span>
                  </>
                )}
              </p>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 uppercase tracking-wider font-semibold">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
