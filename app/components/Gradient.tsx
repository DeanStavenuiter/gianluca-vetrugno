import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";


function Gradient() {
  return (
    <ShaderGradientCanvas
      // ShaderGradientCanvas lazy-loads the WebGL canvas with an IntersectionObserver by default.
      // Give it a generous rootMargin so it's already initialized when it scrolls into view,
      // and keep a solid background so there is never a "blank" flash.
      rootMargin="400px 0px 400px 0px"
      threshold={0}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundColor: "#2E4F4F",
      }}
      pixelDensity={1.5}
      fov={40}
    >
      <ShaderGradient
        animate="on"
        brightness={0.8}
        cAzimuthAngle={270}
        cDistance={0.5}
        cPolarAngle={180}
        cameraZoom={15.1}
        color1="#2E4F4F"
        color2="#2E4F4F"
        color3="#2E4F4F"
        envPreset="lobby"
        grain="on"
        lightType="env"
        positionX={-0.1}
        positionY={0}
        positionZ={0}
        reflection={0.2}
        rotationX={0}
        rotationY={130}
        rotationZ={70}
        type="sphere"
        uAmplitude={3.2}
        uDensity={0.8}
        uFrequency={5.5}
        uSpeed={0.3}
        uStrength={0.3}
        uTime={0}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  );
}

export default Gradient;