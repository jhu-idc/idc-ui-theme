import { Facet, FacetValue } from '../models/facet';

export function parseFacet(facet: {}) {
  const objkeys = Object.keys(facet);

  if (objkeys.length === 0) {
    throw new Error(`No facet field found. ${facet}`);
  }

  // Check the shape of this "facet" data to see if it's empty
  if (facet.hasOwnProperty('#attributes') && facet['#attributes'].class.includes('facet-empty')) {
    return parseEmptyFacet(facet);
  }

  const key: string = objkeys[0];
  const items: FacetValue[] = facet[key].map((data) => ({
    key,
    value: data.values.value,
    count: data.values.count,
    url: data.url,
  }));

  return new Facet(key, items, false);
}

/**
 * This construct is Drupal returning info for rendering an HTML element
 * and indicates a facet with no results that should be hidden in the UI
 *
 * {
    "0": [],
    "#type": "container",
    "#attributes": {
      "data-drupal-facet-id": "facet_access_rights",
      "class": [ "facet-empty", "facet-hidden" ]
    }
  }
 *
 * @param facet raw facet JSON of an empty facet
 */
export function parseEmptyFacet(facet: {}) {
  return new Facet(facet['#attributes']['data-drupal-facet-id'], [], true, facet);
}

/**
 * Test two FacetValue objects to see if they are "equal".
 * In this case, equality is determined by `key`, `value`, and `count`. URL will depend on the
 * URL of the host page that in which this is executing, so does not contribute
 *
 * @param f1 first item to test
 * @param f2 second item to test
 */
export function facetValueEquals(f1: FacetValue, f2: FacetValue): boolean {
  if (!f1 || !f2) return false;
  return f1.key === f2.key && f1.value === f2.value && f1.count === f2.count;
}

/**
 * Check to see if a given facet is already in an array
 *
 * @param facet facet to check for
 * @param array array to check in
 */
export function facetValueIncludes(facet: FacetValue, array: FacetValue[]): boolean {
  return !!array.find((el) => facetValueEquals(el, facet));
}

/**
 * Remove the given item from ths list. Does not modify the original array
 *
 * @param item facet value to remove
 * @param selectedFacets original list of selected facets
 * @returns a new array of facet values with the given item removed
 */
export function removeSelectedItem(item: FacetValue, selectedFacets: FacetValue[]): FacetValue[] {
  return selectedFacets.filter((value) => !facetValueEquals(value, item));
}
