import Hero from "./components/Hero";
import Intro from "./components/Intro";
import Services from "./components/Services";
import Articles from "./components/Articles";
import Outro from "./components/Outro";
import Navigation from "./components/Navigation";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div>
      <Navigation />
      <div data-section="intro">
        <Hero />
      </div>
      <div data-section="about">
        <Intro />
      </div>
      <div data-section="services">
        <Services />
      </div>
      <div data-section="articles">
        <Articles />
        <Outro />
      </div>
      <div data-section="contact">
        <Contact />
      </div>
      <Footer />
    </div>
  );
}
