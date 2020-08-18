import {
  FacetSearchOptions,
  registerFacetSearch,
  updateFacetSearch,
  executeFacetSearch,
} from './facet-search-actions';
import {
  FacetSearchSetState,
  facetSearchSetReducer,
  getFacetSearchSetInitialState,
  buildFacetSearchState,
  buildFacetSearchOptions,
} from './facet-search-set-slice';
import {buildMockFacetSearchResponse} from '../../../test/mock-facet-search-response';
import {buildMockFacetSearchResult} from '../../../test/mock-facet-search-result';

describe('FacetSearch slice', () => {
  let state: FacetSearchSetState;

  beforeEach(() => {
    state = getFacetSearchSetInitialState();
  });

  it('initializes the state correctly', () => {
    const finalState = facetSearchSetReducer(undefined, {type: ''});
    expect(finalState).toEqual({});
  });

  it('registers a facet search with the passed id and options', () => {
    const facetId = '1';
    const options: FacetSearchOptions = {facetId};

    const finalState = facetSearchSetReducer(
      state,
      registerFacetSearch(options)
    );
    expect(finalState[facetId].options).toEqual({
      facetId,
      captions: {},
      currentPage: 1,
      pageSize: 10,
      query: '',
    });
  });

  it('registering a facet search with an id that already exists does not overwrite the existing facet', () => {
    const facetId = '1';
    state[facetId] = buildFacetSearchState();

    const options = buildFacetSearchOptions({pageSize: 5});
    const finalState = facetSearchSetReducer(
      state,
      registerFacetSearch({facetId, ...options})
    );

    expect(finalState[facetId].options).not.toEqual(options);
  });

  it('when passing an id that is registered, #updateFacetSearch updates the options', () => {
    const facetId = '1';
    state[facetId] = buildFacetSearchState();

    const options = buildFacetSearchOptions();
    const finalState = facetSearchSetReducer(
      state,
      updateFacetSearch({facetId, ...options})
    );

    expect(finalState[facetId].options).toEqual(options);
  });

  it('when passing an id that is not registered, #updateFacetSearch does not register the options', () => {
    const facetId = '1';
    const options = buildFacetSearchOptions();
    const finalState = facetSearchSetReducer(
      state,
      updateFacetSearch({facetId, ...options})
    );

    expect(finalState[facetId]).toBe(undefined);
  });

  it('on #executeFacetSearch.fulfilled with a registered id, it updates the facetSearch response', () => {
    const facetId = '1';
    state[facetId] = buildFacetSearchState();

    const values = [buildMockFacetSearchResult()];
    const response = buildMockFacetSearchResponse({values});
    const action = executeFacetSearch.fulfilled({facetId, response}, '', '');

    const finalState = facetSearchSetReducer(state, action);
    expect(finalState[facetId].response).toEqual(response);
  });

  it('on #executeFacetSearch.fulfilled with an unregistered id, it does nothing', () => {
    const facetId = '1';
    const response = buildMockFacetSearchResponse();
    const action = executeFacetSearch.fulfilled({facetId, response}, '', '');

    const finalState = facetSearchSetReducer(state, action);
    expect(finalState[facetId]).toBe(undefined);
  });
});
