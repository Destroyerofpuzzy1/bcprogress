import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Realizacje } from "@/components/Realizacje";
import { CoRobimy } from "@/components/CoRobimy";
import { Interlude } from "@/components/Interlude";
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
        <Realizacje />
        <CoRobimy />
        <Interlude />
        <OFirmie />
        <Opinie />
        <Mapa />
        <Kontakt />
      </main>
      <Footer />
    </>
  );
}
