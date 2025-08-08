
"use client";

import { CheckCircle, Gift, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth, type SubscriptionStatus } from "@/hooks/use-auth";

export function PricingPage() {
    const { subscriptionStatus } = useAuth();
    const buyMeACoffeeLink = "https://buymeacoffee.com/snaptheplant";

    const tiers = [
        {
            name: "Beta Tester",
            id: 'beta' as SubscriptionStatus,
            price: "Free",
            priceSuffix: "/during beta",
            description: "Full access to all features while we are in beta. Your feedback is our reward!",
            features: [
                "Unlimited AI Identifications",
                "Save Unlimited Items to Collection",
                "Provide valuable feedback",
                "Shape the future of our app",
            ],
            buttonText: "Current Plan",
        },
        {
            name: "Monthly",
            id: 'paid' as SubscriptionStatus,
            price: "$4",
            priceSuffix: "/month",
            description: "The best way to support the project and get full access.",
            features: [
                "Unlimited AI Identifications",
                "High-Accuracy Identification Model",
                "Save Unlimited Items to Collection",
                "Offline Access for Your Collection",
                "Priority Support"
            ],
            buttonText: "Subscribe Now",
            isMostPopular: true,
        },
        {
            name: "Yearly",
            id: 'paid' as SubscriptionStatus,
            price: "$45",
            priceSuffix: "/year",
            description: "Save with an annual plan and get full access all year long.",
            features: [
                "Unlimited AI Identifications",
                "High-Accuracy Identification Model",
                "Save Unlimited Items to Collection",
                "Offline Access for Your Collection",
                "Priority Support"
            ],
            buttonText: "Subscribe Now",
        },
        {
            name: "Donation",
            id: 'free' as SubscriptionStatus,
            price: "Any Amount",
            description: "Not ready to subscribe? Support the project with a one-time donation.",
            features: [],
            buttonText: "Donate",
        },
    ];

    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-headline">Find the perfect plan</h1>
                    <p className="text-lg text-muted-foreground mt-2">
                        You are currently on the <span className="font-semibold text-primary">{subscriptionStatus.charAt(0).toUpperCase() + subscriptionStatus.slice(1)}</span> plan.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
                    {tiers.map((tier) => (
                        <Card key={tier.name} className={cn(
                            "flex flex-col relative", 
                            tier.isMostPopular && "border-primary shadow-lg",
                            subscriptionStatus === tier.id && tier.id !== 'paid' && "ring-2 ring-primary"
                        )}>
                             {tier.isMostPopular && (
                                <div className="absolute top-0 right-4 -mt-3">
                                    <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full uppercase flex items-center gap-1">
                                        <Star className="w-3 h-3"/>
                                        Most Popular
                                    </div>
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
                                {tier.id === 'free' ? (
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
                                <Button 
                                    asChild={tier.id !== 'beta'}
                                    className="w-full" 
                                    variant={subscriptionStatus === tier.id ? 'outline' : 'default'}
                                    disabled={subscriptionStatus === tier.id && tier.id !== 'paid'}
                                >
                                     {tier.id === 'beta' ? (
                                        <span>{tier.buttonText}</span>
                                     ) : (
                                        <a href={buyMeACoffeeLink} target="_blank" rel="noopener noreferrer">
                                            {tier.id === 'free' && <Gift className="mr-2 h-4 w-4" />}
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
