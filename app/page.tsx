import Hero from "./components/Hero";
import Intro from "./components/Intro";
import Services from "./components/Services";

export default function Home() {
  return (
    <div className="min-h-[400vh]">
      <Hero />
      <Intro />
      <Services />
    </div>
  );
}
