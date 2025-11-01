"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface FAQItemProps {
    question: string
    answer: string
}

export function FAQItem({ question, answer }: FAQItemProps) {
    const [open, setOpen] = useState(false)

    return (
        <Card className={`overflow-hidden transition-all duration-300 ${
            open 
                ? "shadow-lg border-green-200 dark:border-green-800 ring-2 ring-green-100 dark:ring-green-900" 
                : "shadow-sm hover:shadow-md border-gray-200 dark:border-gray-700"
        }`}>
            <Button
                onClick={() => setOpen(!open)}
                variant="ghost"
                className="w-full justify-between items-start p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 text-left h-auto"
            >
                <div className="flex items-start gap-4 flex-1 pr-4">
                    <div className={`mt-1 transition-colors duration-300 ${
                        open ? "text-green-600 dark:text-green-400" : "text-gray-400 dark:text-gray-500"
                    }`}>
                        <HelpCircle className="w-5 h-5" />
                    </div>
                    <span className={`font-semibold text-base leading-relaxed transition-colors duration-300 ${
                        open ? "text-green-700 dark:text-green-400" : "text-gray-900 dark:text-white"
                    }`}>
                        {question}
                    </span>
                </div>
                <ChevronDown
                    className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-all duration-300 flex-shrink-0 mt-1 ${
                        open ? "rotate-180 text-green-600 dark:text-green-400" : ""
                    }`}
                />
            </Button>

            <div className={`transition-all duration-300 ease-in-out ${
                open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}>
                <div className="px-6 pb-6 pt-2">
                    <div className="pl-9 pr-4">
                        <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50/50 dark:bg-green-900/20 rounded-r-lg">
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{answer}</p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}
