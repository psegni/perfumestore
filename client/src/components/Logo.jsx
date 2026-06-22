export default function Logo({ className = 'h-10 md:h-12 w-auto object-contain', alt = 'Shito Perfumes' }) {
  return <img src="/logo.png" alt={alt} className={className} />;
}
