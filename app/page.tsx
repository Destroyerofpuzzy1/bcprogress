import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Realizacje } from "@/components/Realizacje";
import { CoRobimy } from "@/components/CoRobimy";
import { Zaufanie } from "@/components/Zaufanie";
import { WiekszeInwestycje } from "@/components/WiekszeInwestycje";
import { OFirmie } from "@/components/OFirmie";
import { Opinie } from "@/components/Opinie";
import { Mapa } from "@/components/Mapa";
import { Kontakt } from "@/components/Kontakt";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Zaufanie />
        <Realizacje />
        <CoRobimy />
        <WiekszeInwestycje />
        <OFirmie />
        <Opinie />
        <Mapa />
        <Kontakt />
      </main>
      <Footer />
    </>
  );
}
