import {
  numericFacetSetReducer,
  NumericFacetSetState,
  getNumericFacetSetInitialState,
} from './numeric-facet-set-slice';
import {
  registerNumericFacet,
  toggleSelectNumericFacetValue,
  updateNumericFacetSortCriterion,
  deselectAllNumericFacetValues,
} from './numeric-facet-actions';
import {NumericFacetRegistrationOptions} from './interfaces/options';
import {getHistoryEmptyState} from '../../../history/history-slice';
import {buildMockNumericFacetRequest} from '../../../../test/mock-numeric-facet-request';
import {change} from '../../../history/history-actions';
import {buildMockNumericFacetValue} from '../../../../test/mock-numeric-facet-value';
import * as RangeFacetReducers from '../generic/range-facet-reducers';
import * as FacetReducers from '../../generic/facet-reducer-helpers';
import {executeSearch} from '../../../search/search-actions';
import {buildMockSearch} from '../../../../test/mock-search';
import {logGenericSearchEvent} from '../../../analytics/analytics-actions';

describe('numeric-facet-set slice', () => {
  let state: NumericFacetSetState;

  beforeEach(() => {
    state = getNumericFacetSetInitialState();
  });

  it('initializes the set to an empty object', () => {
    const finalState = numericFacetSetReducer(undefined, {type: ''});
    expect(finalState).toEqual({});
  });

  it('#registerNumericFacet registers a numeric facet', () => {
    const facetId = '1';
    const options: NumericFacetRegistrationOptions = {
      facetId,
      field: '',
      generateAutomaticRanges: true,
    };

    const finalState = numericFacetSetReducer(
      state,
      registerNumericFacet(options)
    );

    expect(finalState[facetId]).toEqual({
      ...options,
      currentValues: [],
      filterFacetCount: false,
      generateAutomaticRanges: true,
      injectionDepth: 1000,
      numberOfValues: 8,
      preventAutoSelect: false,
      sortCriteria: 'ascending',
      type: 'numericalRange',
    });
  });

  it('it restores the numericFacetSet on history change', () => {
    const numericFacetSet = {'1': buildMockNumericFacetRequest()};
    const payload = {
      ...getHistoryEmptyState(),
      numericFacetSet,
    };

    const finalState = numericFacetSetReducer(
      state,
      change.fulfilled(payload, '')
    );

    expect(finalState).toEqual(numericFacetSet);
  });

  it('#toggleSelectNumericFacetValue calls #toggleSelectRangeValue', () => {
    const facetId = '1';
    const selection = buildMockNumericFacetValue();
    jest.spyOn(RangeFacetReducers, 'toggleSelectRangeValue');

    numericFacetSetReducer(
      state,
      toggleSelectNumericFacetValue({facetId, selection})
    );

    expect(RangeFacetReducers.toggleSelectRangeValue).toHaveBeenCalledTimes(1);
  });

  it('#deselectAllNumericFacetValues calls #handleFacetDeselectAll', () => {
    jest.spyOn(FacetReducers, 'handleFacetDeselectAll');
    const action = deselectAllNumericFacetValues('1');
    numericFacetSetReducer(state, action);

    expect(FacetReducers.handleFacetDeselectAll).toHaveBeenCalledTimes(1);
  });

  it('#updateNumericFacetSortCriterion calls #handleFacetSortCriterionUpdate', () => {
    jest.spyOn(FacetReducers, 'handleFacetSortCriterionUpdate');

    const action = updateNumericFacetSortCriterion({
      facetId: '1',
      criterion: 'descending',
    });
    numericFacetSetReducer(state, action);

    expect(FacetReducers.handleFacetSortCriterionUpdate).toHaveBeenCalledTimes(
      1
    );
  });

  it('#executeSearch.fulfilled calls #onRangeFacetRequestFulfilled', () => {
    jest.spyOn(RangeFacetReducers, 'onRangeFacetRequestFulfilled');

    const search = buildMockSearch();
    numericFacetSetReducer(
      state,
      executeSearch.fulfilled(search, '', logGenericSearchEvent({evt: 'foo'}))
    );

    expect(
      RangeFacetReducers.onRangeFacetRequestFulfilled
    ).toHaveBeenCalledTimes(1);
  });
});