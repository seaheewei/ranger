import Bundle from "../models/bundle";
import BundleController from "../controllers/bundleController";
import WordDatabaseService from "../services/wordDatabaseService";
import { displayAllBundles } from "./bundleView";
import { addDataChangedHandlers } from "../services/wordDocumentListener";

export async function renderTaskPane() {
  const container = document.getElementById("app-container");

  // await WordDatabaseService.deleteXml();

  WordDatabaseService.initialise().then((bundles) => {
    if (bundles !== null && bundles.length > 0) {
      displayAllBundles(bundles);

      // get a list of the citation ids
      let citations = []
      Array.from(document.getElementsByClassName("citation")).forEach((citation) => {
        citations.push(citation.id)
      })
      addDataChangedHandlers();

    } else { displayWelcomeView() }
  })


  // add event handlers

  document.getElementById("add-BOA").addEventListener("click", () => {
    console.log("add bundle button clicked");
    const bundleName = "Bundle of Authorities";
    const bundleController = new BundleController(new Bundle(bundleName));
    bundleController.handleAddBundleButton();
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
