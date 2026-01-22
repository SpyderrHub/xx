import { PackageOpen } from 'lucide-react';

export default function PlaceholderContent({ title }: { title: string }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <PackageOpen className="h-10 w-10 text-muted-foreground" />
        <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground">
          This page is under construction.
        </p>
      </div>
    </div>
  );
}
