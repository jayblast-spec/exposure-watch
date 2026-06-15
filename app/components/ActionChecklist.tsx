export default function ActionChecklist({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">
      <h3 className="text-sm font-semibold text-foreground">What to do now</h3>
      <ul className="mt-2 space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-muted">
            <span className="text-safe">?</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
