import CitationController from "../controllers/citationController.js";
import { addDataChangedHandlers } from "../services/wordDocumentListener.js";

export function addCitationToView(citation) {
  console.log("I'm going to add the citation to the view now")
  // create the html element for the citation
  let citationDiv = createCitationHtmlElement(citation);

  // find the bundle + category parent to place the html element in
  let bundleDiv = document.getElementById(citation.bundle);
  console.log(citation.category)
  let categoryDiv = bundleDiv.querySelector(`.${citation.category}`);
  console.log(categoryDiv)
  let citationsDiv = categoryDiv.querySelector(".citations");

  // sort the citations in CitationsDiv in alphabetical order including the new citation
  let citations = citationsDiv.querySelectorAll(".citation");
  citations = Array.from(citations);
  citations.push(citationDiv);

  // sort citations by the citation-text element
  citations.sort((a, b) => {
    let aText = a.querySelector(".citation-text").innerHTML;
    let bText = b.querySelector(".citation-text").innerHTML;
    return aText.localeCompare(bText);
  });
  citationsDiv.innerHTML = "";
  for (let citation of citations) {
    citationsDiv.appendChild(citation);
  }
  addDataChangedHandlers();
  updateTabs();
}

export function updateTabs() {
  console.log("I'm going to update the tabs now")
  let tabs = document.querySelectorAll(".tab");
  tabs = Array.from(tabs);
  tabs.forEach((tab, index) => {
    tab.innerHTML = index + 1;
  })
}

export function createCitationHtmlElement(citation) {
  let citationDiv = document.createElement("div");
  citationDiv.setAttribute("class", "citation");
  citationDiv.setAttribute("id", citation.id);

  // create tab
  let tab = document.createElement("div");
  tab.setAttribute("class", "tab");
  citationDiv.appendChild(tab);

  let citationText = document.createElement("div");
  citationText.setAttribute("class", "citation-text");
  citationText.innerHTML = citation.text;
  citationDiv.appendChild(citationText);

  // create remove citation button and add event listener
  // let removeCitationButton = document.createElement("button");
  // create icon for remove citation button
  let removeCitationButton = document.createElement("i");
  removeCitationButton.setAttribute("class", "ms-Icon ms-Icon--Cancel remove-citation");
  removeCitationButton.addEventListener("click", () => {
    let citationController = new CitationController(citation);
    citationController.handleDeleteCitationButton();
  })
  citationDiv.appendChild(removeCitationButton);

  // event listener to navigate to citation in word doc
  citationDiv.addEventListener("click", () => {
    let citationController = new CitationController(citation);
    citationController.handleNavigateToCitationButton();
  })

  return citationDiv
}

export function removeCitationFromView(id) {
  console.log("I'm going to remove the citation from the view now with id: " + id)
  let citationDiv = document.getElementById(id);
  citationDiv.parentNode.removeChild(citationDiv);
  updateTabs();
}
