const AdmZip = require("adm-zip");

const zipDirectory = ({ imageName }) => {
  return new Promise((resolve) => {
    const zip = new AdmZip();

    const content = JSON.stringify({
      AWSEBDockerrunVersion: "1",
      Image: {
        Name: imageName,
      },
      Ports: [
        {
          ContainerPort: "80",
        },
      ],
    });

    zip.addFile("Dockerrun.aws.json", Buffer.alloc(content.length, content));

    const buffer = zip.toBuffer();

    resolve(buffer);
  });
};

module.exports = zipDirectory;
