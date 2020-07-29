import {Component, h, State} from '@stencil/core';
import {Pager, PagerState, Unsubscribe, buildPager} from '@coveo/headless';
import {headlessEngine} from '../../engine';

@Component({
  tag: 'atomic-pager',
  styleUrl: 'atomic-pager.css',
  shadow: true,
})
export class AtomicPager {
  private pager: Pager;
  private unsubscribe: Unsubscribe;
  @State() state!: PagerState;

  constructor() {
    this.pager = buildPager(headlessEngine);
    this.unsubscribe = this.pager.subscribe(() => this.updateState());
  }

  public disconnectedCallback() {
    this.unsubscribe();
  }

  private updateState() {
    this.state = this.pager.state;
  }

  private get backButton() {
    if (!this.pager.hasPreviousPage) {
      return null;
    }

    const icon = '<';
    return <button onClick={() => this.pager.previousPage()}>{icon}</button>;
  }

  private get nextButton() {
    if (!this.pager.hasNextPage) {
      return null;
    }

    const icon = '>';
    return <button onClick={() => this.pager.nextPage()}>{icon}</button>;
  }

  private get pages() {
    const pages = this.pager.state.currentPages;
    return pages.map((page) => this.buildPage(page));
  }

  private buildPage(page: number) {
    const isSelected = this.pager.isCurrentPage(page);
    const className = isSelected ? 'active' : '';

    return (
      <button class={className} onClick={() => this.pager.selectPage(page)}>
        {page}
      </button>
    );
  }

  render() {
    return (
      <span>
        {this.backButton}
        {this.pages}
        {this.nextButton}
      </span>
    );
  }
}
