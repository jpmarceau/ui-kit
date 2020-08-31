import {Component, h, State} from '@stencil/core';
import {
  Pager,
  PagerState,
  Unsubscribe,
  buildPager,
  Engine,
} from '@coveo/headless';
import {EngineProviderError, EngineProvider} from '../../utils/engine-utils';

@Component({
  tag: 'atomic-pager',
  styleUrl: 'atomic-pager.css',
  shadow: true,
})
export class AtomicPager {
  @State() state!: PagerState;
  @EngineProvider() engine!: Engine;

  private pager!: Pager;
  private error?: Error;
  private unsubscribe: Unsubscribe = () => {};

  public componentWillLoad() {
    try {
      this.configure();
    } catch (error) {
      this.error = error;
    }
  }

  private configure() {
    if (!this.engine) {
      throw new EngineProviderError('atomic-pager');
    }

    this.pager = buildPager(this.engine);
    this.unsubscribe = this.pager.subscribe(() => this.updateState());
  }

  public disconnectedCallback() {
    this.unsubscribe();
  }

  private updateState() {
    this.state = this.pager.state;
  }

  private get backButton() {
    if (!this.state.hasPreviousPage) {
      return null;
    }

    const icon = '<';
    return <button onClick={() => this.pager.previousPage()}>{icon}</button>;
  }

  private get nextButton() {
    if (!this.state.hasNextPage) {
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
    if (this.error) {
      return (
        <atomic-component-error error={this.error}></atomic-component-error>
      );
    }

    return (
      <span>
        {this.backButton}
        {this.pages}
        {this.nextButton}
      </span>
    );
  }
}
