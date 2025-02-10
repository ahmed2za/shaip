import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import theme from '@/theme/theme';
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect } from 'react';
import Head from 'next/head';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { appWithTranslation } from 'next-i18next';
import '@/styles/globals.css';

// Create rtl cache
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// Configure NProgress
NProgress.configure({ 
  minimum: 0.3,
  easing: 'ease',
  speed: 300,
  showSpinner: false,
  trickleSpeed: 200
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // Remove the server-side injected CSS
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    const handleStart = () => {
      NProgress.start();
    };

    const handleComplete = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // تعطيل التحقق مؤقتاً
  // useEffect(() => {
  //   if (!localStorage.getItem('authToken')) {
  //     router.push('/login')
  //   }
  // }, [])

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <CacheProvider value={cacheRtl}>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
              <style>{`
                #nprogress .bar {
                  background: #2563eb !important;
                  height: 3px !important;
                }
              `}</style>
            </Head>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AuthProvider>
                <Toaster
                  position="top-center"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                      direction: 'rtl',
                    },
                  }}
                />
                {router.pathname.startsWith('/admin') ? (
                  <Component {...pageProps} />
                ) : (
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                )}
              </AuthProvider>
            </ThemeProvider>
          </CacheProvider>
        </QueryClientProvider>
      </SessionProvider>
    </GoogleOAuthProvider>
  );
}

export default appWithTranslation(MyApp);
