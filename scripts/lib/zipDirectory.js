const archiver = require("archiver");
const buffer = require("stream-buffers");

const zipDirectory = ({ source }) => {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = new buffer.WritableStreamBuffer();

  return new Promise((resolve, reject) => {
    archive.glob("**/*", {
      cwd: source,
    });

    archive.on("error", (err) => reject(err)).pipe(stream);

    stream.on("close", () => resolve(stream.getContents()));

    archive.finalize();
  });
};

module.exports = zipDirectory;
