import axios from 'axios';
import gitRemote from 'git-remote-origin-url';
import globby from 'globby';
import parseGithub from 'parse-github-url';
import Generator from 'yeoman-generator';
import format from './utils/format';

export default class extends Generator {
  public async renderTpl(
    ...parameters: Readonly<Parameters<Generator['renderTemplate']>>
  ): Promise<void> {
    this.renderTemplate(...parameters);

    await this.formatFile(parameters[1] as string);
  }

  public async formatFile(filename: string): Promise<void> {
    const config = this.readDestination(filename);
    const formattedConfig = await format(config, filename, this.destinationRoot());
    this.writeDestination(filename, formattedConfig);
  }

  public getExtensions(group = 'js'): string[] {
    const extensions: Record<string, Record<string, boolean>> = {
      css: {
        css: this.hasFiles('**/*.css'),
        scss: this.hasFiles('**/*.scss'),
      },
      js: {
        js: this.hasFiles('**/*.js'),
        jsx: this.hasAnyDependency('react'),
        ts: this.hasDevDependency('typescript'),
        tsx: this.hasDevDependency('typescript') && this.hasAnyDependency('react'),
      },
    };

    return Object.keys(extensions[group]).filter((extension) => extensions[group][extension]);
  }

  public async getGitRemote(): Promise<string | null> {
    let gitUrl = this.config.get('gitUrl') as string | null;

    if (typeof gitUrl === 'string') {
      return gitUrl;
    }

    try {
      gitUrl = await gitRemote();
    } catch (e: unknown) {
      gitUrl = null;
    }

    return gitUrl;
  }

  public async getGitHub(): Promise<{ owner: string; repo: string } | null> {
    let info = null;

    const gitUrl = await this.getGitRemote();

    if (gitUrl !== null) {
      const githubInfo = parseGithub(gitUrl);

      if (githubInfo?.name !== null && githubInfo?.owner !== null && githubInfo !== null) {
        const { owner, name } = githubInfo;

        info = { owner, repo: name };
      }
    }

    return info;
  }

  public async getNpmName(): Promise<string | null> {
    const name = this.packageJson.get('name') as string | undefined;

    let npmName = null;

    if (typeof name !== 'undefined') {
      try {
        await axios.get(`https://www.npmjs.com/package/${name}`);
        npmName = name;
      } catch {
        npmName = null;
      }
    }

    return npmName;
  }

  public hasDependency(name: string): boolean {
    return typeof this.packageJson.getPath(`dependencies.${name}`) !== 'undefined';
  }

  public hasDevDependency(name: string): boolean {
    return typeof this.packageJson.getPath(`devDependencies.${name}`) !== 'undefined';
  }

  public hasAnyDependency(name: string): boolean {
    return this.hasDependency(name) || this.hasDevDependency(name);
  }

  public hasFiles(pattern: string): boolean {
    return globby.sync(this.destinationPath(pattern), { dot: true, gitignore: true }).length > 0;
  }

  public async addAnyDependencies(
    dependencies: Record<string, string> | string[] | string,
    type = 'dependencies',
  ): Promise<Record<string, string>> {
    // eslint-disable-next-line no-underscore-dangle
    const resolved = await this._resolvePackageJsonDependencies(dependencies);
    const filtered = Object.fromEntries(
      Object.entries(resolved).filter(
        ([name]: Readonly<string[]>) =>
          typeof this.packageJson.getPath(`${type}.${name}`) === 'undefined',
      ),
    );

    this.packageJson.merge({ [type]: filtered });

    return filtered;
  }

  public async addPeerDependencies(
    dependencies: Record<string, string> | string[] | string,
  ): Promise<Record<string, string>> {
    return this.addAnyDependencies(dependencies, 'peerDependencies');
  }

  public async addDependencies(
    dependencies: Record<string, string> | string[] | string,
  ): Promise<Record<string, string>> {
    return this.addAnyDependencies(dependencies);
  }

  public async addDevDependencies(
    dependencies: Record<string, string> | string[] | string,
  ): Promise<Record<string, string>> {
    return this.addAnyDependencies(dependencies, 'devDependencies');
  }

  // eslint-disable-next-line no-underscore-dangle
  protected async _resolvePackageJsonDependencies(
    dependencies: Record<string, string> | string[] | string,
  ): Promise<Record<string, string>> {
    // @ts-expect-error no type
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, no-underscore-dangle
    const resolved = (await super._resolvePackageJsonDependencies(dependencies)) as Record<
      string,
      string
    >;

    const last = Object.fromEntries(
      Object.entries(resolved).map(([name, version]: Readonly<string[]>) =>
        !version.startsWith('^') ? [name, `^${version}`] : [name, version],
      ),
    );

    return last;
  }
}
