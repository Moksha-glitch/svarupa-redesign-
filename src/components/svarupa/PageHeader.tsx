import { Breadcrumb, type Crumb } from "./Breadcrumb";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  crumbs?: Crumb[];
}) {
  return (
    <header className="space-y-4">
      {crumbs?.length ? <Breadcrumb items={crumbs} /> : null}
      {eyebrow ? <p className="text-caption">{eyebrow}</p> : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="measure">
          <h1 className="text-h1">{title}</h1>
          {description ? <p className="mt-3 text-body-lg">{description}</p> : null}
        </div>
        {action}
      </div>
    </header>
  );
}
