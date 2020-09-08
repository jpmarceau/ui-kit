import {createAction, createAsyncThunk} from '@reduxjs/toolkit';
import {FacetSearchResponse} from '../../../../api/search/facet-search/facet-search-response';
import {SearchAPIClient} from '../../../../api/search/search-api-client';
import {SearchPageState} from '../../../../state';
import {logFacetSearch} from '../../facet-set/facet-set-analytics-actions';
import {SpecificFacetSearchResult} from '../../../../api/search/facet-search/specific-facet-search/specific-facet-search-response';
import {FacetSearchOptions} from '../facet-search-request-options';

type selectFacetSearchResultPayload = {
  facetId: string;
  value: SpecificFacetSearchResult;
};

/**
 * Register a facet search in the facet search set.
 * @param {FacetSearchOptions} FacetSearchOptions The options to register the facet search with.
 */
export const registerFacetSearch = createAction<FacetSearchOptions>(
  'facetSearch/register'
);

/**
 * Updates the options of a facet search.
 * @param {FacetSearchOptions} FacetSearchOptions The options to register the facet search with.
 */
export const updateFacetSearch = createAction<FacetSearchOptions>(
  'facetSearch/update'
);

/**
 * Executes a facet search.
 * @param {string} facetId The facet id on which to execute the search.
 */
export const executeFacetSearch = createAsyncThunk<
  {facetId: string; response: FacetSearchResponse},
  string,
  {
    extra: {
      searchAPIClient: SearchAPIClient;
    };
  }
>(
  'facetSearch/executeSearch',
  async (facetId: string, {dispatch, getState, extra: {searchAPIClient}}) => {
    const state = getState() as SearchPageState;
    const response = await searchAPIClient.facetSearch(facetId, state);
    dispatch(logFacetSearch(facetId));

    return {facetId, response};
  }
);

/**
 * Adds a facet search value to the facet.
 * @param {selectFacetSearchResultPayload}.
 */
export const selectFacetSearchResult = createAction<
  selectFacetSearchResultPayload
>('facetSearch/toggleSelectValue');
