#!/usr/bin/env node
import { defineCommand, runMain, showUsage } from 'citty'
import pkgJson from '../package.json'

const main = defineCommand({
  meta: {
    name: pkgJson.name,
    version: pkgJson.version,
    description: pkgJson.description,
  },
  subCommands: {
    'init': () => import('./commands/init').then(r => r.default),
    'add': () => import('./commands/add').then(r => r.default),
    'commit': () => import('./commands/commit').then(r => r.default),
    'cat-file': () => import('./commands/cat-file').then(r => r.default),
  },
  async run(ctx) {
    if (!ctx.rawArgs.length) {
      await showUsage(ctx.cmd)
    }
  },
})

runMain(main)
