import {ReducersMapObject} from '@reduxjs/toolkit';
import {SearchPageState} from '../state';
import {queryReducer} from '../features/query/query-slice';
import {configurationReducer} from '../features/configuration/configuration-slice';
import {redirectionReducer} from '../features/redirection/redirection-slice';
import {querySuggestReducer} from '../features/query-suggest/query-suggest-slice';
import {querySetReducer} from '../features/query-set/query-set-slice';
import {searchReducer} from '../features/search/search-slice';
import {paginationReducer} from '../features/pagination/pagination-slice';
import {sortCriteriaReducer} from '../features/sort-criteria/sort-criteria-slice';
import {facetSetReducer} from '../features/facets/facet-set/facet-set-slice';
import {contextReducer} from '../features/context/context-slice';
import {undoable} from './undoable';
import {
  historyReducer,
  getHistoryEmptyState,
} from '../features/history/history-slice';
import {didYouMeanReducer} from '../features/did-you-mean/did-you-mean-slice';
import {facetSearchSetReducer} from '../features/facets/facet-search-set/facet-search-set-slice';
import {fieldsReducer} from '../features/fields/fields-slice';
import {rangeFacetSetReducer} from '../features/facets/range-facet-set/range-facet-set-slice';
import {pipelineReducer} from '../features/pipeline/pipeline-slice';

/**
 * Map of reducers that make up the SearchPageState.
 */
export const searchPageReducers: ReducersMapObject<SearchPageState> = {
  configuration: configurationReducer,
  facetSet: facetSetReducer,
  rangeFacetSet: rangeFacetSetReducer,
  facetSearchSet: facetSearchSetReducer,
  query: queryReducer,
  querySet: querySetReducer,
  pagination: paginationReducer,
  redirection: redirectionReducer,
  querySuggest: querySuggestReducer,
  search: searchReducer,
  sortCriteria: sortCriteriaReducer,
  context: contextReducer,
  history: undoable(historyReducer, getHistoryEmptyState()),
  didYouMean: didYouMeanReducer,
  fields: fieldsReducer,
  pipeline: pipelineReducer,
};
