import Header from "@/app/(main)/header";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6">
        {children}
      </main>
    </>
  );
}
