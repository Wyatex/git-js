import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import process from 'node:process'
import { defineCommand, showUsage } from 'citty'
import { decompress } from 'zstd-napi'

export default defineCommand({
  meta: {
    name: 'cat-file',
    description: 'Provide contents or details of repository objects',
  },
  args: {
    print: {
      type: 'boolean',
      description: 'Pretty-print the contents of <object> based on its type.',
      alias: 'p',
    },
    type: {
      type: 'boolean',
      description: 'Instead of the content, show the object type identified by <object>.',
      alias: 't',
    },
    object: {
      type: 'positional',
      description: 'The name of the object to show. For a more complete list of ways to spell object names, see the "SPECIFYING REVISIONS" section in gitrevisions(7).',
      required: true,
    },
  },
  run({ args, cmd }) {
    if (!args.type && !args.print) {
      return showUsage(cmd)
    }
    const dir = args.object.slice(0, 2)
    const filename = args.object.slice(2)

    const filePath = `${process.cwd()}/.git-js/objects/${dir}/${filename}`

    const compressedContent = fs.readFileSync(filePath)
    const content = decompress(compressedContent)
    const obj = JSON.parse(content.toString())
    if (args.type) {
      console.log(obj.type)
    }
    else {
      switch (obj.type) {
        case 'blob':
          console.log(Buffer.from(obj.content.data).toString('utf-8'))
          break
        case 'tree':
          console.log(obj.metadata)
          break
        case 'commit':
          console.log(obj.tree)
          break
      }
    }
  },
})
