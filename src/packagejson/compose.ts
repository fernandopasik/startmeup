import { isEmpty, omitBy } from 'lodash';
import { PackageJson } from './package-json';
import { Parsed } from './parse';

interface Author {
  name?: string;
  email?: string;
  url?: string;
}

const composeAuthor = (author: Author): string => [
  author.name,
  author.email && ` <${author.email}>`,
  author.url && ` (${author.url})`,
].join('').trim();

interface RepoInfo {
  repository?: {
    type: string;
    url: string;
  };
  homepage?: string;
  bugs?: string;
}

const composeGithubUrl = (url: string): RepoInfo => ({
  repository: {
    type: 'git',
    url: `${url}.git`,
  },
  homepage: url,
  bugs: `${url}/issues`,
});

const compose = ({
  name,
  version,
  description,
  author,
  githubUrl,
  license,
}: Parsed): PackageJson => {
  const composed = {
    name,
    version,
    description,
    author: composeAuthor(author || {}),
    ...(!githubUrl ? {} : composeGithubUrl(githubUrl)),
    license,
  };

  return omitBy(composed, isEmpty) as unknown as PackageJson;
};

export default compose;
