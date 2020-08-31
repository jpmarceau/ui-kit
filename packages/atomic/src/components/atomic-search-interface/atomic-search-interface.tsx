import {Component, Prop, h} from '@stencil/core';
import {
  HeadlessEngine,
  searchPageReducers,
  Engine,
  HeadlessConfigurationOptions,
  SearchActions,
  AnalyticsActions,
} from '@coveo/headless';
import {Schema, StringValue} from '@coveo/bueno';
import {RenderError} from '../../utils/render-utils';

@Component({
  tag: 'atomic-search-interface',
  shadow: true,
})
export class AtomicSearchInterface {
  @Prop() sample = false;
  @Prop() organizationId?: string;
  @Prop() accessToken?: string;
  @Prop() renewAccessToken?: () => Promise<string>;
  @Prop() engine?: Engine;
  @RenderError() error?: Error;

  constructor() {
    const config = this.configuration;
    if (!config) {
      this.error = new Error(
        'The atomic-search-interface component configuration is faulty, see the console for more details.'
      );
      return;
    }

    this.engine = new HeadlessEngine({
      configuration: config,
      reducers: searchPageReducers,
    });
  }

  get configuration(): HeadlessConfigurationOptions | null {
    if (this.sample) {
      if (this.organizationId || this.accessToken) {
        console.warn(
          'You have a conflicting configuration on the atomic-search-interface component.',
          'When the sample prop is defined, the access-token and organization-id should not be defined and will be ignored.'
        );
      }
      return HeadlessEngine.getSampleConfiguration();
    }

    try {
      new Schema({
        organizationId: new StringValue({emptyAllowed: false, required: true}),
        accessToken: new StringValue({emptyAllowed: false, required: true}),
      }).validate({
        organizationId: this.organizationId,
        accessToken: this.accessToken,
      });
    } catch (error) {
      console.error(error);
      return null;
    }

    return {
      accessToken: this.accessToken!,
      organizationId: this.organizationId!,
      renewAccessToken: this.renewAccessToken,
    };
  }

  componentDidLoad() {
    this.engine!.dispatch(
      SearchActions.executeSearch(AnalyticsActions.logInterfaceLoad())
    );
  }

  render() {
    return <slot></slot>;
  }
}
