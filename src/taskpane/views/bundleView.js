import BundleController from "../controllers/bundleController.js";
import { displayWelcomeView } from "./taskPaneView.js";

export function displayAllBundles(bundles) {
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
      console.log(category);

      let categoryDiv = document.createElement("div");
      categoryDiv.setAttribute("class", "category");
      categoryDiv.innerHTML = category.name;
      bundleDiv.appendChild(categoryDiv);

      var citations = category.citations;
      var citationsDiv = document.createElement("div");
      citationsDiv.setAttribute("class", "citations");
      categoryDiv.appendChild(citationsDiv);

      for (let citation of citations) {
        let citationDiv = document.createElement("div");
        citationDiv.setAttribute("class", "citation");
        citationDiv.innerHTML = citation;
        citationsDiv.appendChild(citationDiv);
      }
    }

    // add delete button
    addDeleteButton(bundleDiv, bundle.name);

    document.getElementById("bundles").appendChild(bundleDiv);
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
    categoryDiv.setAttribute("class", "category");
    categoryDiv.innerHTML = category;
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


export function removeBundleView(bundleName) {
  let bundleDiv = document.getElementById(bundleName);
  bundleDiv.remove();
  if (document.getElementById("bundles").children.length === 0) {
    displayWelcomeView();
  }
}
