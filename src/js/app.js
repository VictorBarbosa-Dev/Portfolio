import Particles from "./Animation/Particles.js";

document.addEventListener("DOMContentLoaded", () => {

    const BackGround = new Particles(document.getElementById("particles"));
    BackGround.animate();
});
