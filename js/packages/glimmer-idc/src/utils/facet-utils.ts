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

/**
 * Get labels for facet fields from Drupal's JSONAPI. These field keys are used as
 * json property keys in the facet response
 *
 * Example of a facet field: field_access_rights
 *
 * TODO: terrible hack because Drupal is pain to deal with
 *
 * @param keys list of field keys that need labels
 * @returns Map of field keys -> label
 */
function getFieldLabels(keys: string[]): Map<string, string> {
  let result = new Map<string, string>();
  const regex = /_/g;

  keys.forEach((str: string) => result.set(str, str.replace(regex, ' ')));

  return result;
}

/**
 * Notes for getting labels
 *
 * Facet values can be dereferenced to human readable labels. This configuration can is set
 * for each facet. You can either let the facets return entity IDs, or the "system" can
 * resolve labels for entity IDs. Returning the entity IDs makes it easy to generate search
 * queries, whereas returning labels makes it much easier to render to a user.
 *
 * If you get entity IDs, how do you get labels from Drupal?
 * ??
 * It _may_ be possible to query various taxonomies and stuff using the Drupal JSONAPI, however,
 * there may not be an easy way to determine the JSON API request...
 *
 * If you get the labels, how do you get the proper search query?
 * Some horrible URL parsing to pull off the appended facet query parameter from the facet
 * value URL :(
 *
 * There is the extra of how to present the facet fields to the user. Each facet category
 * comes from a Drupal field on a data model. So far I haven't found a way to externally
 * query Drupal for these labels. May need to do some garbage in PHP :(
 */

/**
 *
 * @param url url target returned with the facet data
 * @returns {string}
 */
function getFacetQueryFragment(url: string): string {
  return '';
}
