#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const getenv = require("getenv");
const AWS = require("aws-sdk");

const SSM_PREFIX = getenv("SSM_PREFIX");

const awsCfg = {
  accessKeyId: getenv("AWS_ACCESS_KEY_ID"),
  secretAccessKey: getenv("AWS_SECRET_ACCESS_KEY"),
  region: getenv("AWS_REGION"),
};

const ssm = new AWS.SSM(awsCfg);

console.log(`Fetching envs from ${awsCfg.region}`);
generateSSMDotenv()
  .then(() => {
    console.log(`Done.`);
  })
  .catch((err) => {
    console.error(err);
  });

async function generateSSMDotenv() {
  const query = {
    Path: SSM_PREFIX,
    Recursive: true,
    WithDecryption: true,
  };

  const params = await (async function getParams(PrevToken) {
    const result = await ssm
      .getParametersByPath(
        PrevToken ? { ...query, NextToken: PrevToken } : query
      )
      .promise();

    const { Parameters, NextToken } = result;
    if (!NextToken) {
      return Parameters;
    }

    return Parameters.concat(await getParams(NextToken));
  })();

  const dotenvWriteStream = fs.createWriteStream(path.resolve(".env"));
  let first = true;
  for (const { Name, Value } of params.sort((p1, p2) =>
    p1.Name.localeCompare(p2.Name)
  )) {
    if (!first) {
      dotenvWriteStream.write("\n");
    } else {
      first = false;
    }
    const env = Name.replace(SSM_PREFIX, "");
    // environment variables always overwrite default values
    if (process.env[env]) {
      console.log(
        `skipping ssm var ${env} because it already exists in the env`
      );
      dotenvWriteStream.write(`${env}=${process.env[env]}`);
    } else {
      dotenvWriteStream.write(`${env}=${Value}`);
    }
  }
}
