import Particles from "./Animation/Particles.js";
import Builder from "./Builder/Builder.js";

document.addEventListener("DOMContentLoaded", async () => {
    
    const BackGround = new Particles(document.getElementById("particles"));
    const builder = await Builder.load();

    builder.build();
    BackGround.animate();
});
