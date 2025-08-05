
"use client";

import { CheckCircle, Gift } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function PricingPage() {
    const buyMeACoffeeLink = "https://buymeacoffee.com/snaptheplant";

    const tiers = [
        {
            name: "Beta Tester",
            price: "Free",
            priceSuffix: "/access",
            description: "Get early access and help shape the future of our app.",
            features: [
                "Provide valuable feedback and get full access during the beta period.",
            ],
            buttonText: "Sign Up Now",
            buttonVariant: "default" as const,
            href: "/signup",
        },
        {
            name: "Monthly",
            price: "$4",
            priceSuffix: "/month",
            description: "Flexibility at its best.",
            features: [
                "Unlimited AI Identifications",
                "High-Accuracy Identification Model",
                "Save Unlimited Items to Collection",
                "Offline Access for Your Collection",
                "Priority Support"
            ],
            buttonText: "Subscribe Now",
            buttonVariant: "default" as const,
            href: buyMeACoffeeLink,
        },
        {
            name: "Yearly",
            price: "$45",
            priceSuffix: "/year",
            description: "Save with an annual plan.",
            features: [
                "Unlimited AI Identifications",
                "High-Accuracy Identification Model",
                "Save Unlimited Items to Collection",
                "Offline Access for Your Collection",
                "Priority Support"
            ],
            buttonText: "Subscribe Now",
            buttonVariant: "default" as const,
            isMostPopular: true,
            href: buyMeACoffeeLink,
        },
        {
            name: "Donation",
            price: "Any Amount",
            description: "Support the project's growth.",
            features: [], // Removed features to be handled differently
            buttonText: "Donate",
            buttonVariant: "outline" as const,
            href: buyMeACoffeeLink,
        },
    ];

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {tiers.map((tier) => (
                        <Card key={tier.name} className={cn("flex flex-col relative", tier.isMostPopular && "border-primary shadow-lg")}>
                            {tier.isMostPopular && (
                                <div className="absolute top-0 right-4 -mt-3">
                                    <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase">Most Popular</div>
                                </div>
                            )}
                            <CardHeader className="flex-1">
                                <CardTitle>{tier.name}</CardTitle>
                                <CardDescription>{tier.description}</CardDescription>
                                <div className="mt-6">
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                    {tier.priceSuffix && <span className="text-lg font-medium text-muted-foreground">{tier.priceSuffix}</span>}
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1">
                                {tier.name === 'Donation' ? (
                                    <p className="text-muted-foreground">
                                        Your support helps us improve and maintain the app for everyone. Thank you for considering a donation!
                                    </p>
                                ) : (
                                    <ul className="space-y-4">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start">
                                            <CheckCircle className="h-6 w-6 text-green-500 mr-2 shrink-0" />
                                            <span className="text-muted-foreground">{feature}</span>
                                        </li>
                                    ))}
                                    </ul>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full" variant={tier.buttonVariant}>
                                     {tier.href.startsWith('/') ? (
                                        <Link href={tier.href}>
                                            {tier.buttonText}
                                        </Link>
                                    ) : (
                                        <a href={tier.href} target="_blank" rel="noopener noreferrer">
                                            {tier.name === "Donation" && <Gift className="mr-2 h-4 w-4" />}
                                            {tier.buttonText}
                                        </a>
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
                <p className="text-center text-muted-foreground mt-8 text-sm">
                    Payments are processed securely through Buy Me a Coffee. You can cancel anytime.
                </p>
            </div>
        </div>
    );
}
