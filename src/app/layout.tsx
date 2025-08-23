import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Times Car App',
  description: 'Times Car Station Viewer',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <ThemeRegistry>
          <AppBar position='static' sx={{ mb: 2 }}>
            <Toolbar>
              <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
                <Link
                  href='/'
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Times Car App
                </Link>
              </Typography>
              <Button color='inherit' component={Link} href='/'>
                Map
              </Button>
              <Button color='inherit' component={Link} href='/ranking'>
                Ranking
              </Button>
              <Button color='inherit' component={Link} href='/dashboard'>
                Dashboard
              </Button>
            </Toolbar>
          </AppBar>
          <Container maxWidth='lg'>{children}</Container>
        </ThemeRegistry>
      </body>
    </html>
  );
}
