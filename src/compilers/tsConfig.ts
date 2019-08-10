const tsConfig = {
  compilerOptions: {
    declaration: true,
    declarationMap: true,
    esModuleInterop: true,
    experimentalDecorators: true,
    inlineSources: true,
    jsx: 'react',
    lib: ['es2017', 'dom', 'dom.iterable'],
    module: 'ESNext',
    moduleResolution: 'node',
    noFallthroughCasesInSwitch: true,
    noImplicitAny: true,
    noImplicitReturns: true,
    noImplicitThis: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    outDir: 'dist',
    rootDir: 'src',
    sourceMap: true,
    strict: true,
    strictBindCallApply: true,
    strictFunctionTypes: true,
    strictNullChecks: true,
    strictPropertyInitialization: true,
    target: 'es2017',
  },
  include: ['src/**/*'],
  exclude: ['node_modules'],
};

export default tsConfig;