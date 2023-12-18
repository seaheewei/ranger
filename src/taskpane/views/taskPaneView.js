import Bundle from "../models/bundle";
import BundleController from "../controllers/bundleController";
import WordDatabaseService from "../services/wordDatabaseService";
import { displayAllBundles } from "./bundleView";
import { addDataChangedHandlers } from "../services/wordDocumentListener";
import { addFootnotes, deleteFootnotes } from "../services/wordDocumentManipulator";

export async function renderTaskPane() {
  const container = document.getElementById("app-container");

  // await WordDatabaseService.deleteXml();

  WordDatabaseService.initialise().then((bundles) => {
    if (bundles !== null && bundles.length > 0) {
      displayAllBundles(bundles);
      addDataChangedHandlers();
    } else { displayWelcomeView() }
  })


  // add event handlers to the various buttons

  document.addEventListener("click", (event) => {
    if (event.target.id == "add-BOA") {
      console.log("add bundle button clicked");
      const bundleName = "Bundle of Authorities";
      const bundleController = new BundleController(new Bundle(bundleName));
      bundleController.handleAddBundleButton();
    } else if (event.target.id == "update-all") {
      WordDatabaseService.updateAllCitations();
    } else if (event.target.id == "add-footnotes") {
      addFootnotes();
      // hide add footnotes button, show delete footnotes button
      document.getElementById("add-footnotes").classList.add("hidden");
      document.getElementById("delete-footnotes").classList.remove("hidden");
    } else if (event.target.id == "delete-footnotes") {
      deleteFootnotes();
      // hide delete footnotes button, show add footnotes button
      document.getElementById("delete-footnotes").classList.add("hidden");
      document.getElementById("add-footnotes").classList.remove("hidden");
    }
  })

  // document.getElementById("add-BOA").addEventListener("click", () => {
  //   console.log("add bundle button clicked");
  //   const bundleName = "Bundle of Authorities";
  //   const bundleController = new BundleController(new Bundle(bundleName));
  //   bundleController.handleAddBundleButton();
  // })


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
