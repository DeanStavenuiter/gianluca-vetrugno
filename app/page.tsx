import Hero from "./components/Hero";
import Intro from "./components/Intro";
import Services from "./components/Services";
import Articles from "./components/Articles";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <Intro />
      <Services />
      <Articles />
    </div>
  );
}
