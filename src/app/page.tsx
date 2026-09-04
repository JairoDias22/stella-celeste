import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import WeeklySlots from "@/components/sections/WeeklySlots";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";
import { prisma } from "@/lib/prisma";
import { getClienteAtual } from "@/lib/actions/minha-conta";

export default async function Home() {
  const [servicos, cliente] = await Promise.all([
    prisma.servico.findMany({
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, price: true },
    }),
    getClienteAtual(),
  ]);

  return (
    <>
      <Navbar servicos={servicos} cliente={cliente} />
      <Hero />
      <About />
      <Services />
      <WeeklySlots />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
    </>
  );
}