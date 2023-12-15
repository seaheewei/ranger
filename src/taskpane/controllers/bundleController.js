import Bundle from "../models/bundle";
import WordDatabaseService from "../services/wordDatabaseService";
import { updateBundleViewWithNewBundle, removeBundleView } from "../views/bundleView";
import { removeWelcomeView } from "../views/taskPaneView";

class BundleController {
  constructor(bundle) {
    this.bundle = bundle;
  }

  async handleAddBundleButton(name) {
    this.bundle = new Bundle(name);
    // console.log("I'm going to handle the creating a new bundle now with name: " + name)
    // WordApiService.xmlItUp()
    // console.log("from the bundlecontroller ", xmlId)
    // WordApiService.thenGetTheXml();
    removeWelcomeView();
    WordDatabaseService.addBundle(this.bundle);
    updateBundleViewWithNewBundle(this.bundle)
  }

  async handleDeleteBundleButton(name) {
    console.log("I'm going to handle the deleting of the bundle now with name: " + name)
    WordDatabaseService.deleteBundle(name);
    removeBundleView(name);
  }
}

export default BundleController;
