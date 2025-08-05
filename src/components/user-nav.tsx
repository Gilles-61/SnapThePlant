
"use client"

import * as React from "react"
import Link from "next/link";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import { Button } from "@/components/ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useLanguage, languages } from "@/hooks/use-language"
import { useAuth } from "@/hooks/use-auth"
import { Languages, Heart, LogIn, LifeBuoy, User as UserIcon, LogOut } from "lucide-react"
import { ThemeToggle } from "./theme-toggle";
  
  export function UserNav() {
    const { language, setLanguage, t } = useLanguage()
    const { user, loading, signOut } = useAuth();
    const buyMeACoffeeLink = "https://buymeacoffee.com/snaptheplant";

    if (loading) {
      return <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled><Avatar className="h-8 w-8" /></Button>
    }

    if (!user) {
      return (
        <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </Button>
        </div>
      )
    }

    return (
        <div className="flex items-center gap-2">
            <ThemeToggle />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL ?? "https://placehold.co/100x100.png"} alt={user.displayName ?? 'User'} />
                    <AvatarFallback>{user.displayName?.charAt(0)?.toUpperCase() ?? 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName ?? t('userNav.user')}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                        {user.email ?? t('userNav.userEmail')}
                    </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                    <Link href="/profile">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>{t('userNav.profile')}</span>
                    </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                    <a href="mailto:feedback@snaptheplant.com?subject=Beta Feedback for SnapThePlant" target="_blank" rel="noopener noreferrer">
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>{t('userNav.reportIssue')}</span>
                    </a>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                    <Languages className="mr-2 h-4 w-4" />
                    <span>{t('userNav.language')}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup value={language} onValueChange={(value) => setLanguage(value as any)}>
                        {languages.map(lang => (
                        <DropdownMenuRadioItem key={lang.code} value={lang.code}>{lang.name}</DropdownMenuRadioItem>
                        ))}
                    </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <a href={buyMeACoffeeLink} target="_blank" rel="noopener noreferrer" className="flex items-center cursor-pointer">
                        <Heart className="mr-2 h-4 w-4" />
                        {t('userNav.becomeMember')}
                    </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>{t('userNav.logout')}</span>
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
  }
