import Citation from '../models/citation';
import WordDatabaseService from '../services/wordDatabaseService';
import CitationView from '../views/citationView';

class CitationController {
  constructor(citation) {
    this.citation = citation;
  }

  async handleCiteButtonClick(bundle, category) {
    console.log("I'm going to handle the citing of the citation now with category: " + category + " and bundle: " + bundle)
    this.citation = new Citation(null, null, category, bundle);
    console.log(this.citation);

    this.citationcitation = await WordDatabaseService.addCitation(this.citation);
    console.log(this.citation);
    CitationView.addCitationToView(this.citation);
  }

  async handleDeleteCitationButton(id) {
    console.log("I'm going to handle the deleting of the citation now with id: " + id)
    WordDatabaseService.deleteCitation(id);
    CitationView.removeCitationView(id);
  }
}

export default CitationController;
