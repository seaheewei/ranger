import CitationController from "../controllers/citationController.js";

class CitationView {
  constructor(citation) {
    this.citation = citation;
  }

  static addCitationToView(citation) {
    console.log("I'm going to add the citation to the view now")
    // create the html element for the citation
    let citationDiv = this.createCitationHtmlElement(citation);

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

  static createCitationHtmlElement(citation) {
    let citationDiv = document.createElement("div");
    citationDiv.setAttribute("class", "citation");
    citationDiv.setAttribute("id", citation.id);

    let citationText = document.createElement("div");
    citationText.setAttribute("class", "citation-text");
    citationText.innerHTML = citation.text;
    citationDiv.appendChild(citationText);

    let removeCitationButton = document.createElement("button");
    removeCitationButton.setAttribute("class", "remove-citation");
    removeCitationButton.innerHTML = "x";
    removeCitationButton.addEventListener("click", () => {
      CitationController.deleteCitation(citation.id);
    })
    citationDiv.appendChild(removeCitationButton);

    return citationDiv
  }
}

export default CitationView;
