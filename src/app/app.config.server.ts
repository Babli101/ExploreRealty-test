import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering() // ✅ no renderMode param, just enables SSR
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
