'use client';

import "./globals.css";
import Content from "../components/content"
import '@rainbow-me/rainbowkit/styles.css';
import { Toaster } from 'sonner';
import dynamic from 'next/dynamic';

// Charger le Providers uniquement côté client pour éviter les erreurs SSR
const Providers = dynamic(
  () => import('./providers').then((mod) => mod.Providers),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <Providers>
          <Toaster position="top-right" richColors />
          <Content>
            {children}
          </Content>
        </Providers>
      </body>
    </html>
  );
}
