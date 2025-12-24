import Hero from "./components/Hero";
import Intro from "./components/Intro";
import Services from "./components/Services";
import Articles from "./components/Articles";
import About from "./components/About";
// import Navigation from "./components/Navigation";
// import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BridgeLine from "./components/BridgeLine";
import Outro from "./components/Outro";
import Services2 from "./components/Services2";
import ImageGallery from "./components/ImageGallery";

export default function Home() {
  return (
    <div>
      {/* <Navigation /> */}
      <Hero />
      <div data-section="intro">
        <Intro />
        <BridgeLine />
      </div>
      <div data-section="services">
        <Services2 />
      </div>
      <div data-section="about">
        <About />
      </div>
      <div data-section="articles">
        <Articles />
      </div>
      <ImageGallery />
      <Outro />
      <Footer />
    </div>
  );
}
