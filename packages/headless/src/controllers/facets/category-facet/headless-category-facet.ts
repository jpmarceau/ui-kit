import {Engine} from '../../../app/headless-engine';
import {buildController} from '../../controller/headless-controller';
import {randomID} from '../../../utils/utils';
import {CategoryFacetRegistrationOptions} from '../../../features/facets/category-facet-set/interfaces/options';
import {
  registerCategoryFacet,
  toggleSelectCategoryFacetValue,
  deselectAllCategoryFacetValues,
  updateCategoryFacetNumberOfValues,
  updateCategoryFacetSortCriterion,
  updateCategoryFacetNestedNumberOfValues,
} from '../../../features/facets/category-facet-set/category-facet-set-actions';
import {facetSelector} from '../../../features/facets/facet-set/facet-set-selectors';
import {
  CategoryFacetResponse,
  CategoryFacetValue,
} from '../../../features/facets/category-facet-set/interfaces/response';
import {executeSearch} from '../../../features/search/search-actions';
import {
  FacetSelectionChangeMetadata,
  logFacetDeselect,
  logFacetSelect,
  logFacetUpdateSort,
  logFacetClearAll,
  logFacetShowMore,
} from '../../../features/facets/facet-set/facet-set-analytics-actions';
import {defaultCategoryFacetOptions} from '../../../features/facets/category-facet-set/category-facet-set-slice';
import {CategoryFacetSortCriterion} from '../../../features/facets/category-facet-set/interfaces/request';
import {categoryFacetRequestSelector} from '../../../features/facets/category-facet-set/category-facet-set-selectors';

export type CategoryFacetProps = {
  options: CategoryFacetOptions;
};

export type CategoryFacetOptions = {facetId?: string} & Omit<
  CategoryFacetRegistrationOptions,
  'facetId'
>;

export type CategoryFacet = ReturnType<typeof buildCategoryFacet>;
export type CategoryFacetState = CategoryFacet['state'];

export function buildCategoryFacet(engine: Engine, props: CategoryFacetProps) {
  const controller = buildController(engine);
  const {dispatch} = engine;

  const facetId = props.options.facetId || randomID('categoryFacet');
  const options: Required<CategoryFacetRegistrationOptions> = {
    facetId,
    ...defaultCategoryFacetOptions,
    ...props.options,
  };

  const getAnalyticsActionForToggleSelect = (selection: CategoryFacetValue) => {
    const payload: FacetSelectionChangeMetadata = {
      facetId,
      facetValue: selection.value,
    };

    const isSelected = selection.state === 'selected';
    return isSelected ? logFacetDeselect(payload) : logFacetSelect(payload);
  };

  const getRequest = () => {
    return categoryFacetRequestSelector(engine.state, facetId);
  };

  const getResponse = () => {
    return facetSelector(engine.state, facetId) as
      | CategoryFacetResponse
      | undefined;
  };

  dispatch(registerCategoryFacet(options));

  return {
    ...controller,

    /**
     * Selects (deselects) the passed value if unselected (selected).
     * @param selection The category facet value to select or deselect.
     */
    toggleSelect(selection: CategoryFacetValue) {
      const analyticsAction = getAnalyticsActionForToggleSelect(selection);

      dispatch(toggleSelectCategoryFacetValue({facetId, selection}));
      dispatch(executeSearch(analyticsAction));
    },

    /** Deselects all facet values.*/
    deselectAll() {
      const numberOfValues = options.numberOfValues!;

      dispatch(deselectAllCategoryFacetValues(facetId));
      dispatch(updateCategoryFacetNumberOfValues({facetId, numberOfValues}));
      dispatch(executeSearch(logFacetClearAll(facetId)));
    },

    /** Sorts the category facet values according to the passed criterion.
     * @param {CategoryFacetSortCriterion} criterion The criterion to sort values by.
     */
    sortBy(criterion: CategoryFacetSortCriterion) {
      const facetId = options.facetId;

      dispatch(updateCategoryFacetSortCriterion({facetId, criterion}));
      dispatch(executeSearch(logFacetUpdateSort({facetId, criterion})));
    },

    /**
     * Returns `true` if the category facet values are sorted according to the passed criterion and `false` otherwise.
     * @param {CategoryFacetSortCriterion} criterion The criterion to compare.
     */
    isSortedBy(criterion: CategoryFacetSortCriterion) {
      const request = getRequest();
      return request.sortCriteria === criterion;
    },
    /**
     * Displays more values for the current selected category if they exist
     */
    showMoreValues() {
      const {facetId, numberOfValues: increment} = options;
      const request = getRequest();

      const {parents} = this.state;
      if (parents.length === 0) {
        const numberOfValues = request.numberOfValues + increment;
        dispatch(updateCategoryFacetNumberOfValues({facetId, numberOfValues}));
      } else {
        dispatch(updateCategoryFacetNestedNumberOfValues({facetId, increment}));
      }
      dispatch(executeSearch(logFacetShowMore(facetId)));
    },
    /**  @returns The state of the `CategoryFacet` controller.*/
    get state() {
      const request = getRequest();
      const response = getResponse();

      const {parents, values} = partitionIntoParentsAndValues(response);
      const isLoading = engine.state.search.isLoading;
      const hasActiveValues = parents.length !== 0;
      const canShowMoreValues =
        parents.length > 0
          ? parents[parents.length - 1].moreValuesAvailable
          : response?.moreValuesAvailable || false;
      return {
        parents,
        values,
        isLoading,
        hasActiveValues,
        canShowMoreValues,
        sortCriteria: request.sortCriteria,
      };
    },
  };
}

type CategoryFacetResponsePartition = {
  parents: CategoryFacetValue[];
  values: CategoryFacetValue[];
};

function partitionIntoParentsAndValues(
  response: CategoryFacetResponse | undefined
): CategoryFacetResponsePartition {
  if (!response) {
    return {parents: [], values: []};
  }

  let parents: CategoryFacetValue[] = [];
  let values = response.values;

  while (values.length && values[0].children.length) {
    parents = [...parents, ...values];
    values = values[0].children;
  }

  const selectedLeafValue = values.find((v) => v.state === 'selected');

  if (selectedLeafValue) {
    parents = [...parents, selectedLeafValue];
    values = [];
  }

  return {parents, values};
}
