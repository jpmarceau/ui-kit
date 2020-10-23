import {SearchAppState} from '../../../../state/search-app-state';
import {DateFacetResponse} from './interfaces/response';
import {baseFacetResponseSelector} from '../../facet-set/facet-set-selectors';
import {AnyFacetResponse} from '../../generic/interfaces/generic-facet-response';

function isDateFacetResponse(
  state: SearchAppState,
  response: AnyFacetResponse | undefined
): response is DateFacetResponse {
  return !!response && response.facetId in state.dateFacetSet;
}

export const dataFacetResponseSelector = (
  state: SearchAppState,
  facetId: string
) => {
  const response = baseFacetResponseSelector(state, facetId);
  if (isDateFacetResponse(state, response)) {
    return response;
  }

  return undefined;
};

export const dateFacetSelectedValuesSelector = (
  state: SearchAppState,
  facetId: string
) => {
  const facetResponse = dataFacetResponseSelector(state, facetId);
  if (!facetResponse) {
    return [];
  }
  return facetResponse.values.filter((value) => value.state === 'selected');
};