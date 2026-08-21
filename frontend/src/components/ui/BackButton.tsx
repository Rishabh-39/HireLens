import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  /** Static route to navigate to. Falls back to browser history if omitted. */
  to?: string;
  /** Link label shown beside the arrow. Defaults to "Back". */
  label?: string;
  /** Extra CSS classes appended to the root element. */
  className?: string;
}

export function BackButton({ to, label = 'Back', className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`group inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors hover:text-ink-100 ${className}`}
    >
      <ArrowLeft
        size={15}
        className="transition-transform group-hover:-translate-x-0.5"
      />
      {label}
    </button>
  );
}
