export default class UtilBuilder {

    constructor(config) {
        this.config = config;
        this.images = "./src/images/";
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

        console.log(themeController);
        return themeController;
    }

    buildContentSections() {

        Object.keys(this.config.sections).forEach(section => {

            switch (section) {
                case "begin":
                    this._buildSectionBegin();
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

    }

    _buildSectionProjects() {

    }

    _buildSectionStacks() {

    }

    _buildSectionContacts() {

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