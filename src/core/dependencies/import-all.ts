import { PackageJson } from '../../packagejson/package-json';
import { groupNames, GroupNames } from './store';
import load from '../configs/load';
import add from './add';

const importAll = async (): Promise<void> => {
  const pkg = await load<PackageJson>('package.json');

  if (typeof pkg === 'undefined') {
    return;
  }

  groupNames.forEach((groupName: string): void => {
    const deps = pkg[groupName as GroupNames];

    if (typeof deps !== 'undefined') {
      Object.keys(deps).forEach((dependencyName: string) => {
        add(dependencyName, groupName);
      });
    }
  });
};

export default importAll;