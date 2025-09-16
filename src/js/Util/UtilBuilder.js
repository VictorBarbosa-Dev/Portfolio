export default class UtilBuilder {
        
    constructor(config) {
        this.config = config;
    }

    initThemeController() {

        const themeController = document.querySelector("#theme-controller");

        if (themeController.checked) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }

        themeController.addEventListener("click", function () {

            if (this.checked) {
                document.body.classList.add("dark-mode");
            } else {
                document.body.classList.remove("dark-mode");
            }
        });
    }
    
    buildNavBar() {
        
    }
    
    buildSections() {
        
    }
    
    _buildSectionBegin() {
        
    }
    
    _buildSectionAbout() {
        
    }
    
    _buildSectionProjects() {
        
    }
    
    _buildSectionStacks() {
        
    }
}