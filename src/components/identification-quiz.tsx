
"use client";

import { useState } from 'react';
import { useTranslation } from '@/hooks/use-language';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Category } from './category-selector';

export type Answers = Record<string, string>;

interface IdentificationQuizProps {
  category: Category;
  onComplete: (answers: Answers) => void;
}

const getQuestionsForCategory = (category: Category, t: Function) => {
    const commonPath = `quiz.${category.toLowerCase()}`;
    const optionsPath = 'quiz.options';
    switch (category) {
        case 'Plant':
            return [
                { id: 'color', text: t(`${commonPath}.color`), options: t(optionsPath + '.color') },
                { id: 'shape', text: t(`${commonPath}.shape`), options: t(optionsPath + '.shape') },
                { id: 'size', text: t(`${commonPath}.size`), options: t(optionsPath + '.size') },
            ];
        case 'Tree':
            return [
                { id: 'bark', text: t(`${commonPath}.bark`), options: t(optionsPath + '.bark') },
                { id: 'leaf_shape', text: t(`${commonPath}.leaf_shape`), options: t(optionsPath + '.shape') },
                { id: 'has_fruit', text: t(`${commonPath}.has_fruit`), options: t(optionsPath + '.has_fruit') },
            ];
        case 'Weed':
            return [
                { id: 'flower_color', text: t(`${commonPath}.flower_color`), options: t(optionsPath + '.color') },
                { id: 'location', text: t(`${commonPath}.location`), options: t(optionsPath + '.location') },
                { id: 'leaf_type', text: t(`${commonPath}.leaf_type`), options: t(optionsPath + '.leaf_type') },
            ];
        case 'Insect':
            return [
                { id: 'color', text: t(`${commonPath}.color`), options: t(optionsPath + '.color') },
                { id: 'wings', text: t(`${commonPath}.wings`), options: t(optionsPath + '.wings') },
                { id: 'legs', text: t(`${commonPath}.legs`), options: t(optionsPath + '.legs') },
            ];
        default:
            return [];
    }
};

export function IdentificationQuiz({ category, onComplete }: IdentificationQuizProps) {
  const { t } = useTranslation();
  const [answers, setAnswers] = useState<Answers>({});

  const questions = getQuestionsForCategory(category, t);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(answers);
  };

  return (
    <div className="w-full h-full bg-background/90 backdrop-blur-sm z-10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>{t('quiz.title')}</CardTitle>
                <CardDescription>{t('quiz.description')}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                    {questions.map((q) => (
                        <div key={q.id}>
                            <Label className="font-semibold text-base">{q.text}</Label>
                            <RadioGroup
                                onValueChange={(value) => handleAnswerChange(q.id, value)}
                                className="mt-2"
                            >
                                {Object.entries(q.options).map(([value, label]) => (
                                    <div key={value} className="flex items-center space-x-2">
                                        <RadioGroupItem value={value} id={`${q.id}-${value}`} />
                                        <Label htmlFor={`${q.id}-${value}`}>{label as string}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    ))}
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">{t('quiz.submit')}</Button>
                </CardFooter>
            </form>
        </Card>
    </div>
  );
}
