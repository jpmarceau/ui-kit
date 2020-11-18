import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import {
  DateRangeRequest,
  DateFacetRequest,
} from '../../../../features/facets/range-facets/date-facet-set/interfaces/request';
import {
  AutomaticRangeFacetOptions,
  ManualRangeFacetOptions,
} from '../../../../features/facets/range-facets/generic/interfaces/options';
import {Engine} from '../../../../app/headless-engine';
import {randomID} from '../../../../utils/utils';
import {DateFacetRegistrationOptions} from '../../../../features/facets/range-facets/date-facet-set/interfaces/options';
import {
  DateFacetResponse,
  DateFacetValue,
} from '../../../../features/facets/range-facets/date-facet-set/interfaces/response';
import {registerDateFacet} from '../../../../features/facets/range-facets/date-facet-set/date-facet-actions';
import {buildRangeFacet} from '../headless-range-facet';
import {
  ConfigurationSection,
  DateFacetSection,
  SearchSection,
} from '../../../../state/state-sections';
import {executeToggleDateFacetSelect} from '../../../../features/facets/range-facets/date-facet-set/date-facet-controller-actions';

dayjs.extend(utc);
dayjs.extend(customParseFormat);

type DateRangeOptions = Partial<Omit<DateRangeRequest, 'start' | 'end'>> & {
  start: string | number | Date;
  end: string | number | Date;
  useLocalTime?: boolean;
  dateFormat?: string;
};

export function buildDateRange(config: DateRangeOptions): DateRangeRequest {
  const DATE_FORMAT = 'YYYY/MM/DD@HH:mm:ss';
  const start = config.useLocalTime
    ? dayjs(config.start, config.dateFormat).format(DATE_FORMAT)
    : dayjs(config.start, config.dateFormat).utc().format(DATE_FORMAT);
  const end = config.useLocalTime
    ? dayjs(config.end, config.dateFormat).format(DATE_FORMAT)
    : dayjs(config.end, config.dateFormat).utc().format(DATE_FORMAT);

  if (start === 'Invalid Date' || end === 'Invalid Date') {
    throw new Error(
      'Could not parse the provided date, ensure it is in a format readable by day.js'
    );
  }
  return {
    endInclusive: false,
    state: 'idle',
    ...config,
    start,
    end,
  };
}

export type DateFacetProps = {
  options: DateFacetOptions;
};

export type DateFacetOptions = {facetId?: string} & (
  | Omit<AutomaticRangeFacetOptions<DateFacetRequest>, 'facetId'>
  | Omit<ManualRangeFacetOptions<DateFacetRequest>, 'facetId'>
);

/** The `DateFacet` controller makes it possible to create a facet with date ranges.*/
export type DateFacet = ReturnType<typeof buildDateFacet>;
export type DateFacetState = DateFacet['state'];

export function buildDateFacet(
  engine: Engine<ConfigurationSection & SearchSection & DateFacetSection>,
  props: DateFacetProps
) {
  const dispatch = engine.dispatch;

  const facetId = props.options.facetId || randomID('dateFacet');
  const options: DateFacetRegistrationOptions = {facetId, ...props.options};

  dispatch(registerDateFacet(options));

  const rangeFacet = buildRangeFacet<DateFacetRequest, DateFacetResponse>(
    engine,
    {
      facetId,
      getRequest: () => engine.state.dateFacetSet[facetId],
    }
  );

  return {
    ...rangeFacet,
    /**
     * Selects (deselects) the passed value if unselected (selected).
     * @param selection The facet value to select or deselect.
     */
    toggleSelect: (selection: DateFacetValue) =>
      dispatch(executeToggleDateFacetSelect({facetId, selection})),

    /** @returns The state of the `DateFacet` controller.*/
    get state() {
      return {...rangeFacet.state, isLoading: engine.state.search.isLoading};
    },
  };
}
