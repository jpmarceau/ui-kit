import {
  BaseFacetSearchRequest,
  FacetSearchType,
} from '../base/base-facet-search-request';
import {SearchPageState} from '../../../../state';
import {searchRequest} from '../../search/search-request';

export interface SpecificFacetSearchRequest
  extends BaseFacetSearchRequest,
    FacetSearchType<'specific'> {
  ignoreValues: string[];
}

export const buildSpecificFacetSearchRequest = (
  id: string,
  state: SearchPageState
): SpecificFacetSearchRequest => {
  const {captions, query, numberOfValues} = state.facetSearchSet[id].options;
  const {field, delimitingCharacter, currentValues} = state.facetSet[id];
  const searchContext = searchRequest(state);
  const ignoreValues = currentValues
    .filter((v) => v.state !== 'idle')
    .map((facetValue) => facetValue.value);

  return {
    captions,
    numberOfValues,
    query,
    field,
    delimitingCharacter,
    ignoreValues,
    searchContext,
    type: 'specific',
  };
};
