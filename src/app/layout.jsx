import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8">{children}</body>
    </html>
  );
}
