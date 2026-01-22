'use client';
import { CheckCircle, Code } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ApiShowcaseSection = () => {
  const codeString = `
fetch('https://api.voxai.dev/v1/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: "Hello from VoxAI!",
    voice: "alex-male-en-us",
  })
})
.then(response => response.blob())
.then(audioBlob => {
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  audio.play();
});
  `;

  return (
    <section id="api" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Developer-Friendly API
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Integrate VoxAI's powerful voice generation into your applications
            with just a few lines of code.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h3 className="font-headline text-2xl font-semibold">
              Simple, Powerful, and RESTful
            </h3>
            <p className="text-muted-foreground">
              Our API is designed for ease of use and scalability, allowing you to
              focus on building great products.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span>
                  <span className="font-semibold">Easy Integration:</span>{' '}
                  Quickly add voice capabilities with our straightforward REST API.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span>
                  <span className="font-semibold">Clear Documentation:</span>{' '}
                  Comprehensive guides to get you started in minutes.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                <span>
                  <span className="font-semibold">Scalable & Reliable:</span>{' '}
                  Built on robust infrastructure to handle your workload.
                </span>
              </li>
            </ul>
          </div>
          <Card className="overflow-hidden bg-gray-900 shadow-2xl">
            <div className="flex items-center gap-2 bg-gray-800 px-4 py-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <CardContent className="p-0">
              <pre className="w-full overflow-x-auto p-4 text-sm">
                <code className="font-code text-white">{codeString.trim()}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ApiShowcaseSection;
