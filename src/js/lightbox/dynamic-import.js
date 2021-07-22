export function dynamicImportModule(module) {
  return typeof module === 'string' ? import(/* webpackIgnore: true */ module) : module;
}
