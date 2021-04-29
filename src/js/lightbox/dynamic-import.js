export function dynamicImportModule(module) {
  // TODO: polyfill import?
  return import(module);
}

export function dynamicImportPlugin(pluginKey, pluginItem) {
  return new Promise((resolve) => {
    if (typeof pluginItem === 'string') {
      dynamicImportModule(pluginItem).then((module) => {
        resolve({
          pluginKey,
          moduleClass: module.default
        });
      }).catch(resolve);
    } else {
      resolve();
    }
  });
}
