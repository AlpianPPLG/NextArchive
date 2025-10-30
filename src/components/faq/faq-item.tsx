"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FAQItemProps {
    question: string
    answer: string
}

export function FAQItem({ question, answer }: FAQItemProps) {
    const [open, setOpen] = useState(false)

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Button
                onClick={() => setOpen(!open)}
                variant="ghost"
                className="w-full justify-between items-center p-6 hover:bg-gray-50 text-left"
            >
                <span className="font-semibold text-gray-900">{question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${open ? "rotate-180" : ""}`} />
            </Button>
            {open && <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700">{answer}</div>}
        </div>
    )
}
