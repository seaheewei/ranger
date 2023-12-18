import { addCitationToView } from "../views/citationView"
import { deleteFootnotes, addFootnotes } from "./wordDocumentManipulator"

class WordDatabaseService {

  static async initialise() {
    // initialise an xml if there isn't one in context.documents.settings, else load it into js objects and return it
    var objects = await Word.run(async (context) => {
      var xml = await this.loadXml()

      if (xml === null) {
        const customXml = `<ranger><bundles></bundles><deleted></deleted></ranger>`
        const customXmlPart = context.document.customXmlParts.add(customXml);
        customXmlPart.load("id");
        await context.sync();

        const settings = context.document.settings;
        settings.add("ranger", customXmlPart.id);
        return null
      } else {
        // flush the deleted section of the xml
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xml, "text/xml");
        let deleted = xmlDoc.getElementsByTagName("deleted")[0]
        deleted.innerHTML = ""
        this.updateXml(xmlDoc)

        return this.parseXmlIntoObjects(xml)
      }
    })
    return objects
  }

  static async updateAllCitations() {
    // get all content controls with the tag ranger
    await Word.run(async (content) => {
      var contentControls = content.document.contentControls.getByTag("ranger");
      contentControls.load();
      await content.sync();
      // console.log(contentControls.items)
      // if they are not in the add-in, update the add in view to add them and add them to the xml too
      for (let contentControl of contentControls.items) {
        let citationId = contentControl.id
        let citationDiv = document.getElementById(citationId)
        if (citationDiv === null) {
          // check if its a deleted citation based on the xml
          let deleted = await this.loadXml()
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(deleted, "text/xml");
          // console.log(xmlDoc)
          let deletedCitations = xmlDoc.getElementsByTagName("deleted")[0]
          // console.log(citationId)
          let deletedCitation = deletedCitations.querySelector(`[id="${citationId}"]`)
          // console.log(deletedCitation)
          if (deletedCitation !== null) {
            // create the citation again and add it to the add-in view
            let citation = {}
            citation.id = citationId
            citation.text = contentControl.text
            citation.bundle = deletedCitation.getAttribute("bundle")
            citation.category = deletedCitation.getAttribute("category")
            this.saveCitationToXml(citation)
            addCitationToView(citation)
            // remove the deleted citation from the xml
            deletedCitation.parentNode.removeChild(deletedCitation)
            this.updateXml(xmlDoc)
          }
        }
      }
    })
  }

  static async parseXmlIntoObjects(xml) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");
    let bundles = xmlDoc.getElementsByTagName("bundles")[0]
    let bundleObjects = []
    // console.log(bundles)
    // console.log(bundles.children)
    for (let bundle of bundles.children) {
      let bundleObject = {}
      bundleObject.name = bundle.getAttribute("name")
      bundleObject.categories = []
      for (let category of bundle.children) {
        let categoryObject = {}
        categoryObject.name = category.getAttribute("name")
        categoryObject.citations = []
        let citationIds = []
        for (let citation of category.children) {
          let citationId = citation.getAttribute("id")
          citationIds.push(citationId)
          // categoryObject.citations.push(citation.getAttribute("id"))
        }
        let citations = await this.getCitations(citationIds)
        categoryObject.citations = citations
        bundleObject.categories.push(categoryObject)
      }
      bundleObjects.push(bundleObject)
    }
    console.log(bundleObjects)
    return bundleObjects
  }

  static async addBundle(bundle) {
    let xml = await this.loadXml()
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");
    let bundles = xmlDoc.getElementsByTagName("bundles")[0]

    var newBundle = xmlDoc.createElement("bundle")
    newBundle.setAttribute("name", bundle.name)

    // add categories "cases" and "statutes" under bundle
    var categories = ["Cases", "Statutes", "SubsidiaryLegislation", "SecondaryMaterials", "OtherMaterials"]

    for (let category of categories) {
      var newCategory = xmlDoc.createElement("category")
      newCategory.setAttribute("name", category)
      newBundle.appendChild(newCategory)
    }

    bundles.appendChild(newBundle)

    this.updateXml(xmlDoc)
  }

  static async deleteBundle(name) {
    let xml = await this.loadXml()
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");
    let bundle = xmlDoc.getElementsByName(name)[0]

    // remove all citations in the bundle
    let citations = bundle.querySelectorAll("citation")
    citations.forEach(citation => {
      this.deleteCitation(citation.getAttribute("id"))
    })

    // remove the bundle from the xml
    bundle.parentNode.removeChild(bundle)

    this.updateXml(xmlDoc)
  }

  static async addCitation(citation) {
    // create a content control based on the selection with an automatically generated citation id
     await Word.run(async (context) => {
      var range = context.document.getSelection();
      var contentControl = range.insertContentControl();
      contentControl.tag = "ranger"
      contentControl.track();
      contentControl.load();
      await context.sync();

      citation.text = contentControl.text
      citation.id = contentControl.id
    });

    return citation
  }

  static async saveCitationToXml(citation) {
    // update the xml with the new citation
    let xml = await this.loadXml()
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");
    let bundleDiv = xmlDoc.getElementsByName(citation.bundle)[0]
    let category = bundleDiv.querySelector(`[name=${citation.category}]`)

    var newCitation = xmlDoc.createElement("citation")
    newCitation.setAttribute("id", citation.id)
    category.appendChild(newCitation)

    this.updateXml(xmlDoc)
  }

  static async deleteCitation(id) {
    // console.log(id)
    // delete the content control with the id
    await Word.run(async (context) => {
      var citation = context.document.contentControls.getById(Number(id));
      citation.load("text");
      await context.sync();
      if (citation.text === "") {citation.delete(false)} else {citation.delete(true)}
      citation.untrack();
      await context.sync();
      // console.log("success!")
    })
  }

  static async removeCitationFromXml(id) {

    // remove all footnotes & re-update
    const addFootnotesButton = document.getElementById("add-footnotes")
    if (addFootnotesButton.classList.contains("hidden")) {
      deleteFootnotes();
      addFootnotes();
    }

    // remove citation from xml

    let xml = await this.loadXml()
    // console.log(xml)
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml, "text/xml");
    let citation = xmlDoc.getElementById(id)

    // add id to the deleted section
    let deleted = xmlDoc.getElementsByTagName("deleted")[0]
    let deletedCitation = xmlDoc.createElement("citation")
    deletedCitation.setAttribute("id", id)
    deletedCitation.setAttribute("category", citation.parentNode.getAttribute("name"))
    deletedCitation.setAttribute("bundle", citation.parentNode.parentNode.getAttribute("name"))
    deleted.appendChild(deletedCitation)

    citation.parentNode.removeChild(citation)

    this.updateXml(xmlDoc)
  }

  static async getCitation(id) {
    await Word.run(async (context) => {
      var contentControl = context.document.contentControls.getById(Number(id));
      contentControl.load();
      await context.sync();

      return contentControl
    })
  }

  static async getCitations(ids) {
    let citations = []
    await Word.run(async (context) => {
      ids.forEach(id => {
        var contentControl = context.document.contentControls.getById(Number(id));
        contentControl.load();
        citations.push(contentControl)
      })
      await context.sync();
      // console.log(citations)
    })
    return citations
  }

  static async selectCitation(id) {
    await Word.run(async (context) => {
      var contentControl = context.document.contentControls.getById(Number(id));
      contentControl.select();
    })
  }

  static async updateXml(xmlDoc) {
    await Word.run(async (context) => {
      const settings = context.document.settings;
      const xmlPartId = settings.getItem("ranger");
      xmlPartId.load("value");
      await context.sync();

      const xmlPart = context.document.customXmlParts.getItem(xmlPartId.value);
      await context.sync();

      var serializer = new XMLSerializer();
      var updatedXml = serializer.serializeToString(xmlDoc);

      xmlPart.setXml(updatedXml);
      context.sync();
    })
  }


  static async loadXml() {
    const xmlBlob = await Word.run(async (context) => {
      const settings = context.document.settings;
      const xmlPartId = settings.getItemOrNullObject("ranger");

      xmlPartId.load();
      await context.sync();

      if (xmlPartId.isNullObject) {return null}

      try {
        const xmlPart = context.document.customXmlParts.getItem(xmlPartId.value);
        await context.sync();
        const xmlBlob = xmlPart.getXml();
        await context.sync()
        // console.log(xmlBlob)
        return xmlBlob.value } catch { return null }
    })
    return xmlBlob
  }

  static async deleteXml() {
    await Word.run(async (context) => {
      const settings = context.document.settings;
      const xmlPartIDSetting = settings.getItemOrNullObject("ranger");
      xmlPartIDSetting.load("value");
      await context.sync();

      if (!xmlPartIDSetting.isNullObject && xmlPartIDSetting.value) {
        let customXmlPart = context.document.customXmlParts.getItemOrNullObject(xmlPartIDSetting.value);
        customXmlPart.load();
        await context.sync();

        if (!customXmlPart.isNullObject) {
          // Delete the associated setting too.
          xmlPartIDSetting.delete();
          await context.sync();

          customXmlPart.delete();
          await context.sync();

          // console.log(`The XML part with the ID ${xmlPartIDSetting.value} has been deleted`);
        }
      } else {
          console.warn("Didn't find custom XML part to delete");
      }
    }).catch(error => {
        console.error("Error in deleteXml:", error);
    });
  }

}

