const AWS = require("aws-sdk");
const pkgDir = require("pkg-dir");
const path = require("path");
const zipDirectory = require("./lib/zipDirectory");
const exec = require("./lib/exec");

const s3 = new AWS.S3();
const ebs = new AWS.ElasticBeanstalk();

const deployApp = async ({ appName, envName, bucketName, version, source }) => {
  const appPackageFileName = `${appName}-${version}.zip`;

  console.log(`Zipping content for ${appName}...`);

  const zipFile = await zipDirectory({
    source,
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
    })
    .promise();

  console.log(`${appName} deployed successfully.`);
};

const deploy = async () => {
  const version = await exec("git rev-parse --short HEAD");
  const root = await pkgDir();

  await deployApp({
    appName: process.env.AWS_EB_APP_NAME,
    envName: process.env.AWS_EB_ENV_NAME,
    bucketName: process.env.AWS_EB_BUCKET_NAME,
    version,
    source: path.resolve(root, "src"),
  });
};

deploy();
