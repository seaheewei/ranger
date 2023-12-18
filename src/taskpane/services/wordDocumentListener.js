import WordDatabaseService from "./wordDatabaseService";
import { updateTabs } from "../views/citationView";

export async function addDataChangedHandlers() {
  await Word.run(async (context) => {
    const contentControls = context.document.contentControls;
    contentControls.load("items");
    await context.sync();

    // Register the onDataChanged event handler on each content control.
    if (contentControls.items.length === 0) {
      console.log("There aren't any content controls in this document so can't register event handlers.");
    } else {
      contentControls.items.forEach((contentControl) => {
        contentControl.onDataChanged.add(contentControlDataChanged);
        contentControl.onDeleted.add(contentControlDeleted);
        contentControl.track();
      });
      await context.sync();
      // console.log("Added event handlers for when data is changed in content controls.");
    }
  });
}

async function contentControlDataChanged(event) {
  await Word.run(async (context) => {
    // console.log(`${event.eventType} event detected. IDs of content controls where data was changed:`);
    // console.log(event.ids)
    event.ids.forEach((id) => {
      updateCitation(id)
    })
  });
}

async function contentControlDeleted(event) {
  await Word.run(async (context) => {
    // console.log(`${event.eventType} event detected. IDs of content controls that were deleted:`);
    // console.log(event.ids)
    event.ids.forEach((id) => {
      let citationDiv = document.getElementById(id)
      console.log(citationDiv)
      if (citationDiv !== null) {
        console.log("or here?")
        citationDiv.parentNode.removeChild(citationDiv)
        updateTabs()
        const citation = context.document.contentControls.getById(Number(id))
        citation.untrack()
        citation.delete(false)
        WordDatabaseService.removeCitationFromXml(id)
      }
    })
  });
}

async function updateCitation(citationId) {
  await Word.run(async (context) => {
    const citation = context.document.contentControls.getById(Number(citationId))
    citation.load("text")
    await context.sync();
    if (citation.text === "") {
      let citationDiv = document.getElementById(citationId)
      citationDiv.parentNode.removeChild(citationDiv)
      updateTabs();
      WordDatabaseService.deleteCitation(citationId)
      WordDatabaseService.removeCitationFromXml(citationId)
    } else {
      console.log(citation.text)
      let citationDiv = document.getElementById(citationId)
      let citationTextDiv = citationDiv.getElementsByClassName("citation-text")[0]
      citationTextDiv.innerHTML = citation.text
    }
  })
}
