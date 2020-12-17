import {Component, Prop, Element, h} from '@stencil/core';
import {Result, ResultTemplatesHelpers, HighlightUtils} from '@coveo/headless';
import {
  ResultContext,
  ResultContextRenderer,
} from '../result-template-decorators';

@Component({
  tag: 'atomic-result-value',
  shadow: true,
})
export class AtomicResultValue {
  @Element() host!: HTMLDivElement;
  @Prop() value = '';
  @Prop() shouldHighlightWith: HighlightUtils.ResultHighlights | undefined;

  @ResultContext() private result!: Result;

  @ResultContextRenderer
  public render() {
    let resultValue = ResultTemplatesHelpers.getResultProperty(
      this.result,
      this.value
    );

    if (resultValue !== null) {
      if (this.shouldHighlightWith) {
        try {
          resultValue = HighlightUtils.highlightString({
            content: resultValue as string,
            delimiters: {
              open: '<strong>',
              close: '</strong>',
            },
            highlights: ResultTemplatesHelpers.getResultProperty(
              this.result,
              this.shouldHighlightWith
            ) as HighlightUtils.HighlightKeyword[],
          });
          return <span innerHTML={resultValue as string}></span>;
        } catch (error) {
          return (
            <atomic-component-error error={error}></atomic-component-error>
          );
        }
      }
      return <span>{resultValue}</span>;
    }

    this.host.remove();
  }
}
