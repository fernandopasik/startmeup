// eslint-disable-next-line import/no-extraneous-dependencies
import {
  CompilerOptions,
  JsxEmit,
  ModuleKind,
  ModuleResolutionKind,
  ScriptTarget,
} from 'typescript';
import { dependencies } from '../core';

interface TypescriptConfig {
  compilerOptions?: CompilerOptions;
  include: string[];
  exclude: string[];
}

const getTSConfig = (): TypescriptConfig => ({
  compilerOptions: {
    declaration: true,
    declarationMap: true,
    esModuleInterop: true,
    experimentalDecorators: true,
    inlineSources: true,
    ...(dependencies.has('react') ? { jsx: ('react' as unknown) as JsxEmit } : {}),
    lib: ['es2020', 'dom', 'dom.iterable'],
    module: ('ESNext' as unknown) as ModuleKind,
    moduleResolution: ('node' as unknown) as ModuleResolutionKind,
    noFallthroughCasesInSwitch: true,
    noImplicitAny: true,
    noImplicitReturns: true,
    noImplicitThis: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    outDir: '.',
    rootDirs: ['src'],
    sourceMap: true,
    strict: true,
    strictBindCallApply: true,
    strictFunctionTypes: true,
    strictNullChecks: true,
    strictPropertyInitialization: true,
    target: ('es2017' as unknown) as ScriptTarget,
  },
  include: ['src/**/*'],
  exclude: [
    'node_modules',
    '**/__tests__/**/*',
    `**/?(*.)+(spec|test).${dependencies.has('typescript', 'devDependencies') ? '(js|ts)' : 'js'}${
      dependencies.has('react') ? '?(x)' : ''
    }`,
  ],
});

export default getTSConfig;
