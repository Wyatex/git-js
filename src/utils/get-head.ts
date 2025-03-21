import fs from 'node:fs'
import process from 'node:process'

export default function getHead() {
  const content = fs.readFileSync(`${process.cwd()}/.git-js/HEAD`, 'utf-8')

  const refPath = content.split(':')[1]!.trim()

  const refPathArr = refPath.split('/')
  const curBranch = refPathArr[refPathArr.length - 1]
  return {
    curBranch,
    fullPath: `${process.cwd()}/.git-js/${refPath}`,
  }
}
