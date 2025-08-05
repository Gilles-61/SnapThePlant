
'use client';

import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-language';
import { MessageSquare, UploadCloud, Users } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const { t } = useTranslation();

  const features = [
    {
        icon: MessageSquare,
        title: t('pages.community.features.forums.title'),
        description: t('pages.community.features.forums.description'),
        href: '/'
    },
    {
        icon: UploadCloud,
        title: t('pages.community.features.submissions.title'),
        description: t('pages.community.features.submissions.description'),
        href: '/explore'
    },
    {
        icon: Users,
        title: t('pages.community.features.collaboration.title'),
        description: t('pages.community.features.collaboration.description'),
        href: '/profile'
    }
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{t('pages.community.title')}</CardTitle>
              <CardDescription className="text-lg">{t('pages.community.description')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                         <Link key={index} href={feature.href} className="flex flex-col items-center text-center p-4 rounded-lg border hover:bg-accent hover:text-accent-foreground transition-colors group">
                            <Icon className="h-12 w-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground group-hover:text-accent-foreground">{feature.description}</p>
                        </Link>
                    )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
