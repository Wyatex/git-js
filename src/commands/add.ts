import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import process from 'node:process'
import { defineCommand } from 'citty'
import { globby } from 'globby'
import { compress } from 'zstd-napi'
import getSHA1 from '../utils/get-sha1.ts'

export default defineCommand({
  meta: {
    name: 'add',
    description: 'Add file contents to the index',
  },
  args: {
    file: {
      type: 'positional',
      description: 'File to add',
      required: true,
    },
  },
  async run({ args }) {
    const files = await globby(args.file, {
      cwd: process.cwd(),
      gitignore: true,
    })
    const blobs = {} as Record<string, {
      metaData: {
        type: string
        length: number
        content: Buffer
      }
      SHA1: string
    }>
    files.forEach((item) => {
      const content = fs.readFileSync(item)
      const metaData = {
        type: 'blob',
        length: content.length,
        content,
      }

      blobs[item] = {
        metaData,
        SHA1: getSHA1(JSON.stringify(metaData)),
      }
    })

    const blobsWithoutContent = {} as Record<string, {
      SHA1: string
    }>

    for (const key in blobs) {
      blobsWithoutContent[key] = {
        SHA1: blobs[key]!.SHA1,
      }
    }

    // 原文用gzip，这里换成用zstd压缩一下
    const indexContent = compress(Buffer.from(JSON.stringify(blobsWithoutContent)))
    fs.writeFileSync(`${process.cwd()}/.git-js/index`, indexContent)

    console.log('Index write succeeded.')

    for (const item in blobs) {
      const dir = `${process.cwd()}/.git-js/objects/${blobs[item]!.SHA1.substring(0, 2)}`
      const filename = `${dir}/${blobs[item]!.SHA1.substring(2)}`

      try {
        fs.mkdirSync(dir)
      }
      catch {
      }

      const content = compress(Buffer.from(JSON.stringify(blobs[item]!.metaData)))

      fs.writeFileSync(filename, content)
    }

    console.log('Blob write succeeded')
  },
})
