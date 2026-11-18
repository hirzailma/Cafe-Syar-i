import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import NewsSection from "@/components/NewsSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f1] text-[#352f2b]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Services />
        <NewsSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
