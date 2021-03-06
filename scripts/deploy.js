const AWS = require("aws-sdk");
const dotEnv = require("dotenv");
const fs = require("fs");
const path = require("path");
const exec = require("./lib/exec");
const zipDirectory = require("./lib/zipDirectory");

const s3 = new AWS.S3();
const ebs = new AWS.ElasticBeanstalk();

const deployApp = async ({
  appName,
  envName,
  bucketName,
  version,
  envVars,
  source,
}) => {
  const appPackageFileName = `${appName}-${version}.zip`;
  const imageName = `${process.env.DOCKER_REPOSITORY}/${appName}:${version}`;

  console.log(`Building ${imageName}...`);

  await exec(`docker build ${source} -t ${imageName}`);
  await exec(`docker push ${imageName}`);

  const zipFile = await zipDirectory({
    imageName,
  });

  console.log("Uploading content...");

  await s3
    .upload({
      Bucket: bucketName,
      Key: appPackageFileName,
      Body: zipFile,
    })
    .promise();

  console.log("Creating version...");

  await ebs
    .createApplicationVersion({
      ApplicationName: appName,
      SourceBundle: {
        S3Bucket: bucketName,
        S3Key: appPackageFileName,
      },
      VersionLabel: version,
    })
    .promise();

  console.log("Updating environment...");

  await ebs
    .updateEnvironment({
      EnvironmentName: envName,
      VersionLabel: version,
      OptionSettings: envVars,
    })
    .promise();

  console.log(`${appName} deployed successfully.`);
};

const deploy = async () => {
  const version =
    process.env.VERSION || (await exec("git rev-parse --short HEAD"));
  const root = process.cwd();

  const envVars = dotEnv.parse(fs.readFileSync(path.resolve(root, ".env")));

  await deployApp({
    appName: process.env.AWS_EB_APP_NAME,
    envName: process.env.AWS_EB_ENV_NAME,
    bucketName: process.env.AWS_EB_BUCKET_NAME,
    envVars: Object.entries(envVars).map(([OptionName, Value]) => ({
      Namespace: "aws:elasticbeanstalk:application:environment",
      OptionName,
      Value,
    })),
    version,
    source: path.resolve(root, "src"),
  });
};

deploy();
