export function dynamicImportModule(module) {
  // TODO: polyfill import?
  return typeof module === 'string' ? import(module) : module;
}

export function dynamicImportPlugin(pluginKey, pluginItem) {
  return new Promise((resolve) => {
    if (typeof pluginItem === 'string' || typeof pluginItem === 'object') {
      dynamicImportModule(pluginItem).then((module) => {
        resolve({
          pluginKey,
          moduleClass: typeof module === 'string' ? module.default : module
        });
      }).catch(resolve);
    } else {
      resolve();
    }
  });
}
