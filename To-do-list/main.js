class List {
  constructor() {
    this.list = document.querySelector("#complete-list");
    this.textInput = document.querySelector("#text-input");
    this.submitButton = document.querySelector("#submit-button");
    this.reinitializeButton = document.querySelector("#reinitialize-button");
    this.paragraphs = [];
  }

  // GETTERS (avec returns implicites)

  getList = () => this.list;

  getTextInput = () => this.textInput;

  getSubmitButton = () => this.submitButton;

  getReinitializeButton = () => this.reinitializeButton;

  getParagraphs = () => this.paragraphs;

  // AUTRES FONCTIONS

  start = () => {
    this.createItem();

    // On découpe le tableau des cookies

    let splitCookies = document.cookie.split(";");

    // On l'envoie dans la fonction qui permet de restaurer la liste en fonction du tableau des cookies
    this.clearList(splitCookies);
    this.restoreItems(splitCookies);
    this.crossOldItems();
  };

  createItem = () => {
    this.getSubmitButton().addEventListener("click", () => {
      // On stocke un list item, le texte rentré dans le text input et un paragraphe dans des variables

      let listItem = document.createElement("li");

      let text = this.getTextInput().value;

      let p = document.createElement("p");

      if (text) {
        /*Si le text input est rempli, on met un list item à la list, dans lequel on met un paragraphe.
      On fait que le contenu textuel du paragraphe devienne le texte rentré dans le text input */
        let completeItem = this.getList().appendChild(listItem).appendChild(p);

        completeItem.textContent = text;

        // On remplit le tableau des paragraphes avec le paragraphe qui est rentré par l'utilisateur

        this.getParagraphs().push(completeItem);

        /* On crée un tableau avec les strings des paragraphes, qu'on envoie à la méthode storeList, ainsi que le paragraphe courant, pour le stocker dans les cookies */

        this.storeList();
        this.crossNewItems(completeItem);
      }
    });
  };

  crossOldItems = () => {
    // Fonction pour barrer au clic les items tirés des cookies

    let listParagraphs = document.querySelectorAll("#complete-list p");

    listParagraphs.forEach(paragraph => {
      paragraph.addEventListener("click", () => {
        // Au clic, si le paragraphe n'est pas barré, on le barre. Si oui on enlève la barre
        if (paragraph.style.textDecorationLine != "line-through") {
          paragraph.style.textDecorationLine = "line-through";
        } else {
          paragraph.style.textDecorationLine = "none";
        }
      });
    });
  };

  crossNewItems = paragraph => {
    // Fonction pour barrer au clic les nouveaux items rentrés par l'utilisateur

    paragraph.addEventListener("click", () => {
      // Au clic, si le paragraphe n'est pas barré, on le barre. Si oui on enlève la barre
      if (paragraph.style.textDecorationLine != "line-through") {
        paragraph.style.textDecorationLine = "line-through";
      } else {
        paragraph.style.textDecorationLine = "none";
      }
    });
  };

  storeList = () => {
    const cookiesExpirationDate = "Fri, 31 Dec 9999 23:59:59 GMT;";

    let splitCookies = document.cookie.split(";");

    /*    Pour chaque paragraphe dans le tableau on crée un cookie qui contient son texte

    Son index dans le tableau devient son nom, et sa valeur devient le texte du paragraphe 
    
    S'il n'y a pas de cookie on met direct le nom 0 au premier cookie. Quand il y a déjà des cookies, on met la longueur du tableau des cookies comme nom
    
    */

    this.getParagraphs().map(currentParagraph => {
      if (document.cookie === "") {
        document.cookie = `0 = ${currentParagraph.textContent}; samesite=Lax; Expires=${cookiesExpirationDate}`;
      } else {
        document.cookie =
          `${splitCookies.length} = ${currentParagraph.textContent}; samesite=Lax` +
          document.cookie +
          `; Expires=${cookiesExpirationDate}`;
      }
    });
  };

  clearList = splitCookies => {
    // Le clear ne marche pas du premier coup sur les cookies
    this.getReinitializeButton().addEventListener("click", () => {
      // En cliquant sur Réinitialiser, on efface le texte rentré dans l'input

      this.getTextInput().value = null;

      // On fait aussi disparaître ce qu'il y a dans la liste
      this.getList().textContent = null;

      // On vide le tableau dans lequel on stocke les paragraphes
      this.paragraphs = [];
      // On itère sur le tableau des cookies, à chaque cookie on met une date d'expiration dans le passé, ce qui supprime le cookie

      for (let index = 0; index < splitCookies.length; index++) {
        document.cookie =
          splitCookies[index] + `; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
      }
    });
  };

  restoreItems = splitCookies => {
    // S'il y a des cookies enregistrés, on les envoie dans les list items de la liste

    if (document.cookie !== "") {
      for (let index = 0; index < splitCookies.length; index++) {
        let listItem = document.createElement("li");

        let p = document.createElement("p");

        if (index === 0) {
          p.textContent = splitCookies[index].slice(
            2,
            splitCookies[index].length
          );
        } else {
          p.textContent = splitCookies[index].slice(
            3,
            splitCookies[index].length
          );
        }

        this.getList().appendChild(listItem).appendChild(p);
      }
    }
  };

  deleteCookie = cookieName => {
    document.cookie = cookieName + "=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  };
}

let newList = new List();

newList.start();
