import { AppProvider } from '@/lib/context';
import './globals.css';

export const metadata = {
  title: 'HealthMate - AI Health Assistant',
  description: 'Your personal AI-powered health companion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}