import UtilBuilder from "../Util/UtilBuilder.js";

export default class Builder {
    
        constructor(config) {
        this.config = config;
    }

    static async load() {
        try {
            const response = await fetch('./src/js/Builder/config.json');
            const config = await response.json();
            
            return new Builder(config);
        } catch (err) {
            console.error(err);
            return new Builder({});
        }
    }

    build() {
        
        const utilBuilder = new UtilBuilder(this.config);
                
        utilBuilder.buildNavBar();
        utilBuilder.buildContentSections();
        utilBuilder.initThemeController();
    }
}
