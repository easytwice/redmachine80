import imageSizes from '@/data/imageSizes.json';

type MediaProps = {
  src: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'auto' | 'low';
  sizes?: string;
};

export function Media({ src, alt, className, loading = 'lazy', fetchPriority, sizes = '(max-width: 767px) 100vw, 50vw' }: MediaProps) {
  const dimension = (imageSizes as Record<string, { width: number; height: number }>)[src];
  if (!dimension) throw new Error(`Unknown image: ${src}`);
  const base = src.slice(0, -5);
  return <picture className={className}>
    <source type="image/avif" srcSet={`${base}@1x.avif ${Math.round(dimension.width / 2)}w, ${src} ${dimension.width}w`} sizes={sizes} />
    <source type="image/webp" srcSet={`${base}@1x.webp ${Math.round(dimension.width / 2)}w, ${base}.webp ${dimension.width}w`} sizes={sizes} />
    <img src={`${base}@1x.webp`} alt={alt} width={dimension.width} height={dimension.height} loading={loading} fetchPriority={fetchPriority} decoding="async" />
  </picture>;
}
