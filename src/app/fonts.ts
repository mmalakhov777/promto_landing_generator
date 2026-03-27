import localFont from 'next/font/local';

export const onest = localFont({
  src: [
    {
      path: './fonts/onest-cyrillic-ext.woff2',
      style: 'normal',
      weight: '100 900',
    },
    {
      path: './fonts/onest-cyrillic.woff2',
      style: 'normal',
      weight: '100 900',
    },
    {
      path: './fonts/onest-latin-ext.woff2',
      style: 'normal',
      weight: '100 900',
    },
    {
      path: './fonts/onest-latin.woff2',
      style: 'normal',
      weight: '100 900',
    },
  ],
  display: 'swap',
  variable: '--font-onest',
  fallback: ['system-ui', 'arial'],
});