export default WordDatabaseService;



// static async xmlItUp() {
//   const customXml = `
//     <bundles>
//       <bundle name="Bundle1">
//           <category name="Category1">
//               <citation id="CC1" />
//               <citation id="CC2" />
//           </category>
//           <category name="Category2">
//               <citation id="CC3" />
//           </category>
//       </bundle>
//       <bundle name="Bundle2">
//           <category name="Category1">
//               <citation id="CC4" />
//           </category>
//           <category name="Category3">
//               <citation id="CC5" />
//           </category>
//       </bundle>
//     </bundles>
//     `

//   // Link to full sample: https://raw.githubusercontent.com/OfficeDev/office-js-snippets/prod/samples/word/50-document/manage-custom-xml-part.yaml
//   // Adds a custom XML part.
//   await Word.run(async (context) => {
//     const customXmlPart = context.document.customXmlParts.add(customXml);
//     customXmlPart.load("id");
//     const xmlBlob = customXmlPart.getXml();

//     await context.sync();

//     const readableXml = addLineBreaksToXML(xmlBlob.value);
//     console.log("Added custom XML part:");
//     console.log(readableXml);

//     // Store the XML part's ID in a setting so the ID is available to other functions.
//     const settings = context.document.settings;
//     settings.add("ContosoReviewXmlPartId", customXmlPart.id);

//     await context.sync();
//   });
// }
