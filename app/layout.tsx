import BottomNavigation from '@/components/BottomNavigation';
import LeftSideBar from '@/components/LeftSideBar';
import { LoadingProvider } from '@/components/loadingProvider';
import Navbar from '@/components/Navbar';
import RouteLoader from '@/components/ui/routeLoader';
import Providers from '@/Providers';
import SessionProvider from '@/utils/SessionProvider';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Inter } from 'next/font/google';
import './globals.css';
import { StoreProviders } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Firm Corner',

  description: `FirmCorner is a powerful branding platform that helps businesses, creators, and entrepreneurs create a professional brand profile, showcase their products, and grow their online presence. Whether you're launching a new brand or scaling an existing one, FirmCorner gives you the tools to stand out and connect with your audience.`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang='en'>
      <body className={inter.className}>
        <LoadingProvider>
          <RouteLoader />
          <StoreProviders>
            <SessionProvider session={session}>
              <Navbar />
              <div className='mx-auto max-w-screen text-2xl gap-2 flex flex-row'>
                <Providers>
                  {session?.user && <LeftSideBar />}
                  {children}
                  {session?.user && <BottomNavigation />}
                </Providers>
              </div>
            </SessionProvider>
          </StoreProviders>
        </LoadingProvider>
      </body>
    </html>
  );
}
