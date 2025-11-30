import Hero from "./components/Hero";
import Intro from "./components/Intro";
import Services from "./components/Services";
import Articles from "./components/Articles";
import Outro from "./components/Outro";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <Intro />
      <Services />
      <Articles />
      <Outro />
    </div>
  );
}
