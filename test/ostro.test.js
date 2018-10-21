/* Copyright (c) 2018 Richard Rodger and other contributors, MIT License */
'use strict'

var Ostro = require('..')

var Code = require('code')
var Lab = require('lab')

var lab = (exports.lab = Lab.script())
var expect = Code.expect

lab.experiment('ostro', () => {
  lab.test('happy', async () => {
    const ostro = require('..')
    const out = await ostro({
      prefix: 'foo'
    })
    expect(out.prefix).equal('foo')
  })
})
