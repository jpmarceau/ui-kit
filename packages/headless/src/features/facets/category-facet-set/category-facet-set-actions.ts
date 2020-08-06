import {createAction} from '@reduxjs/toolkit';
import {CategoryFacetRegistrationOptions} from './interfaces/options';
import {CategoryFacetValue} from './interfaces/response';

/**
 * Register a category facet in the category facet set.
 * @param {CategoryFacetRegistrationOptions} CategoryFacetRegistrationOptions The options to register the category facet with.
 */
export const registerCategoryFacet = createAction<
  CategoryFacetRegistrationOptions
>('categoryFacet/register');

/**
 * Select (unselect) a category facet value if unselected (selected).
 */
export const toggleSelectCategoryFacetValue = createAction<{
  facetId: string;
  selection: CategoryFacetValue;
}>('categoryFacet/toggleSelectValue');
