/* Copyright (c) 2018 Richard Rodger and other contributors, MIT License */
'use strict'

const Ostro = require('..')

const Code = require('code')
const Lab = require('lab')

const lab = (exports.lab = Lab.script())
const expect = Code.expect

lab.experiment('ostro', () => {
  lab.test('happy', async () => {
    const ostro = require('..')
    const out = await ostro({
      prefix: 'foo',
      folder: __dirname+'/red',
      text: {
        html: ''
      }
    })
    expect(out.prefix).equal('foo')
    //console.log(out)
  }),

  lab.test('process_text', async () => {
    const ostro = require('..')
    const text = await ostro.intern.process_text(__dirname+'/red','f0','txt')
    expect(text).equal('t0\n')
  })

  lab.test('parse_text', async () => {
    const ostro = require('..')
    const out = await ostro.intern.parse_text(`
aaa <~INCLUDE foo~> bbb <~INCLUDE bar~> ccc
`)

    expect(out).equal([
      { kind:'include', directive: '<~INCLUDE foo~>', file: 'foo', index: 5 },
      { kind:'include', directive: '<~INCLUDE bar~>', file: 'bar', index: 25 } ])
  })

  lab.test('process_directives', async () => {
    const ostro = require('..')
    var text = `
aaa <~INCLUDE foo~> bbb <~INCLUDE bar~> ccc
`
    const directives = await ostro.intern.parse_text(text)
    text = await ostro.intern.
      process_directives(__dirname+'/green','f1','html',text,directives)

    console.log(text)
  })
})
