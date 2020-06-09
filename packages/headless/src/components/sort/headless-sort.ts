import {SomeEngine} from '../../app/headless-engine';
import {
  registerSortCriterion,
  updateSortCriterion,
} from '../../features/sort-criterion/sort-criterion-actions';
import {executeSearch} from '../../features/search/search-actions';
import {
  SortCriterion,
  buildEmptySortCriterion,
} from '../../features/sort-criterion/criteria';
import {Component} from '../component/headless-component';

export interface SortOptions {
  /** The initial sort criterion to register in state. */
  criterion: SortCriterion;
}

/** The state relevant to the `Sort` component.*/
export type SortState = Sort['state'];

export class Sort extends Component {
  private options: SortOptions = {
    criterion: buildEmptySortCriterion(),
  };

  constructor(engine: SomeEngine, options: Partial<SortOptions>) {
    super(engine);
    this.options = {...this.options, ...options};
    this.register();
  }

  /**
   * Updates the sort criterion and executes a new search.
   * @param criterion The new sort criterion.
   */
  public sortBy(criterion: SortCriterion) {
    this.dispatch(updateSortCriterion(criterion));
    this.search();
  }

  /**
   * Returns `true` if the passed sort criterion matches the value in state, and `false` otherwise.
   * @param criterion The criterion to compare.
   * @returns {boolean}
   */
  public isSortedBy(criterion: SortCriterion) {
    return this.engine.state.sortCriteria === criterion.expression;
  }

  /**
   * @returns The state of the `Sort` component.
   */
  public get state() {
    return {
      sortCriteria: this.engine.state.sortCriteria,
    };
  }

  private register() {
    const {criterion} = this.options;
    this.dispatch(registerSortCriterion(criterion));
  }

  private search() {
    this.dispatch(executeSearch());
  }
}
