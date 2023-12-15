import BundleController from "../controllers/bundleController";
import WordDatabaseService from "../services/wordDatabaseService";
import { displayAllBundles } from "./bundleView";

export async function renderTaskPane() {
  const container = document.getElementById("app-container");

  // await WordDatabaseService.deleteXml();

  WordDatabaseService.initialise().then((bundles) => {
    if (bundles !== null && bundles.length > 0) {
      displayAllBundles(bundles);
    } else { displayWelcomeView() }
  })


  document.getElementById("add-BOA").addEventListener("click", () => {
    console.log("add bundle button clicked");
    const bundleName = "Bundle of Authorities";
    const bundleController = new BundleController();
    bundleController.handleAddBundleButton(bundleName);
  })

  // document.getElementById("add-BOD").addEventListener("click", () => {
  //   console.log("add bundle button clicked");
  //   const bundleName = "Bundle of Documents";
  //   const bundleController = new BundleController();
  //   bundleController.handleAddBundleButton(bundleName);
  // })
}

export function removeWelcomeView() {
  let welcomeDiv = document.getElementById("welcome-add-bundles");
  welcomeDiv.style.display = "none";
}

export function displayWelcomeView() {
  let welcomeDiv = document.getElementById("welcome-add-bundles");
  // remove display none from welcomediv
  welcomeDiv.style.display = "block";
}
