import { add as addDependencies } from '../dependencies';
import { set as setConfig, Config } from '../configs';
import confirm from './confirm';
import store, { ModuleMainDependency } from './store';

const run = async (moduleName: string): Promise<void> => {
  const config = store.get(moduleName);

  if (typeof config === 'undefined') {
    return;
  }

  if (config.confirm === true) {
    const confirmed = await confirm(moduleName, config?.confirmMessage);

    if (!confirmed) {
      return;
    }
  }

  config.mainDependencies.forEach(({ name, type }: Readonly<ModuleMainDependency>) => {
    addDependencies(name, type);
  });

  const configContent = (typeof config.configContent === 'function'
    ? config.configContent()
    : config.configContent) as Config;

  setConfig(config.configFilename, configContent);
};

export default run;
