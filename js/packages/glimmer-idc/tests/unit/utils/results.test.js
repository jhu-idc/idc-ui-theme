import { module, test } from '../../util';

import { ResultsService, ITEM_TYPES } from '../../../src/utils/results'

module('Results service tests', () => {
  test('Can run tests', (assert) => {
    const service = new ResultsService(ITEM_TYPES.NONE);
    assert.ok(service);
  });

  /**
   * Our raw queries may include user input search terms, a node filter, and/or
   * a node type filter. Initialization should pick out the user input terms
   * and ignore the other parts
   */
  test('#initFromUrl grabs params', (assert) => {
    const service = new ResultsService(ITEM_TYPES.COLLECTIONS);
    const queryParams = 'query=This is a moo AND (ss_type:collection_object AND itm_field_member_of:33)&sort_order=ASC&sort_by=title&page=1&items_per_page=5';
    const url = `https://example.com?${queryParams}`;

    service.initFromUrl(url);

    assert.equal(service.searchTerms, 'This is a moo');
    assert.equal(service.sortBy, '&sort_by=title');
    assert.equal(service.sortOrder, '&sort_order=ASC');
    assert.equal(service.pager.current_page, 1);
    assert.equal(service.pager.items_per_page, 5);
  });

  test('#initFromUrl can select facets', (assert) => {
    const service = new ResultsService(ITEM_TYPES.COLLECTIONS);
    const params = 'f[0]=subject:Moo';

    service.initFromUrl(`https://example.com?${params}`);

    assert.equal(service.selectedFacets.length, 1);

    const facet = service.selectedFacets[0];
    assert.ok(facet, 'Selected facet is null or undefined somehow');
    assert.equal(facet.frag, 'subject:Moo');
  });

  test('#initFromUrl can select URL encoded facets', (assert) => {
    const service = new ResultsService(ITEM_TYPES.COLLECTIONS);
    const params = 'f%5B0%5D%3Dsubject%3AMoo';

    service.initFromUrl(`https://exapmle.com?${params}`);

    assert.equal(service.selectedFacets.length, 1);

    const facet = service.selectedFacets[0];
    assert.ok(facet, 'Selected facet is null or undefined');
    assert.equal(facet.frag, 'subject:Moo');
  });
});
