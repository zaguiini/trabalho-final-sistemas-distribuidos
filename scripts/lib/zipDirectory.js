const archiver = require("archiver");
const buffer = require("stream-buffers");
const fs = require("fs");
const path = require("path");

const getGitIgnoreEntries = ({ source }) => {
  const filePath = path.resolve(process.cwd(), ".gitignore");
  const gitIgnore = fs.readFileSync(filePath).toString();

  return gitIgnore
    .split(/\r?\n/)
    .filter((entry) => entry.startsWith(path.basename(source)));
};

const zipDirectory = ({ source }) => {
  const archive = archiver("zip", { zlib: { level: 9 } });
  const stream = new buffer.WritableStreamBuffer();

  return new Promise((resolve, reject) => {
    archive.glob("**/*", {
      cwd: source,
      ignore: getGitIgnoreEntries({ source }),
    });

    archive.on("error", (err) => reject(err)).pipe(stream);

    stream.on("close", () => resolve(stream.getContents()));

    archive.finalize();
  });
};

module.exports = zipDirectory;
