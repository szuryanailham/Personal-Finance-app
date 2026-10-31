import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

// Exercise the TypeScript modules without adding a test framework dependency.
function load(file, dependencies, globals = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const exports = {}
  vm.runInNewContext(source, {
    exports, require: (name) => dependencies[name],
    setTimeout, AbortController, DOMException, ...globals,
  }, { filename: file })
  return exports
}

test('guidance API accepts direct and enveloped statuses and PATCHes true', async () => {
  const calls = []
  let response = { isGuidanceCompleted: false }
  const api = load('src/lib/api/guidance.ts', {
    './client': { apiRequest: async (...args) => { calls.push(args); return response } },
  })
  assert.equal((await api.fetchGuidanceStatus()).isGuidanceCompleted, false)
  assert.equal(calls[0][0], '/api/users/me')
  response = { data: { isGuidanceCompleted: true } }
  assert.equal((await api.fetchGuidanceStatus()).isGuidanceCompleted, true)
  response = { data: {} }
  await assert.rejects(api.fetchGuidanceStatus(), /tidak valid/)
  await api.completeGuidance()
  const [path, , options] = calls.at(-1)
  assert.equal(path, '/api/users/me/guidance')
  assert.equal(options.method, 'PATCH')
  assert.equal(options.body.isGuidanceCompleted, true)
})

function harness(mobile = false) {
  const instances = []
  const targets = new Map()
  const listeners = new Map()
  const location = { pathname: '/dashboard' }
  const node = () => ({
    style: {}, children: [], setAttribute() {}, focus() {},
    append(child) { this.children.push(child) }, replaceChildren() { this.children = [] },
  })
  const api = load('src/lib/guidance/runner.ts', {
    'driver.js': { driver(config) {
      const instance = {
        config, destroyed: false, getConfig() { return this.config },
        setConfig(value) { this.config = value }, destroy() { this.destroyed = true },
        highlight(step) {
          this.step = step
          this.popover = Object.fromEntries(['closeButton', 'footer', 'footerButtons', 'progress'].map(key => [key, node()]))
          config.onPopoverRender(this.popover)
        },
      }
      instances.push(instance)
      return instance
    } },
  }, {
    HTMLElement: class HTMLElement {},
    window: { location, matchMedia: query => ({ matches: mobile && query.includes('767px') }) },
    document: {
      addEventListener: (event, callback) => listeners.set(event, callback),
      removeEventListener: event => listeners.delete(event),
      querySelector: () => ({}),
      querySelectorAll: selector => targets.get(selector) ?? [],
      createElement: node,
    },
    getComputedStyle: element => ({ visibility: element.hidden ? 'hidden' : 'visible' }),
  })
  let completed = 0
  const errors = []
  const runner = api.createTutorialRunner({
    steps: [
      { path: '/category', target: 'category', title: 'Category', description: '' },
      { path: '/dashboard', title: 'Done', description: '' },
    ],
    navigate: path => { location.pathname = path },
    onFinish: () => completed++, onError: error => errors.push(error), onLoading() {},
  })
  const visible = { getClientRects: () => [1], getAttribute: () => null }
  targets.set('[data-guidance="category"]', [{ ...visible, hidden: true }, visible])
  return { ...api, instances, runner, location, visible, errors, listeners, completed: () => completed }
}
const settle = () => new Promise(resolve => setImmediate(resolve))

test('route-aware tutorial uses visible targets, keyboard navigation, and one completion', async () => {
  const h = harness()
  h.runner.start()
  await settle()
  assert.equal(h.location.pathname, '/category')
  assert.equal(h.instances[0].step.element, h.visible)
  h.listeners.get("keyup")({ key: "ArrowRight", target: null, preventDefault() {}, stopImmediatePropagation() {} })
  await settle()
  assert.equal(h.instances[0].destroyed, true)
  assert.equal(h.location.pathname, '/dashboard')
  h.listeners.get("keyup")({ key: "ArrowLeft", target: null, preventDefault() {}, stopImmediatePropagation() {} })
  await settle()
  assert.equal(h.location.pathname, '/category')
  h.runner.skip()
  h.runner.skip()
  assert.equal(h.completed(), 1)
  assert.equal(h.instances.at(-1).destroyed, true)
  assert.equal(h.errors.length, 0)
})

test('destroying while a target is pending cancels without completing onboarding', async () => {
  const h = harness()
  h.runner.start()
  h.runner.destroy()
  await settle()
  assert.equal(h.instances.length, 0)
  assert.equal(h.completed(), 0)
  assert.equal(h.errors.length, 0)
})

test('mobile controls finish and close the Driver instance', async () => {
  const h = harness(true)
  h.runner.start()
  await settle()
  h.instances[0].config.onNextClick()
  await settle()
  const last = h.instances.at(-1)
  const finish = last.popover.footerButtons.children.find(button => button.textContent === 'Selesai')
  finish.onclick()
  assert.equal(h.completed(), 1)
  assert.equal(last.destroyed, true)
})

test('all seven tutorials stay available; automatic steps exclude import/export', () => {
  const { TUTORIALS } = load('src/lib/guidance/tutorials.ts', {})
  assert.equal(Object.keys(TUTORIALS).length, 7)
  assert.equal(TUTORIALS.initial.steps.length, 6)
  assert.equal(TUTORIALS.initial.steps.some(step => /import|export/.test(step.target ?? '')), false)
  assert.equal(TUTORIALS.transfer.steps[0].mobilePath, '/import')
  assert.equal(TUTORIALS.transfer.steps[1].mobilePath, '/export')
})
