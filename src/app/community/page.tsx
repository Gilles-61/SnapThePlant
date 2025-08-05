
'use client';

import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-language';
import { Loader, MessageSquare, UploadCloud, Users } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CommunityPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!loading && !user) {
        router.push('/login');
    }
  }, [user, loading, router]);


  const features = [
    {
        icon: MessageSquare,
        title: t('pages.community.features.forums.title'),
        description: t('pages.community.features.forums.description'),
        href: null
    },
    {
        icon: UploadCloud,
        title: t('pages.community.features.submissions.title'),
        description: t('pages.community.features.submissions.description'),
        href: '/submissions'
    },
    {
        icon: Users,
        title: t('pages.community.features.collaboration.title'),
        description: t('pages.community.features.collaboration.description'),
        href: '/profile'
    }
  ]
  
  if (loading || !user) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <SiteHeader />
            <main className="flex-1 flex items-center justify-center">
                <Loader className="h-12 w-12 animate-spin" />
            </main>
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="flex-1 p-4 md:p-8 bg-background">
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
                    const Wrapper = feature.href ? Link : 'div';
                    const props: any = feature.href ? { href: feature.href } : {};
                    const isLink = !!feature.href;

                    return (
                         <Wrapper key={index} {...props} className={`flex flex-col items-center text-center p-4 rounded-lg border ${isLink ? 'hover:bg-accent hover:text-accent-foreground transition-colors group cursor-pointer' : 'opacity-70 cursor-not-allowed'}`}>
                            <Icon className="h-12 w-12 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground group-hover:text-accent-foreground">{feature.description}</p>
                             {!isLink && (
                                <div className="mt-2 text-xs font-semibold uppercase text-primary">
                                    {t('pages.community.comingSoon.title')}
                                </div>
                            )}
                        </Wrapper>
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
