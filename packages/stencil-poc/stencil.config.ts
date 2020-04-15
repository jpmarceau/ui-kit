import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'stencil-ui',
  globalStyle: 'src/global.css',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
    {
      type: 'docs-readme'
    },
    {
      type: 'www',
      serviceWorker: null // disable service workers
    },
    {
      type: 'dist-hydrate-script'
    }
  ]
};