import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import process from 'node:process'
import { defineCommand } from 'citty'
import { compress } from 'zstd-napi'
import getHead from '../utils/get-head.ts'
import getSHA1 from '../utils/get-sha1.ts'
import parseIndex from '../utils/parse-index.ts'

export default defineCommand({
  meta: {
    name: 'commit',
    description: 'Record changes to the repository',
  },
  args: {
    message: {
      type: 'string',
      description: 'Use the given <msg> as the commit message. If multiple -m options are given, their values are concatenated as separate paragraphs.',
      alias: 'm',
      required: true,
    },
  },
  run({ args }) {
    const indexContent = parseIndex()
    if (!indexContent) {
      console.log('use "git-js add" to track')
    }
    else {
      const tree = {
        type: 'tree',
        metadata: indexContent,
      }

      const contentStr = JSON.stringify(tree)
      const treeSha = getSHA1(contentStr)

      const dir = `${process.cwd()}/.git-js/objects/${treeSha.substring(0, 2)}`
      const filename = `${dir}/${treeSha.substring(2)}`
      const content = compress(Buffer.from(contentStr))

      try {
        fs.mkdirSync(dir, {
          recursive: true,
        })
      }
      catch {}

      fs.writeFileSync(filename, content)

      console.log('tree object write success')

      let parentHash = null
      try {
        parentHash = fs.readFileSync(getHead().fullPath, 'utf-8')
      }
      catch {}

      const commitObj = {
        type: 'commit',
        tree: treeSha,
        time: Date.now(),
        message: args.message,
        parent: parentHash,
      }

      const commitStr = JSON.stringify(commitObj)
      const commitSha = getSHA1(commitStr)

      const commitDir = `${process.cwd()}/.git-js/objects/${commitSha.substring(0, 2)}`
      const commitObjFilename = `${commitDir}/${commitSha.substring(2)}`
      const zipContent = compress(Buffer.from(commitStr))

      try {
        fs.mkdirSync(commitDir, {
          recursive: true,
        })
      }
      catch {}

      fs.writeFileSync(commitObjFilename, zipContent)

      console.log('commit object write success')

      fs.writeFileSync(getHead().fullPath, commitSha)

      fs.rmSync(`${process.cwd()}/.git-js/index`)
    }
  },
})
