import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

run();

function run() {
  buildAllPackages();
  return;
}

function getPackageAbsPath(packageName) {
  return path.resolve('packages', packageName)
}

function getPackageJson(packageName) {
  const packagePath = getPackageAbsPath(packageName);
  try {
    const pkg = fs.readFileSync(path.resolve(packagePath, 'package.json'), {
      encoding: 'utf-8'
    })
    return JSON.parse(pkg)
  } catch (e) {
    console.error(e)
    return {}
  }
}

function getProjectsList() {
  const packages = fs.readdirSync(path.resolve('packages'));
  return packages.filter((value) => {
    return !getPackageJson(value).private
  })
}

function generateCommand(command, options) {
  return `${command} ${options.join(' ')}`

}

function buildAllPackages() {
  const projects = getProjectsList()
  for (const packageName of projects) {
    console.log(packageName);
    execSync(
      generateCommand(
        'rollup',
        [
          '-c',
          '--environment',
          [
            `TARGET:${packageName}`
          ].filter(Boolean).join(',')
        ],
      )
    )
  }
}