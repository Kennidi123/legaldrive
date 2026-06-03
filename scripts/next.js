#!/usr/bin/env node
/**
 * Wrapper para os comandos do Next.js (dev/build/start).
 *
 * Motivo: o Node >= 22 expõe um global `localStorage` (Web Storage experimental)
 * que o Next 15 tenta usar durante o SSR e quebra com
 * "localStorage.getItem is not a function" (acontece, por exemplo, no Node 25).
 * A flag `--no-experimental-webstorage` remove esse global e resolve o problema.
 *
 * A flag só é aplicada quando o Node em uso a reconhece, então em runtimes onde
 * ela não existe (ex.: Node 20 usado no Docker de produção) nada muda — o build
 * e o start continuam funcionando normalmente.
 */
const { spawn } = require('node:child_process')
const path = require('node:path')

const FLAG = '--no-experimental-webstorage'

if (process.allowedNodeEnvironmentFlags.has(FLAG)) {
  process.env.NODE_OPTIONS = [process.env.NODE_OPTIONS, FLAG].filter(Boolean).join(' ')
}

const nextBin = path.join(path.dirname(require.resolve('next/package.json')), 'dist', 'bin', 'next')

const child = spawn(process.execPath, [nextBin, ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
  } else {
    process.exit(code ?? 0)
  }
})
