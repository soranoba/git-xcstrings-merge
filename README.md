# git-json-merge

A git merge driver that use [xdiff](https://github.com/dominictarr/xdiff) to automatically resolve merge conflicts in json files. It also detects indentation automatically. This project was inspired by [git-po-merge](https://github.com/beck/git-po-merge).

[![@git-json-merge](https://circleci.com/gh/jonatanpedersen/git-json-merge.svg?style=shield)](https://app.circleci.com/pipelines/github/jonatanpedersen/git-json-merge)
[![NPM Version](https://img.shields.io/npm/v/git-json-merge.svg)](https://www.npmjs.com/package/git-json-merge)

## Install

This can be done one of two ways, globally or per-project/directory:

### Globally

Install:

```sh
npm install --global git+https://github.com/soranoba/git-xcstrings-merge.git
```

Add to `~/.gitconfig`:

```ini
[core]
    attributesfile = ~/.gitattributes
[merge "xcstrings"]
    name = custom merge driver for xcstrings files
    driver = git-xcstrings-merge %A %O %B
```

Create `~/.gitattributes`:

```ini
*.xcstrings merge=xcstrings
```

### Single project / directory

Install:

```sh
npm install git+https://github.com/soranoba/git-xcstrings-merge.git --save-dev
```

Update git config:

```sh
git config merge.xcstrings.driver "$(npm bin)/git-xcstrings-merge %A %O %B"
git config merge.xcstrings.name "custom merge driver for xcstrings files"
```

Add the same `.gitattributes` where desired and commit.
Note `.gitattributes` is only used after committed.

Helpful docs:

- http://git-scm.com/docs/gitattributes#_defining_a_custom_merge_driver
- http://stackoverflow.com/questions/28026767/where-should-i-place-my-global-gitattributes-file

Thanks:

- https://gist.github.com/mezis/1605647
- http://stackoverflow.com/questions/16214067/wheres-the-3-way-git-merge-driver-for-po-gettext-files
