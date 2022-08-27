import electronInstaller from "electron-winstaller";
import packager from "electron-packager";
import fs from "fs";
import fse from "fs-extra";
import path from "path";

import { pack } from "./pack.js";

const version = JSON.parse(fs.readFileSync('./appData/resources/build_info.json'))['version']

await packager({
  dir: './',
  prebuiltAsar: "./input/app.asar",
  out: "./output/unpacked",
  platform: ["win32"],
  arch: ["ia32"],
  appVersion: version,
  name: "harmonicord",
  icon: "./appData/app.ico",
});

const folders = fs.readdirSync('./output/unpacked/', { withFileTypes: true}).filter((dirent) => dirent.isDirectory()).map((dirent) => path.join('./output/unpacked/', dirent.name));

for (const folder of folders) {
  fse.copySync('./appData/swiftshader', path.join(folder, "swiftshader"));
  if (fs.existsSync(path.join(folder, "contents", "resources"))) {
    fse.copySync('./appData/resources', path.join(folder, "contents", "resources"));
  } else {
    fse.copySync('./appData/resources', path.join(folder, "resources"));
  }
  fs.copyFileSync('./appData/app.ico', path.join(folder, "app.ico"));
  // fs.copyFileSync('./appData/updater.node', path.join(folder, "updater.node"));
}

try {
  await electronInstaller.createWindowsInstaller({
    appDirectory: "./output/unpacked/Harmonicord-win32-ia32/",
    outputDirectory: "./output/packed/win32",
    authors: "Harmonicord",
    exe: "Harmonicord.exe",
    version: version,
    description: "lol",
    title: "harmonicord",
    name: "harmonicord",
    noDelta: true,
    noMsi: true,
    setupIcon: "./appData/app.ico",
  });
  console.log("It worked!");
} catch (e) {
  console.log(`No dice: ${e.message}`);
}

pack("./output/unpacked/Harmonicord-win32-ia32/");
