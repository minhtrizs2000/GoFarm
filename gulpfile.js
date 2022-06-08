// generated on 2020-05-29 using generator-webapp 4.0.0-5
// const port = argv.port || 9000;
// const { argv } = require("yargs");

const { watch } = require("gulp");
const fs = require("fs");
const path = require("path");

const esbuild = require("esbuild");

/**
 *------------------------ NEED TO DECLARE OPTION HERE ------------------------------------------
 */

const debounce = (func, wait) => {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

async function buildScripts(entryPoints) {
  let entryOnlyMinify = [];
  if (typeof entryPoints === "string") {
    entryPoints = [entryPoints];
  }

  entryPoints = entryPoints.filter((entry) => {
    return entry.includes(".min.js") ? (entryOnlyMinify.push(entry), false) : true;
  });

  // unminify
  let result = await esbuild.build({
    entryPoints,
    bundle: true,
    minify: false,
    legalComments: "inline",
    outdir: path.resolve(__dirname, "./", "theme/assets"),
  });

  if (result.errors.length) {
    console.error(result.error[0]);
    return;
  }

  // minify && source-map
  entryPoints = entryPoints.reduce((accu, value) => {
    accu[`${path.basename(value, ".js")}.min`] = value;
    return accu;
  }, {});
  entryOnlyMinify = entryOnlyMinify.reduce((accu, value) => {
    accu[`${path.basename(value, ".min.js")}.min`] = value;
    return accu;
  }, {});

  return esbuild
    .build({
      entryPoints: {
        ...entryPoints,
        ...entryOnlyMinify,
      },
      bundle: true,
      minify: true,
      legalComments: "inline",
      sourcemap: "external",
      outdir: path.resolve(__dirname, "./", "theme/assets"),
    })
    .then((result) => {
      if (result.errors.length) {
        console.error(result.error[0]);
      } else {
        return [
          Object.keys(entryPoints).map((entry) => {
            console.log(`${entry.split(".")[0]}: Finish`);
            return entry.split(".")[0];
          }),
          Object.keys(entryOnlyMinify).map((entry) => {
            console.log(`${entry.split(".")[0]}: Finish`);
            return path.basename(entry, ".min.js");
          }),
        ];
      }
    });
}

function scriptTask(filePath) {
  let fileName = path.basename(filePath, ".js");
  let sourceTree = JSON.parse(fs.readFileSync("./app.config.json"));

  buildScripts(
    Object.keys(sourceTree)
      .filter((item) => {
        return sourceTree[item].indexOf(fileName) != -1;
      })
      .map((item) => {
        return "./app/scripts/" + item + ".js";
      }),
  );
}

async function removeScript(filePath) {
  fs.unlinkSync("theme/assets/" + path.basename(filePath));
  console.log("Deleted " + path.basename(filePath));
}

async function startServer() {
  watch("./app/scripts/common/**/*.js").on("change", scriptTask);
  watch("./app/scripts/*.js").on("change", buildScripts);
  watch("./app/scripts/*.js").on("unlink", removeScript);
}

async function build() {
  buildScripts(
    fs
      .readdirSync("./app/scripts/", { withFileTypes: true })
      .filter((item) => !item.isDirectory())
      .map((item) => "./app/scripts/" + item.name),
  );
}

exports.serve = startServer;
exports.build = build;
