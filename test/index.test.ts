import { Buffer } from 'node:buffer'
import { describe, expect, it } from 'vitest'
import * as zstd from 'zstd-napi'

describe('git-js', () => {
  it('test zstd', () => {
    const str = 'hello world'
    const compressData = zstd.compress(Buffer.from(str), {
      compressionLevel: 9,
    })
    const decompressData = zstd.decompress(compressData)
    expect(decompressData.toString()).toBe(str)
  })
})
