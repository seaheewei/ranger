import BundleController from "../controllers/bundleController.js";
import CitationController from "../controllers/citationController.js";
import { displayWelcomeView } from "./taskPaneView.js";
import { createCitationHtmlElement, updateTabs } from "./citationView.js";


export async function displayAllBundles(bundles) {
  document.getElementById("bundles").innerHTML = "";
  for (let bundle of bundles) {
    // create bundle div
    let bundleDiv = document.createElement("div");
    bundleDiv.setAttribute("class", "bundle");
    bundleDiv.setAttribute("id", bundle.name);
    bundleDiv.innerHTML = `<div class="bundle-title">${bundle.name}<div>`;

    // include categories and citations
    var categories = bundle.categories;
    for (let category of categories) {
      // console.log(category);

      let categoryDiv = document.createElement("div");
      categoryDiv.setAttribute("class", "category " + category.name);

      let categoryHeaderDiv = document.createElement("div");
      categoryHeaderDiv.setAttribute("class", "category-header");

      let categoryNameDiv = document.createElement("div");
      categoryNameDiv.setAttribute("class", "category-name");
      categoryNameDiv.innerHTML = category.name;
      categoryHeaderDiv.appendChild(categoryNameDiv);
      categoryDiv.appendChild(categoryHeaderDiv);
      addCiteButton(categoryHeaderDiv, category.name, bundle.name)

      bundleDiv.appendChild(categoryDiv);

      var citationsDiv = document.createElement("div");
      citationsDiv.setAttribute("class", "citations");
      categoryDiv.appendChild(citationsDiv);

      var citations = category.citations;
      // console.log(citations)

      for (let citation of citations) {
        let citationDiv = createCitationHtmlElement(citation);
        citationsDiv.appendChild(citationDiv);
      }
    }

    // add delete button
    addDeleteButton(bundleDiv, bundle.name);

    document.getElementById("bundles").appendChild(bundleDiv);
    updateTabs();
  }
}

export function updateBundleViewWithNewBundle(bundle) {
  let bundlesDiv = document.getElementById("bundles");
  let bundleDiv = document.createElement("div");
  bundleDiv.setAttribute("class", "bundle");
  bundleDiv.setAttribute("id", bundle.name);
  bundleDiv.innerHTML = `<div class="bundle-title">${bundle.name}<div>`;

  let categories = ["Cases", "Statutes", "Subsidiary legislation", "Secondary materials", "Other materials"]

  for (let category of categories) {
    let categoryDiv = document.createElement("div");
    categoryDiv.setAttribute("class", "category " + category);

    let categoryHeaderDiv = document.createElement("div");
    categoryHeaderDiv.setAttribute("class", "category-header");

    let categoryNameDiv = document.createElement("div");
    categoryNameDiv.setAttribute("class", "category-name");
    categoryNameDiv.innerHTML = category;
    categoryHeaderDiv.appendChild(categoryNameDiv);
    categoryDiv.appendChild(categoryHeaderDiv);
    addCiteButton(categoryHeaderDiv, category, bundle.name)

    bundleDiv.appendChild(categoryDiv);

    let citationsDiv = document.createElement("div");
    citationsDiv.setAttribute("class", "citations");
    categoryDiv.appendChild(citationsDiv);
  }

  addDeleteButton(bundleDiv, bundle.name);

  bundlesDiv.appendChild(bundleDiv);
}

function addDeleteButton(bundleDiv, name) {
  let button = document.createElement("button");
  button.setAttribute("class", "delete-bundle");
  button.setAttribute("id", name);
  button.innerHTML = "Delete";

  button.addEventListener("click", () => {
    console.log("delete bundle button clicked");
    const bundleController = new BundleController();
    bundleController.handleDeleteBundleButton(name);
  })
  bundleDiv.appendChild(button);
}

function addCiteButton(categoryDiv, category, bundle) {
  let button = document.createElement("button");
  button.setAttribute("class", "cite-button");
  button.setAttribute("id", category);
  button.innerHTML = "Cite";

  button.addEventListener("click", () => {
    console.log("cite button clicked");
    const citationController = new CitationController();
    citationController.handleCiteButtonClick(bundle, category);
  })
  categoryDiv.appendChild(button);
}

export function removeBundleView(bundleName) {
  let bundleDiv = document.getElementById(bundleName);
  bundleDiv.remove();
  if (document.getElementById("bundles").children.length === 0) {
    displayWelcomeView();
  }
}
