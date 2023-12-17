import Citation from '../models/citation';
import WordDatabaseService from '../services/wordDatabaseService';
import { addCitationToView, removeCitationFromView } from '../views/citationView';

class CitationController {
  constructor(citation) {
    this.citation = citation;
  }

  async handleCiteButtonClick(bundle, category) {
    console.log("I'm going to handle the citing of the citation now with category: " + category + " and bundle: " + bundle)
    this.citation = new Citation(null, null, category, bundle);
    console.log(this.citation);

    this.citationcitation = await WordDatabaseService.addCitation(this.citation);
    addCitationToView(this.citation);
  }

  async handleDeleteCitationButton() {
    let id = this.citation.id;
    console.log("I'm going to handle the deleting of the citation now with id: " + id)
    removeCitationFromView(id);
    WordDatabaseService.deleteCitation(id);
  }
}

export default CitationController;
