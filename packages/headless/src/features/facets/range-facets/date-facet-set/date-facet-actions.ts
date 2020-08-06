import {createAction} from '@reduxjs/toolkit';
import {DateFacetRegistrationOptions} from './interfaces/options';
import {DateFacetValue} from './interfaces/response';

/**
 * Register a date facet.
 * @param {DateFacetRegistrationOptions} DateFacetRegistrationOptions The options to register the facet with.
 */
export const registerDateFacet = createAction<DateFacetRegistrationOptions>(
  'dateFacet/register'
);

/**
 * Select (unselect) a date facet value if unselected (selected).
 */
export const toggleSelectDateFacetValue = createAction<{
  facetId: string;
  selection: DateFacetValue;
}>('dateFacet/toggleSelectValue');
