import Hero from "./components/Hero";
import Intro from "./components/Intro";

export default function Home() {
  return (
    <div className="min-h-[400vh]">
      <Hero />
      <Intro />
    </div>
  );
}
