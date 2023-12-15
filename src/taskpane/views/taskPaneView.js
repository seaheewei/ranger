import BundleController from "../controllers/bundleController";
import WordDatabaseService from "../services/wordDatabaseService";

export async function renderTaskPane() {
  const container = document.getElementById("app-container");

  // await WordDatabaseService.deleteXml();

  WordDatabaseService.initialise().then((bundles) => {
    if (bundles !== null) {
      // removeWelcomeView();
      document.getElementById("bundles").innerHTML = "";
      for (let bundle of bundles) {
        let bundleDiv = document.createElement("div");
        bundleDiv.setAttribute("class", "bundle");
        bundleDiv.setAttribute("id", bundle.name);
        bundleDiv.innerHTML = bundle.name;

        // include categories and citations
        var categories = bundle.categories;
        for (let category of categories) {
          console.log(category);
          let categoryDiv = document.createElement("div");
          categoryDiv.setAttribute("class", "category");
          categoryDiv.innerHTML = category.name;
          bundleDiv.appendChild(categoryDiv);
          var citations = category.citations;
          for (let citation of citations) {
            let citationDiv = document.createElement("div");
            citationDiv.setAttribute("class", "citation");
            citationDiv.innerHTML = citation;
            categoryDiv.appendChild(citationDiv);
          }
        }
        document.getElementById("bundles").appendChild(bundleDiv);
      }
    }
  })


  document.getElementById("add-BOA").addEventListener("click", () => {
    console.log("add bundle button clicked");
    const bundleName = "Bundle of Authorities";
    const bundleController = new BundleController();
    bundleController.handleAddBundleButton(bundleName);
  })

  document.getElementById("add-BOD").addEventListener("click", () => {
    console.log("add bundle button clicked");
    const bundleName = "Bundle of Documents";
    const bundleController = new BundleController();
    bundleController.handleAddBundleButton(bundleName);
  })
}

export function removeWelcomeView() {
  let welcomeDiv = document.getElementById("welcome-add-bundles");
  welcomeDiv.style.display = "none";
}
