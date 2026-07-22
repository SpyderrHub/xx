'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How does prompt-based voice creation work?",
    a: "Our neural engine uses large-scale transformer models to understand natural language descriptions. When you describe a voice, it maps those adjectives (e.g., 'warm', 'raspy', 'authoritative') to specific acoustic parameters in our latent space to build a unique vocal identity."
  },
  {
    q: "Do I get full commercial rights to the audio?",
    a: "Yes. All paid plans (Starter, Creator, Pro) include a full commercial license. You own the copyright to the specific audio files generated using our platform."
  },
  {
    q: "How many languages are supported?",
    a: "We currently support over 500 languages, accents, and regional dialects, including massive coverage of Indic languages like Hindi, Telugu, Tamil, and Bengali with native-level prosody."
  },
  {
    q: "Can I clone my own voice?",
    a: "Absolutely. Our 'Instant Voice Cloning' feature allows you to create a high-fidelity clone of any speaker with just 30 seconds of reference audio."
  }
];

export default function FaqSection() {
  return (
    <section className="py-24 relative overflow-hidden bg-transparent border-t border-white/5">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Common Questions
          </h2>
          <p className="text-muted-foreground">Everything you need to know about the QuantisAI engine.</p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/5 bg-white/[0.01] rounded-2xl px-6 border overflow-hidden">
              <AccordionTrigger className="text-left font-bold text-white hover:text-primary transition-colors text-sm sm:text-lg py-6">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed text-sm sm:text-base pb-6">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
