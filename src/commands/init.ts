import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineCommand } from 'citty'

export default defineCommand({
  meta: {
    name: 'init',
    description: 'Create an empty Git repository or reinitialize an existing one',
  },
  args: {
    'quiet': {
      type: 'boolean',
      description: 'Only print error and warning messages; all other output will be suppressed.',
      alias: 'q',
    },
    'initial-branch': {
      type: 'string',
      description: 'Use <branch-name> for the initial branch in the newly created repository. If not specified, fall back to the default name (currently master, but this is subject to change in the future; the name can be customized via the init.defaultBranch configuration variable).',
      alias: 'b',
    },
  },
  run({ args }) {
    const projectDir = process.cwd()
    const isExist = fs.existsSync(`${projectDir}/.git-js`)
    const gitDir = `${path.join(projectDir, '.git-js/').replace(/\\/g, '/')}`
    if (isExist) {
      if (args.quiet) {
        return
      }
      console.log(`Reinitialized existing Git-JS repository in ${gitDir}`)
      return
    }
    [
      `${projectDir}/.git-js`,
      `${projectDir}/.git-js/objects`,
      `${projectDir}/.git-js/refs`,
      `${projectDir}/.git-js/refs/heads`,
    ].forEach((dir) => {
      fs.mkdirSync(dir, {
        recursive: true,
      })
    })
    const initialBranch = args['initial-branch'] || 'master'
    fs.writeFileSync(`${projectDir}/.git-js/HEAD`, `ref: refs/heads/${initialBranch}`)
    if (!args.quiet) {
      console.log(`Initialized empty Git-JS repository in ${gitDir}`)
    }
  },
})
