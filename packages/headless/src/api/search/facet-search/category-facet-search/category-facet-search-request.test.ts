import {createMockState} from '../../../../test/mock-state';
import {buildCategoryFacetSearchRequest} from './category-facet-search-request';
import {SearchPageState} from '../../../../state';
import {buildMockSearchRequest} from '../../../../test/mock-search-request';
import {buildMockCategoryFacetRequest} from '../../../../test/mock-category-facet-request';
import {buildMockCategoryFacetSearch} from '../../../../test/mock-category-facet-search';

describe('#buildCategoryFacetSearchRequest', () => {
  const id = '1';
  let state: SearchPageState;

  function setupState() {
    state = createMockState();
    state.categoryFacetSet[id] = buildMockCategoryFacetRequest();
    state.categoryFacetSearchSet[id] = buildMockCategoryFacetSearch();
  }

  function buildParms() {
    return buildCategoryFacetSearchRequest(id, state);
  }

  beforeEach(() => setupState());

  it('retrieves the #captions from the categoryFacetSearchSet', () => {
    const captions = {a: 'A'};
    state.categoryFacetSearchSet[id].options.captions = captions;

    expect(buildParms().captions).toEqual(captions);
  });

  it('retrieves the #numberOfValues from the categoryFacetSearchSet', () => {
    const numberOfValues = 5;
    state.categoryFacetSearchSet[id].options.numberOfValues = numberOfValues;

    expect(buildParms().numberOfValues).toEqual(numberOfValues);
  });

  it('retrieves the #query from the categoryFacetSearchSet', () => {
    const query = 'hello';
    state.categoryFacetSearchSet[id].options.query = query;

    expect(buildParms().query).toEqual(query);
  });

  it('retrieves the #basePath fron the categoryFacetSet', () => {
    const basePath = ['a'];
    state.categoryFacetSet[id].basePath = basePath;

    expect(buildParms().basePath).toBe(basePath);
  });

  it('retrieves the #field from the categoryFacetSet', () => {
    const field = 'author';
    state.categoryFacetSet[id].field = field;

    expect(buildParms().field).toBe(field);
  });

  it('retrieves the #delimitingCharacter from the categoryFacetSet', () => {
    const char = '|';
    state.categoryFacetSet[id].delimitingCharacter = char;

    expect(buildParms().delimitingCharacter).toBe(char);
  });

  it('builds the #ignorePaths from the category facet', () => {
    state.categoryFacetSet[id].currentValues = [];
    expect(buildParms().ignorePaths).toEqual([]);
  });

  it('sets the #searchContext to the search request params', () => {
    const facet = state.categoryFacetSet[id];
    const request = buildMockSearchRequest({facets: [facet]});

    expect(buildParms().searchContext).toEqual(request);
  });
});
