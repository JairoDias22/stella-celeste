import Background from "@/components/layout/Background";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Background />
      <Navbar />
      <Hero />
    </main>
  );
}