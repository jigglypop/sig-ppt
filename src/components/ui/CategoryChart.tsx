import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect, useMemo, useRef, useState } from 'react';

interface CategoryChartProps {
  data: { category: string; count: number; name: string; icon: string }[];
}

// Brand gradients
const BRAND = ['#feac5e', '#c779d0', '#4bc0c8'];

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {

  const gradients = useMemo(
    () => data.map((_, i) => ({
      id: `grad-${i}`,
      from: BRAND[i % BRAND.length],
      to: BRAND[(i + 1) % BRAND.length],
    })),
    [data]
  );

  const chartData = useMemo(
    () => data.map((item, i) => ({
      name: item.name,
      value: item.count,
      gradientId: `grad-${i}`,
    })),
    [data]
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setBounds({ width: rect.width, height: rect.height });
    };
    update();
    const RO: any = (window as any).ResizeObserver;
    const ro = RO ? new RO(update) : null;
    if (ro) ro.observe(el as Element);
    window.addEventListener('resize', update);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const outerRadius = bounds.width && bounds.height
    ? Math.max(90, Math.floor(Math.min(bounds.width, bounds.height) * 0.38))
    : 120;
  const innerRadius = Math.floor(outerRadius * 0.4);

  const RADIAN = Math.PI / 180;
  const renderInsideLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius: ir, outerRadius: or, name, percent } = props;
    const r = ir + (or - ir) * 0.55;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    const small = bounds.width < 380;
    const text = small ? `${name}` : `${name} ${(percent * 100).toFixed(0)}%`;
    return (
      <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" style={{ fontSize: small ? 10 : 12, filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.9))' }}>
        {text}
      </text>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
      ref={containerRef}
      className="w-full h-[420px] sm:h-[480px] glass rounded-2xl p-4 sm:p-6 relative overflow-visible"
    >
      <h3 className="text-3xl font-title mb-4 text-white">
        <motion.span
          className="text-underline-clean"
          initial={{ "--underline-scale": 0 } as any}
          whileInView={{ "--underline-scale": 1 } as any}
          transition={{ duration: 0.9 }}
          style={{ "--underline-scale": 0 } as any}
        >
          카테고리별 시그 분포
        </motion.span>
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart style={{ filter: 'drop-shadow(0 0 12px rgba(75, 192, 200, 0.25))' }} margin={{ top: 12, right: 16, bottom: 28, left: 16 }}>
          <defs>
            {gradients.map(g => (
              <linearGradient id={g.id} x1="0%" y1="0%" x2="100%" y2="100%" key={g.id}>
                <stop offset="0%" stopColor={g.from} />
                <stop offset="100%" stopColor={g.to} />
              </linearGradient>
            ))}
          </defs>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderInsideLabel}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            dataKey="value"
            isAnimationActive
            animationBegin={0}
            animationDuration={1100}
            cursor={{ fill: 'rgba(255,255,255,0.06)' } as any}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#${entry.gradientId})`} stroke="rgba(255,255,255,0.35)" strokeWidth={1} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              color: '#ffffff',
              boxShadow: '0 0 20px rgba(199, 121, 208, 0.25)'
            }}
            itemStyle={{ color: '#ffffff' }}
            labelStyle={{ color: '#ffffff' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
