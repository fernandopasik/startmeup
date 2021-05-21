import type { PackageJson } from 'type-fest';
import Generator from '../generator';

export default class PrettierGenerator extends Generator {
  public async configuring(): Promise<void> {
    this.packageJson.merge({
      scripts: {
        format: 'prettier --no-error-on-unmatched-pattern --write ** ./* ./.??*',
      },
    });

    const devDependencies = ['prettier', 'prettier-plugin-packagejson'];

    if (this.hasDevDependency('typescript')) {
      devDependencies.push('prettier-plugin-organize-imports');
    }

    await this.addDevDependencies(devDependencies);

    const packageFiles = (this.packageJson.get('files') as PackageJson['files']) ?? [];

    const options = {
      flow: this.hasDevDependency('flow-bin'),
      files: packageFiles.map((packageFile) => `${packageFile}\n`).join(''),
    };

    this.copyTemplate('prettierrc.json', '.prettierrc.json');
    this.renderTemplate('prettierignore', '.prettierignore', options);
  }
}
