import { Zap, Layers, BarChart3, Cloud } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
  {
    icon: <Layers className="h-8 w-8 text-primary" />,
    title: 'Built for Batch Audio',
    description: 'Process thousands of documents into high-quality narration simultaneously with zero bottleneck.',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Ultra Fast Synthesis',
    description: 'Average latency of ~2s globally. Ideal for interactive agents and real-time content delivery.',
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: 'Scalable Pricing',
    description: 'Pay for what you use. No hidden fees, no enterprise taxes, and no minimum monthly spend.',
  },
  {
    icon: <Cloud className="h-8 w-8 text-primary" />,
    title: 'Edge Deployment',
    description: 'Our neural models run on distributed edge infrastructure for reliable performance anywhere.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A developer-first platform designed to replace legacy TTS providers with speed and efficiency.
          </p>
        </div>
        <div className="mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="glass-card border-white/5 bg-white/[0.02] hover:bg-white/5 transition-all duration-300 rounded-[2rem]">
              <CardHeader className="p-8">
                <div className="mb-6 h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-black text-white">{feature.title}</CardTitle>
                <CardDescription className="pt-4 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;