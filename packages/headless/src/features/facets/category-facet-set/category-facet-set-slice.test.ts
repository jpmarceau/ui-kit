import {
  CategoryFacetSetState,
  getCategoryFacetSetInitialState,
  categoryFacetSetReducer,
} from './category-facet-set-slice';
import {CategoryFacetRegistrationOptions} from './interfaces/options';
import {
  registerCategoryFacet,
  toggleSelectCategoryFacetValue,
} from './category-facet-set-actions';
import {buildMockCategoryFacetRequest} from '../../../test/mock-category-facet-request';
import {getHistoryEmptyState} from '../../history/history-slice';
import {change} from '../../history/history-actions';
import {buildMockCategoryFacetValue} from '../../../test/mock-category-facet-value';
import {buildMockCategoryFacetValueRequest} from '../../../test/mock-category-facet-value-request';

describe('category facet slice', () => {
  const facetId = '1';
  let state: CategoryFacetSetState;

  beforeEach(() => {
    state = getCategoryFacetSetInitialState();
  });

  it('initializes the set to an empty object', () => {
    const finalState = categoryFacetSetReducer(undefined, {type: ''});
    expect(finalState).toEqual({});
  });

  it('#registerCategoryFacet with an unregistered id adds a category facet with correct defaults', () => {
    const options: CategoryFacetRegistrationOptions = {
      facetId,
      field: '',
    };

    const finalState = categoryFacetSetReducer(
      state,
      registerCategoryFacet(options)
    );

    expect(finalState[facetId]).toEqual({
      ...options,
      currentValues: [],
      filterFacetCount: false,
      injectionDepth: 1000,
      numberOfValues: 5,
      preventAutoSelect: false,
      sortCriteria: 'occurrences',
      delimitingCharacter: '|',
      type: 'hierarchical',
      basePath: [],
      filterByBasePath: true,
    });
  });

  it('#registerCategoryFacet with a registered id does not overwrite a category facet', () => {
    const options: CategoryFacetRegistrationOptions = {
      facetId,
      field: 'b',
    };

    state[facetId] = buildMockCategoryFacetRequest({facetId, field: 'a'});
    const finalState = categoryFacetSetReducer(
      state,
      registerCategoryFacet(options)
    );
    expect(finalState[facetId].field).toBe('a');
  });

  it('it restores the categoryFacetSet on history change', () => {
    const categoryFacetSet = {'1': buildMockCategoryFacetRequest()};
    const payload = {
      ...getHistoryEmptyState(),
      categoryFacetSet,
    };

    const finalState = categoryFacetSetReducer(
      state,
      change.fulfilled(payload, '')
    );

    expect(finalState).toEqual(categoryFacetSet);
  });

  describe('#toggleSelectCategoryFacetValue', () => {
    it('when the passed id is not registered, it does not throw', () => {
      const selection = buildMockCategoryFacetValue({value: 'A'});
      const action = toggleSelectCategoryFacetValue({facetId, selection});

      expect(() => categoryFacetSetReducer(state, action)).not.toThrow();
    });

    describe('when currentValues is empty', () => {
      beforeEach(() => {
        state[facetId] = buildMockCategoryFacetRequest({
          currentValues: [],
          numberOfValues: 5,
        });
      });

      it('builds a request from the selection and adds it to currentValues', () => {
        const selection = buildMockCategoryFacetValue({
          value: 'A',
          path: ['A'],
        });
        const action = toggleSelectCategoryFacetValue({facetId, selection});
        const finalState = categoryFacetSetReducer(state, action);
        const currentValues = finalState[facetId].currentValues;

        expect(currentValues).toEqual([
          {
            value: selection.value,
            state: 'selected',
            children: [],
            retrieveChildren: true,
            retrieveCount: 5,
          },
        ]);
      });

      it('sets the numberOfValues to request to 1', () => {
        const selection = buildMockCategoryFacetValue({
          value: 'A',
          path: ['A'],
        });
        const action = toggleSelectCategoryFacetValue({facetId, selection});
        const finalState = categoryFacetSetReducer(state, action);

        expect(finalState[facetId].numberOfValues).toBe(1);
      });
    });

    describe('when #currentValues contains one parent', () => {
      beforeEach(() => {
        const parent = buildMockCategoryFacetValueRequest({
          value: 'A',
          state: 'selected',
        });
        state[facetId] = buildMockCategoryFacetRequest({
          currentValues: [parent],
        });
      });

      describe('when the selected value path contains the parent', () => {
        const selection = buildMockCategoryFacetValue({
          value: 'B',
          path: ['A', 'B'],
        });
        const action = toggleSelectCategoryFacetValue({facetId, selection});

        it("adds the selection to the parent's children array", () => {
          const finalState = categoryFacetSetReducer(state, action);
          const expected = buildMockCategoryFacetValueRequest({
            value: selection.value,
            retrieveChildren: true,
            retrieveCount: 5,
            state: 'selected',
          });

          const children = finalState[facetId].currentValues[0].children;
          expect(children).toEqual([expected]);
        });

        it('sets the parent state to idle', () => {
          const finalState = categoryFacetSetReducer(state, action);
          expect(finalState[facetId].currentValues[0].state).toBe('idle');
        });
      });

      describe('when the selected value path does not contain the parent', () => {
        const selection = buildMockCategoryFacetValue({
          value: 'B',
          path: ['C', 'B'],
        });
        const action = toggleSelectCategoryFacetValue({facetId, selection});

        it("does not add the selection to the parent's children array", () => {
          const finalState = categoryFacetSetReducer(state, action);
          expect(finalState[facetId].currentValues[0].children).toEqual([]);
        });

        it('does not set the parent state to idle', () => {
          const finalState = categoryFacetSetReducer(state, action);
          expect(finalState[facetId].currentValues[0].state).toBe('selected');
        });
      });
    });

    describe('when #currentValues contains two parents', () => {
      beforeEach(() => {
        const parentB = buildMockCategoryFacetValueRequest({value: 'B'});
        const parentA = buildMockCategoryFacetValueRequest({
          value: 'A',
          children: [parentB],
        });

        state[facetId] = buildMockCategoryFacetRequest({
          currentValues: [parentA],
        });
      });

      it(`when the selected value path contains the two parents,
      it adds the selection to the second parent's children array`, () => {
        const selection = buildMockCategoryFacetValue({
          value: 'C',
          path: ['A', 'B', 'C'],
        });
        const action = toggleSelectCategoryFacetValue({facetId, selection});
        const finalState = categoryFacetSetReducer(state, action);

        const expected = buildMockCategoryFacetValueRequest({
          value: selection.value,
          retrieveChildren: true,
          retrieveCount: 5,
          state: 'selected',
        });

        expect(
          finalState[facetId].currentValues[0].children[0].children
        ).toEqual([expected]);
      });

      it('when selecting a parent value, it clears the children array of that parent', () => {
        const selection = buildMockCategoryFacetValue({
          value: 'A',
          path: ['A'],
        });
        const action = toggleSelectCategoryFacetValue({facetId, selection});
        const finalState = categoryFacetSetReducer(state, action);

        expect(finalState[facetId].currentValues[0].children).toEqual([]);
      });
    });
  });
});
