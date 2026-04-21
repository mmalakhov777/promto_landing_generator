import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from '@/components/icons/arrow-up-right';

interface ServiceRowProps {
  title: string;
  description: string;
  buttonLabel: string;
  showDivider?: boolean;
}

export function ServiceRow({ title, description, buttonLabel, showDivider = true }: ServiceRowProps) {
  return (
    <article
      className={cn(
        'flex flex-col lg:flex-row lg:items-center gap-4 py-8',
        showDivider && 'border-b border-border-light',
      )}
    >
      <div className="flex-1">
        <h3 className="text-xl lg:text-2xl font-medium text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary leading-[1.5] max-w-[500px]">{description}</p>
      </div>
      <Button
        variant="action"
        size="sm"
        href="https://app.promto.ai"
        icon={<ArrowUpRight size={14} />}
      >
        {buttonLabel}
      </Button>
    </article>
  );
}
