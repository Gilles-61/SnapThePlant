
'use client';

import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-language';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{t('pages.privacy.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>{t('pages.privacy.p1')}</p>
              <p>{t('pages.privacy.p2')}</p>
              <p>{t('pages.privacy.p3')}</p>
              <p>{t('pages.privacy.p4')}</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
