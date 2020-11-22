# DOTENV SSM [![npm](https://img.shields.io/npm/v/dotenv-ssm.svg?style=flat-square)]()

Simple utility to fetch env vars from the [AWS SSM Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) and create a `.env` file from them.

Note: this script will auto-decrypt the vars.

## Usage

Intended to be run as a script, with the following env vars:

```ssh
AWS_ACCESS_KEY_ID=accessKey
AWS_SECRET_ACCESS_KEY=secretKey
AWS_REGION=us-east-1
SSM_PREFIX=/myapp/production/
```

You can execute it with `npx`:

```sh
npx dotenv-ssm
```

Or, if you have it installed as a binary:

```sh
dotenv-ssm
```

Or as part of an npm script:

```json
{
  "name": "example",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "ssm-secrets": "dotenv-ssm"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv-ssm": "^1.0.0"
  }
}
```

## Installation

```sh
# npm
npm i dotenv-ssm

# yarn
yarn add dotenv-ssm
```

## Licence

MIT
