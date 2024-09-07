import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        Home Page
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Footer
      </footer>
    </div>
  );
}
