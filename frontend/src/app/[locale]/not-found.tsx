import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-text">
        Данная страница не существует!
      </h1>
      <p className="mt-4 text-lg text-text-muted">
        Страница, которую вы ищете, была удалена или никогда не существовала.
      </p>
      <Link
        href="/ru/"
        className="mt-8 rounded-xl bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}
