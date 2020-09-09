import {SearchParametersState} from '../../search-parameters-state';
import {createReducer} from '@reduxjs/toolkit';
import {getContextInitialState, ContextState} from '../context/context-slice';
import {
  getFacetSetInitialState,
  FacetSetState,
} from '../facets/facet-set/facet-set-slice';
import {getQueryInitialState} from '../query/query-slice';
import {getSortCriteriaInitialState} from '../sort-criteria/sort-criteria-slice';
import {getQuerySetInitialState} from '../query-set/query-set-slice';
import {
  PaginationState,
  getPaginationInitialState,
} from '../pagination/pagination-slice';
import {ConstantQueryState, QueryState} from '../../state';
import {SortState} from '../../controllers/sort/headless-sort';
import {snapshot} from './history-actions';
import {getPipelineInitialState} from '../pipeline/pipeline-slice';
import {
  getDateFacetSetInitialState,
  DateFacetSetState,
} from '../facets/range-facets/date-facet-set/date-facet-set-slice';
import {
  getNumericFacetSetInitialState,
  NumericFacetSetState,
} from '../facets/range-facets/numeric-facet-set/numeric-facet-set-slice';
import {getSearchHubInitialState} from '../search-hub/search-hub-slice';
import {
  getCategoryFacetSetInitialState,
  CategoryFacetSetState,
} from '../facets/category-facet-set/category-facet-set-slice';
import {getInitialConstantQueryState} from '../constant-query/constant-query-slice';

export const getHistoryEmptyState = (): SearchParametersState => ({
  context: getContextInitialState(),
  facetSet: getFacetSetInitialState(),
  dateFacetSet: getDateFacetSetInitialState(),
  numericFacetSet: getNumericFacetSetInitialState(),
  categoryFacetSet: getCategoryFacetSetInitialState(),
  pagination: getPaginationInitialState(),
  query: getQueryInitialState(),
  constantQuery: getInitialConstantQueryState(),
  sortCriteria: getSortCriteriaInitialState(),
  querySet: getQuerySetInitialState(),
  pipeline: getPipelineInitialState(),
  searchHub: getSearchHubInitialState(),
});

export const historyReducer = createReducer(
  getHistoryEmptyState(),
  (builder) => {
    builder.addCase(snapshot, (state, action) =>
      isEqual(state, action.payload) ? undefined : action.payload
    );
  }
);

const isEqual = (
  current: SearchParametersState,
  next: SearchParametersState
) => {
  return (
    isContextEqual(current.context, next.context) &&
    isConstantQueryEqual(current.constantQuery, next.constantQuery) &&
    isFacetsEqual(current.facetSet, next.facetSet) &&
    isDateFacetsEqual(current.dateFacetSet, next.dateFacetSet) &&
    isNumericFacetsEqual(current.numericFacetSet, next.numericFacetSet) &&
    isCategoryFacetsEqual(current.categoryFacetSet, next.categoryFacetSet) &&
    isPaginationEqual(current.pagination, next.pagination) &&
    isQueryEqual(current.query, next.query) &&
    isSortEqual(current, next) &&
    isPipelineEqual(current.pipeline, next.pipeline) &&
    isSearchHubEqual(current.searchHub, next.searchHub)
  );
};

const isContextEqual = (current: ContextState, next: ContextState) =>
  JSON.stringify(current.contextValues) === JSON.stringify(next.contextValues);

const isFacetsEqual = (current: FacetSetState, next: FacetSetState) =>
  JSON.stringify(current) === JSON.stringify(next);

const isDateFacetsEqual = (
  current: DateFacetSetState,
  next: DateFacetSetState
) => JSON.stringify(current) === JSON.stringify(next);

const isNumericFacetsEqual = (
  current: NumericFacetSetState,
  next: NumericFacetSetState
) => JSON.stringify(current) === JSON.stringify(next);

const isCategoryFacetsEqual = (
  current: CategoryFacetSetState,
  next: CategoryFacetSetState
) => JSON.stringify(current) === JSON.stringify(next);

const isPaginationEqual = (current: PaginationState, next: PaginationState) =>
  current.firstResult === next.firstResult &&
  current.numberOfResults === next.numberOfResults;

const isQueryEqual = (current: QueryState, next: QueryState) =>
  current.q === next.q;

const isSortEqual = (current: SortState, next: SortState) =>
  current.sortCriteria === next.sortCriteria;

const isPipelineEqual = (current: string, next: string) => current === next;

const isSearchHubEqual = (current: string, next: string) => current === next;

const isConstantQueryEqual = (
  current: ConstantQueryState,
  next: ConstantQueryState
) => current.cq === next.cq;
