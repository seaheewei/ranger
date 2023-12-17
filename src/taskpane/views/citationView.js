import CitationController from "../controllers/citationController.js";

export function addCitationToView(citation) {
  console.log("I'm going to add the citation to the view now")
  // create the html element for the citation
  let citationDiv = createCitationHtmlElement(citation);

  // find the bundle + category parent to place the html element in
  let bundleDiv = document.getElementById(citation.bundle);
  let categoryDiv = bundleDiv.querySelector(`.${citation.category}`);
  console.log(categoryDiv)
  let citationsDiv = categoryDiv.querySelector(".citations");

  // sort the citations in CitationsDiv in alphabetical order including the new citation
  let citations = citationsDiv.querySelectorAll(".citation");
  citations = Array.from(citations);
  citations.push(citationDiv);
  citations.sort((a, b) => a.innerHTML.localeCompare(b.innerHTML));
  citationsDiv.innerHTML = "";
  for (let citation of citations) {
    citationsDiv.appendChild(citation);
  }
}

export function createCitationHtmlElement(citation) {
  let citationDiv = document.createElement("div");
  citationDiv.setAttribute("class", "citation");
  citationDiv.setAttribute("id", citation.id);

  let citationText = document.createElement("div");
  citationText.setAttribute("class", "citation-text");
  citationText.innerHTML = citation.text;
  citationDiv.appendChild(citationText);

  // event listener to remove citation button
  let removeCitationButton = document.createElement("button");
  removeCitationButton.setAttribute("class", "remove-citation");
  removeCitationButton.innerHTML = "x";
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
}
