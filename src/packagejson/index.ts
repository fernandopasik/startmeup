import Generator from 'yeoman-generator';
import sort from 'sort-package-json';
import { Answers } from 'inquirer';

import parse, { Parsed } from './parse';
import compose from './compose';
import questions from './questions';
import ask from '../app/ask';

import { PackageJson } from './package-json';

export default class PackageJsonGenrator extends Generator {
  private pkg?: PackageJson

  private parameters?: Parsed

  private answers?: Answers

  public initializing(): void {
    this.pkg = this.fs.readJSON('package.json') || {};
    if (this.pkg) {
      this.parameters = parse(this.pkg);
    }
  }

  public async prompting(): Promise<void> {
    this.answers = await ask(questions, this.parameters as Answers);
  }

  public async writing(): Promise<void> {
    const pkg = {
      ...this.pkg,
      ...compose(this.answers as Parsed),
    };

    const sortedPkg = sort(pkg);

    this.fs.writeJSON('package.json', sortedPkg);
  }
}