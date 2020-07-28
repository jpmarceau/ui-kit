import {SearchPageState} from '../../../state';
import {getQParam, getAdvancedQueries} from '../search-request';
import {FacetRequest} from '../../../features/facets/facet-set/interfaces/request';
import {Context} from '../../../features/context/context-slice';
import {RangeFacetRequest} from '../../../features/facets/range-facet-set/interfaces/request';

export interface SearchRequest {
  q: string;
  numberOfResults: number;
  sortCriteria: string;
  firstResult: number;
  facets: (FacetRequest | RangeFacetRequest)[];
  context: Context;
  enableDidYouMean: boolean;
  pipeline: string;
  aq: string;
  cq: string;
  dq: string;
  lq: string;
}

/** The search request parameters. For a full description, refer to {@link https://docs.coveo.com/en/13/cloud-v2-api-reference/search-api#operation/searchUsingPost}*/
export const searchRequestParams = (state: SearchPageState): SearchRequest => {
  return {
    ...getQParam(state),
    ...getAdvancedQueries(state),
    numberOfResults: state.pagination.numberOfResults,
    sortCriteria: state.sortCriteria,
    firstResult: state.pagination.firstResult,
    facets: getFacets(state),
    context: state.context.contextValues,
    enableDidYouMean: state.didYouMean.enableDidYouMean,
    pipeline: state.pipeline,
  };
};

function getFacets(state: SearchPageState) {
  return [...getFacetRequests(state), ...getRangeFacetRequests(state)];
}

function getFacetRequests(state: SearchPageState) {
  const requests = state.facetSet;
  return Object.keys(requests).map((id) => requests[id]);
}

function getRangeFacetRequests(state: SearchPageState) {
  const requests = state.rangeFacetSet;
  return Object.keys(requests).map((id) => requests[id]);
}
