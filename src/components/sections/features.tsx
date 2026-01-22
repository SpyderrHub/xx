import { AudioLines, Cpu, Languages, Voicemail } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
  {
    icon: <AudioLines className="h-8 w-8 text-primary" />,
    title: 'Advanced Voice Generation',
    description: 'Utilize our state-of-the-art TTS to create incredibly realistic and natural-sounding voices for any application.',
  },
  {
    icon: <Languages className="h-8 w-8 text-primary" />,
    title: 'Multi-Language Support',
    description: 'Reach a global audience with support for a wide range of languages and accents, all with the same high quality.',
  },
  {
    icon: <Voicemail className="h-8 w-8 text-primary" />,
    title: 'AI Voice Cloning',
    description: 'Create a digital replica of any voice from a short audio sample for truly personalized audio experiences.',
  },
  {
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: 'Scalable Infrastructure',
    description: 'Our robust cloud platform is built to handle millions of requests, ensuring reliability and speed at any scale.',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="bg-secondary py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Powerful Features for Every Use Case
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From content creation to custom applications, VoxAI provides the tools you need to innovate with voice.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-lg gap-8 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-300 rounded-2xl">
              <CardHeader className="p-8">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                <CardDescription className="pt-2">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
