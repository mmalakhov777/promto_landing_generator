import { Header } from '@/components/sections/header';
import { Footer } from '@/components/sections/footer';
import { BackgroundBlobs } from '@/components/ui/background-blobs';

export const metadata = {
  title: 'Страница не найдена',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="relative overflow-x-clip min-h-dvh flex flex-col">
      <BackgroundBlobs />
      <div className="noise-overlay" aria-hidden="true" />
      <Header />
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-[600px] text-center">
          <h1 className="text-2xl lg:text-4xl font-bold text-text-primary mb-6">
            Данная страница не существует!
          </h1>
          <p className="text-base text-text-secondary">
            Вы можете{' '}
            <a href="/" className="text-brand-blue hover:underline transition-colors">
              перейти на главную страницу сайта
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
