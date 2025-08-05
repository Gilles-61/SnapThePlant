
'use client';

import { useTranslation } from "@/hooks/use-language";
import { Button } from "./ui/button";
import { Heart, Info, Mail, ShieldAlert } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
    const { t } = useTranslation();
    const buyMeACoffeeLink = "https://buymeacoffee.com/snaptheplant";

    const footerLinks = [
        { href: '/about', text: t('footer.about'), icon: Info },
        { href: '/disclaimer', text: t('footer.disclaimer'), icon: ShieldAlert },
        { href: 'mailto:support@snaptheplant.com', text: t('footer.support'), icon: Mail },
    ]

    return (
        <footer className="w-full border-t border-black/10 bg-white/80 backdrop-blur-lg shadow-inner mt-auto">
            <div className="container flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 max-w-screen-2xl px-4 sm:px-6 py-4 sm:py-0 gap-4">
                <div className="flex items-center gap-6 text-sm text-slate-600">
                   {footerLinks.map(({ href, text, icon: Icon }) => (
                     <Link key={text} href={href} className="flex items-center gap-2 hover:text-primary transition-colors">
                        <Icon className="h-4 w-4" />
                        <span>{text}</span>
                     </Link>
                   ))}
                </div>
                 <Button asChild>
                    <a href={buyMeACoffeeLink} target="_blank" rel="noopener noreferrer">
                        <Heart className="mr-2 h-4 w-4" />
                        {t('footer.donate')}
                    </a>
                </Button>
            </div>
        </footer>
    )
}
