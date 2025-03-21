import fs from 'node:fs'
import zlib from 'node:zlib'
import process from 'node:process'
import { decompress } from 'zstd-napi'

export default function parseIndex() {
  try {
    const content = fs.readFileSync(`${process.cwd()}/.git-js/index`)

    const res = decompress(content)
    return JSON.parse(res.toString())
  }
  catch {
    // console.log(e)
    return null
  }
}
