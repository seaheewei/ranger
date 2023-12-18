import Citation from '../models/citation';
import WordDatabaseService from '../services/wordDatabaseService';
import { addCitationToView, removeCitationFromView } from '../views/citationView';

class CitationController {
  constructor(citation) {
    this.citation = citation;
  }

  async handleCiteButtonClick(bundle, category) {
    // console.log("I'm going to handle the citing of the citation now with category: " + category + " and bundle: " + bundle)
    this.citation = new Citation(null, null, category, bundle, null);
    // console.log(this.citation);

    this.citation = await WordDatabaseService.addCitation(this.citation);
    addCitationToView(this.citation);
    WordDatabaseService.saveCitationToXml(this.citation);
  }

  handleDeleteCitationButton() {
    let id = this.citation.id;
    // console.log("I'm going to handle the deleting of the citation now with id: " + id)
    removeCitationFromView(id);
    WordDatabaseService.deleteCitation(id);
    WordDatabaseService.removeCitationFromXml(id);
  }

  async handleNavigateToCitationButton() {
    // console.log("I'm going to handle the navigating to the citation now with id: " + this.citation.id)
    // if remove button was clicked, return
    if (event.target.className === "remove-citation") { return }
    WordDatabaseService.selectCitation(this.citation.id);
  }
}

export default CitationController;
