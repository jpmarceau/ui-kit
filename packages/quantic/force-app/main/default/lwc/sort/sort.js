// @ts-check
import {LightningElement, track, api} from 'lwc';
import {initializeComponent} from 'c/initialization';

export default class Sort extends LightningElement {
  @track state = {};

  /** @type {import("coveo").Sort} */
  sort;
  /** @type {import("coveo").Unsubscribe} */
  unsubscribe;

  connectedCallback() {
    initializeComponent(this);
  }

  /**
   * @param {import("coveo").Engine} engine
   */
  @api
  initialize(engine) {
    this.sort = CoveoHeadless.buildSort(engine);
    this.unsubscribe = this.sort.subscribe(() => this.updateState());
  }

  updateState() {
    this.state = this.sort.state;
  }

  /**
   * @param {CustomEvent<{value: string}>} e
   */
  handleChange(e) {
    const selected = e.detail.value;

    switch (selected) {
      case 'relevancy':
        this.sort.sortBy(this.relevance);
        break;

      case 'newest':
        this.sort.sortBy(this.dateDescending);
        break;

      case 'oldest':
        this.sort.sortBy(this.dateAscending);
        break;

      default:
        break;
    }

    this.engine;
  }

  get relevance() {
    return CoveoHeadless.buildRelevanceSortCriterion();
  }

  get dateDescending() {
    return CoveoHeadless.buildDateSortCriterion('descending');
  }

  get dateAscending() {
    return CoveoHeadless.buildDateSortCriterion('ascending');
  }

  get largest() {
    return CoveoHeadless.buildFieldSortCriterion('size', 'descending');
  }

  get options() {
    return [
      {label: 'Relevancy', value: 'relevancy'},
      {label: 'Newest', value: 'newest'},
      {label: 'Oldest', value: 'oldest'},
    ];
  }

  get value() {
    if (!this.sort) {
      return 'relevancy';
    }
    return this.state.sortCriteria.expression;
  }
}
