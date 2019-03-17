const config = {
  compilerOptions: {
    allowSyntheticDefaultImports: true,
    declaration: true,
    declarationMap: true,
    esModuleInterop: true,
    experimentalDecorators: true,
    inlineSources: true,
    jsx: 'react',
    lib: ['es2017', 'dom'],
    module: 'es2015',
    moduleResolution: 'node',
    noFallthroughCasesInSwitch: true,
    noImplicitAny: false,
    noImplicitReturns: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    outDir: 'dist',
    rootDir: 'src',
    skipLibCheck: true,
    sourceMap: true,
    strict: true,
    target: 'es2017',
  },
  include: ['src/'],
  exclude: [
    'node_modules',
    '**/__tests__/**',
    '**/*.spec.*',
  ],
};

module.exports = function setupTypescript() {
  this.fs.writeJSON(this.destinationPath('tsconfig.json'), config);
};
