export default class UtilBuilder {

    constructor(config) {
        this.config = config;
        this.images = "../images/";
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

        let navBar = document.createElement("div");
        navBar.classList.add("nav-bar");

        navBar.appendChild(this._buildOpenPage());
        navBar.appendChild(this._buildHeaderSections());
        navBar.appendChild(this._buildThemeController());

        document.querySelector(".content").appendChild(navBar);
    }

    _buildOpenPage() {

        let openPage = document.createElement("div");
        openPage.classList.add("open-page");

        let h2 = document.createElement("h2");
        h2.textContent = "<Victor>";

        openPage.appendChild(h2);

        return openPage;
    }

    _buildHeaderSections() {

        let headerSections = document.createElement("div");
        headerSections.classList.add("header-sections");

        Object.keys(this.config.sections).forEach(section => {

            let a = document.createElement("a");
            a.href = '#' + section;

            let button = document.createElement("button");
            button.classList.add('section-button');
            button.textContent = this.config.sections[section].title;

            a.appendChild(button);
            headerSections.appendChild(a);
        });

        return headerSections;
    }

    _buildThemeController() {

        let themeController = document.createElement("input");
        themeController.id = "theme-controller";
        themeController.type = "checkbox";
        themeController.checked = true;
        themeController.classList.add("theme-checkbox");

        return themeController;
    }

    buildContentSections() {

        Object.keys(this.config.sections).forEach(section => {

            switch (section) {
                case "begin":
                    this._buildSectionBegin();
                    break;

                case "about":
                    this._buildSectionAbout();
                    break;

                case "projects":
                    this._buildSectionProjects();
                    break;
                    
                case "stacks":
                    this._buildSectionStacks();
                    break;
            }
        });

        this._buildFooter();
    }

    _buildSectionBegin() {

        let section = document.createElement("section");
        section.id = "begin";

        let div = document.createElement("div");
        div.classList.add("begin-card");

        let a = document.createElement("a");
        a.href = this.config.sections.begin.href;

        let hero = document.createElement("div");
        hero.classList.add("hero");

        a.appendChild(hero);
        div.appendChild(a);

        let p = document.createElement("p");
        p.textContent = this.config.sections.begin.legend;

        div.appendChild(p);
        section.appendChild(div);

        document.querySelector(".content").appendChild(section);
    }

    _buildSectionAbout() {

        let section = document.createElement("section");
        section.id = "about";

        let div = document.createElement("div");
        div.classList.add("about-card");

        let open = document.createElement("h2");
        let p = document.createElement("p");
        let close = document.createElement("h2");

        open.textContent = "<" + this.config.sections.about.title + ">";
        p.innerHTML = this.config.sections.about.about;
        close.textContent = "</" + this.config.sections.about.title + ">";

        div.appendChild(open);
        div.appendChild(p);
        div.appendChild(close);

        section.appendChild(div);
        document.querySelector(".content").appendChild(section);
    }

    _buildSectionProjects() {

        let section = document.createElement("section");
        section.id = "projects";

        let div = document.createElement("div");
        div.classList.add("projects-card");

        let open = document.createElement("h2");
        let projects = document.createElement("div");
        let close = document.createElement("h2");
        
        open.textContent = "<" + this.config.sections.projects.title + ">";
        close.textContent = "</" + this.config.sections.projects.title + ">";

        projects.classList.add("projects");

        this.config.sections.projects.projects.forEach(project => {

            let card = document.createElement("div");
            let cardImage = document.createElement("div");
            let cardDescription = document.createElement("div");

            card.classList.add("card");
            cardImage.classList.add("card-image");
            cardDescription.classList.add("card-description");

            const path = "url(" + this.images + project.image + ")";
            cardImage.style.setProperty("--image", path);

            let description = document.createElement("div");
            description.classList.add("description");

            let p = document.createElement("p");
            p.innerHTML = project.description;

            let viewMethods = document.createElement("div");
            viewMethods.classList.add("view-methods");

            Object.entries(project.viewMethods).forEach(([viewMethod, url]) => {
                
                let a = document.createElement("a");
                a.classList.add("view-method");
                a.href = url;
                
                let icon = document.createElement("span");
                icon.classList.add(viewMethod.toLowerCase());
                
                let nameMethod = document.createElement("span");
                nameMethod.textContent = viewMethod;
                
                a.appendChild(icon);
                a.appendChild(nameMethod);
                
                viewMethods.appendChild(a);
            });
            
            description.appendChild(p);
            description.appendChild(viewMethods);
            cardDescription.appendChild(description);
            
            card.appendChild(cardImage);
            card.appendChild(cardDescription);
            
            projects.appendChild(card);
        });
        
        div.appendChild(open);
        div.appendChild(projects);
        div.appendChild(close);
        
        section.appendChild(div);
        document.querySelector(".content").appendChild(section);
    }

    _buildSectionStacks() {
        
        let section = document.createElement("section");
        section.id = "stacks";
        
        let card = document.createElement("div");
        card.classList.add("stacks-card");
        
        let open = document.createElement("h2");
        let stacks = document.createElement("div");
        let close = document.createElement("h2");
        
        open.textContent = "<" + this.config.sections.stacks.title + ">";
        stacks.classList.add("stacks");
        
        this.config.sections.stacks.stacks.forEach(stack => {
            
            let stackIcon = document.createElement("span");
            stackIcon.classList.add("stack");
            
            const path = "url(" + this.images + stack + ".png)";
            
            stackIcon.style.setProperty("--image", path);
            
            stacks.appendChild(stackIcon);
        })
                
        close.textContent = "</" + this.config.sections.stacks.title + ">";
        
        card.appendChild(open);
        card.appendChild(stacks);
        card.appendChild(close);
        
        section.appendChild(card);
        document.querySelector(".content").appendChild(section);
    }

    _buildFooter() {

        let footer = document.createElement("div");
        footer.classList.add("footer");

        let closePage = document.createElement("div");
        closePage.classList.add("close-page");

        let h2 = document.createElement("h2");
        h2.textContent = "</Victor>";

        closePage.appendChild(h2);
        footer.appendChild(closePage);

        document.querySelector(".content").appendChild(footer);
    }
}