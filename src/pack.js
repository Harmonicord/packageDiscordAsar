import zlib from "zlib";
import fs from "fs";
import path from "path";
import tar from "tar";
import fse from 'fs-extra'
import glob from "glob";

import { calculate } from "./calculate.js";

const tmp = "./temp";
const out = "./output";

export async function pack(src) {

  if (fs.existsSync(tmp)) {
    fs.rmSync(tmp, { recursive: true, force: true })
    fs.mkdirSync(tmp)
  } else {
    fs.mkdirSync(tmp)
  }

  fs.mkdirSync(`${tmp}/files/`)

  fse.copySync(src, `${tmp}/files/`)

  if (fs.existsSync(`${tmp}/files/Squirrel.exe`)) {
    fs.rmSync(`${tmp}/files/Squirrel.exe`)
  }

  const files = glob.sync(`${tmp}/files/**`, {
    realpath: true,
    nodir: true,
    dot: true,
    nounique: true,
  })

  const json = calculate(files)

  fs.writeFileSync(`${tmp}/delta_manifest.json`, json, {
    flag: "w+",
    encoding: "utf-8",
  });
  const tarStream = tar.c({ cwd: tmp }, [
    "delta_manifest.json",
    "files",
  ]);
  const tarFileStream = fs.createWriteStream(`${out}/full.distro`);
  const br = zlib.createBrotliCompress();
  br.pipe(tarFileStream);
  tarStream.on("data", (chunk) => {
    br.write(chunk);
  });

};
