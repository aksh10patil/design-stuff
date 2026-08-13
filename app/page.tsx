import { Container } from "@/public/components/Container";
import { Hero } from "@/public/components/Hero";
import { Navbar } from "@/public/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex h-screen flex-col items-center bg-blue-50">
      <div className="absolute inset-0 w-full [--background-width:308.4%] [background:radial-gradient(var(--background-width)_100%_at_50%_0%,#FFF_6.32%,#E0F0FF_29.28%,#E7EFFD_68.68%,#FFF_100%)] lg:[--background-width:198.96%]">
        <Container>
          <Navbar />
          <Hero />
        </Container>
      </div>
    </div>
  );
}
