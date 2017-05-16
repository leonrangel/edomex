// Build configuration file, should be used with the require.js optimizer
// r.js -u build.js
({
  baseUrl: './',
  mainConfigFile: 'main.js',
  removeCombined: false,
  inlineText: true,
  findNestedDependencies: true,
  preserveLicenseComments: false,
  optimize: 'uglify2',
  generateSourceMaps: true,
  name: 'main',
  out: 'main.built.js'
})