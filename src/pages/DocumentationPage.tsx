import { BookOpenText, ExternalLink, Info, Server } from 'lucide-react';
import { DOCUMENTATION_CATALOG } from '@/content/documentation/catalog';
import { CLIENT_BASE_PATH } from '@/shared/api/client';
import { Badge, Button, Card, CardContent, SectionHeader } from '@/shared/ui';
import { withBasePath } from '@/utils/basePath';
import type { DocumentationIconToken } from '@/types/documentation';

function iconForToken(token: DocumentationIconToken) {
  if (token === 'info') {
    return Info;
  }
  if (token === 'server') {
    return Server;
  }
  return BookOpenText;
}

export function DocumentationPage() {
  const catalog = DOCUMENTATION_CATALOG;
  const HeaderIcon = iconForToken(catalog.icon);
  const ResourceIcon = iconForToken(catalog.resource_card.icon);
  const imageSrc = catalog.resource_card.image_src
    ? withBasePath(catalog.resource_card.image_src, CLIENT_BASE_PATH)
    : null;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Card>
        <CardContent className="space-y-6 px-6 py-6">
          <SectionHeader
            eyebrow="Documentation"
            title={
              <span className="inline-flex items-center gap-3">
                <HeaderIcon className="h-7 w-7 text-emerald-600" />
                {catalog.title}
              </span>
            }
            description={catalog.subtitle}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-5 px-6 py-6">
          <SectionHeader
            title={catalog.framework.title}
            description={catalog.framework.intro}
            action={<Badge variant="success">Framework</Badge>}
          />

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 px-5 py-5">
            <ul className="space-y-3 text-sm leading-6 text-slate-700">
              {catalog.framework.bullets.map((bullet) => (
                <li key={bullet.id} className="list-disc pl-1 ml-5">
                  <span className="font-semibold text-slate-950">{bullet.label}: </span>
                  {bullet.description}{' '}
                  {bullet.url && bullet.url_label ? (
                    <a
                      href={bullet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-800"
                    >
                      {bullet.url_label}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-6 text-slate-600">{catalog.framework.closing}</p>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <SectionHeader
          eyebrow="Resources"
          title={catalog.resources_title}
          description="Official external references for the broader BioRemPP framework."
        />

        <div className="flex justify-center">
          <Card className="w-full max-w-2xl rounded-2xl border-emerald-200 shadow-soft">
            <CardContent className="space-y-6 px-6 py-6 text-center">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700">
                    <ResourceIcon className="h-7 w-7" />
                  </div>
                </div>

                <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
                  {catalog.resource_card.title}
                </h2>
              </div>

              {imageSrc ? (
                <div className="flex justify-center">
                  <img
                    src={imageSrc}
                    alt="BioRemPP logo"
                    className="h-auto max-h-44 w-full max-w-[12rem] object-contain opacity-85"
                  />
                </div>
              ) : null}

              <p className="mx-auto max-w-xl text-sm leading-7 text-slate-600">
                {catalog.resource_card.description}
              </p>

              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <a href={catalog.resource_card.url} target="_blank" rel="noopener noreferrer">
                  {catalog.resource_card.button_label}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
