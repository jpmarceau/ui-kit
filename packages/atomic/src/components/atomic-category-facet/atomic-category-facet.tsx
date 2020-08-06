import {Component, h, Prop, State} from '@stencil/core';
import {
  CategoryFacetState,
  CategoryFacet,
  buildCategoryFacet,
  CategoryFacetOptions,
  CategoryFacetValue,
  Unsubscribe,
} from '@coveo/headless';
import {headlessEngine} from '../../engine';

@Component({
  tag: 'atomic-category-facet',
  styleUrl: 'atomic-category-facet.css',
  shadow: true,
})
export class AtomicCategoryFacet {
  @Prop() field = '';
  @Prop() label = 'No label';
  @State() state!: CategoryFacetState;

  private categoryFacet: CategoryFacet;
  private unsubscribe: Unsubscribe;

  constructor() {
    const options: CategoryFacetOptions = {field: this.field};
    this.categoryFacet = buildCategoryFacet(headlessEngine, {options});
    this.unsubscribe = this.categoryFacet.subscribe(() => this.updateState());
  }

  public disconnectedCallback() {
    this.unsubscribe();
  }

  private updateState() {
    this.state = this.categoryFacet.state;
  }

  private get parents() {
    const parents = this.state.parents;

    return parents.map((parent, i) => {
      const isLast = i === parents.length - 1;
      return this.buildParent(parent, isLast);
    });
  }

  private buildParent(parent: CategoryFacetValue, isLast: boolean) {
    return (
      <div onClick={() => !isLast && this.categoryFacet.toggleSelect(parent)}>
        <b>{parent.value}</b>
      </div>
    );
  }

  private get values() {
    return this.state.values.map((value) => this.buildValue(value));
  }

  private buildValue(item: CategoryFacetValue) {
    const definitelyHasNoMoreValues = item.moreValuesAvailable === false;

    return (
      <div
        onClick={() =>
          !definitelyHasNoMoreValues && this.categoryFacet.toggleSelect(item)
        }
      >
        <span>
          {item.value} {item.numberOfResults}
        </span>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div>
          <span>{this.label}</span>
        </div>
        <div>{this.parents}</div>
        <div>{this.values}</div>
      </div>
    );
  }
}
