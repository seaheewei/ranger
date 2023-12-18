import WordDatabaseService from "./wordDatabaseService";

export async function addFootnotes() {
  const allTabs = document.querySelectorAll(".tab");
  let orderedCitations = [];
  for (let tab of allTabs) {
    orderedCitations.push({
      tabNo: Number(tab.innerText),
      citationId: Number(tab.parentNode.id)
    });
  }
  await Word.run(async (context) => {
    const contentControls = context.document.contentControls;
    contentControls.load("items");
    await context.sync();
    // iterate by index
    for (let i = 0; i < orderedCitations.length; i++) {
      let citation = orderedCitations[i];
      let contentControl = contentControls.getById(citation.citationId);

      let footnote = contentControl.getRange("After").insertFootnote(`\tBundle of Authorities at Tab ${citation.tabNo}.`);
      let footnoteContentControl = footnote.reference.insertContentControl();
      footnoteContentControl.load();
      await context.sync()
      footnoteContentControl.set({
        tag: "ranger-footnote",
        appearance: Word.ContentControlAppearance.hidden,
        removeWhenEdited: true,
        placeholderText: "",
      })
    }

  })
}

export async function deleteFootnotes() {
  await Word.run(async (context) => {
    const contentControls = context.document.contentControls;
    contentControls.load("items");
    await context.sync();
    for (let contentControl of contentControls.items) {
      if (contentControl.tag === "ranger-footnote") {
        contentControl.delete(false);
      }
    }
  })
}
