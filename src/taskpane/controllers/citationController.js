import Citation from '../models/citation';
import WordDatabaseService from '../services/wordDatabaseService';

class CitationController {
  constructor(citation) {
    this.citation = citation;
  }

  handleCiteButtonClick(category, bundle) {
    console.log("I'm going to handle the citing of the citation now with category: " + category + " and bundle: " + bundle)
    this.citation = new Citation(null, category, bundle);
    console.log(this.citation);
    WordDatabaseService.addCitation(this.citation);
  }
}

export default CitationController;
