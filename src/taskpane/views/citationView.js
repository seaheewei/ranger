export function addCitationToView(citation) {

  // create the html element for the citation
  let citationDiv = document.createElement("div");
  citationDiv.setAttribute("class", "citation");
  citationDiv.setAttribute("id", citation.id);
  citationDiv.innerHTML = citation.text;

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
