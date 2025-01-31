import { AppProvider } from '@/lib/context';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'], // Add the weights you need
  variable: '--font-inter',  // Add this for Tailwind
});

export const metadata = {
  title: 'HealthMate - AI Health Assistant',
  description: 'Your personal AI-powered health companion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={inter.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}