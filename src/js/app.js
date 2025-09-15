import Particles from "./Animation/Particles.js";
import UtilBuilder from "./Util/UtilBuilder.js";

document.addEventListener("DOMContentLoaded", () => {

    const BackGround = new Particles(document.getElementById("particles"));
    const Builder = new UtilBuilder();
    
//    Builder.build();
    Builder.initThemeController();
    BackGround.animate();
});
