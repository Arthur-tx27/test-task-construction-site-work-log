import type { Metadata } from 'next';
import { QueryClientProvider } from '@/app/providers/query-client-provider';
import { Toaster } from '@/shared/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Журнал работ',
  description: 'Журнал работ на строительном объекте',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <QueryClientProvider>
          {children}
          <Toaster richColors closeButton />
        </QueryClientProvider>
      </body>
    </html>
  );
}
