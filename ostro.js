/* MIT License. Copyright (c) 2018, Richard Rodger and other contributors. */
'use strict'

const Util = require('util')
const Fs = require('fs')

const read_file = Util.promisify(Fs.readFile)


module.exports = ostro

function ostro(spec) {

  return work(spec)

  async function work(spec) {
    const folder = spec.folder
    const prefix = spec.prefix

    const text_files = Object.keys(spec.text)
    for(var i = 0; i < text_files.length; i++) {
      var suffix = text_files[i]
      var text = await intern.process_text(folder, prefix, suffix)
      spec.text[suffix] = null == text ? spec.text[suffix] : text
    }
    
    return new Promise((res,rej)=>{
      setTimeout(()=>{res(spec)},100)
    })
  }
}


const intern = module.exports.intern = {
  process_text: async function(folder,prefix,suffix) {
    const path = folder+'/'+prefix+'.'+suffix

    var text = null

    try {
      text = (await read_file(path)).toString()
    }
    catch(e) {
      // TODO:not fatal, but should be captured
      console.log(e)
    }

    if(null != text) {
      const directives = intern.parse_text(text)
      text = intern.process_directives(folder,prefix,suffix,text,directives)
    }
    
    return text
  },

  process_directives: async function(folder,prefix,suffix,text,directives) {
    const tokens = []
    var last = 0
    
    for(var i = 0; i < directives.length; i++) {
      var directive = directives[i]

      tokens.push({
        kind: 'text',
        text: text.substring(last,directive.index),
        folder: folder,
        prefix: prefix,
        suffix: suffix
      })

      directive.text = ''
      directive.folder = folder,
      directive.prefix = prefix,
      directive.suffix = suffix
      tokens.push(directive)

      last = directive.index + directive.directive.length
    }

    if( last < text.length ) {
      tokens.push({
        kind: 'text',
        text: text.substring(last)
      })
    }

    for(var i = 0; i < tokens.length; i++) {
      var token = tokens[i]
      await intern['directive_'+token.kind](token, i, tokens)
    }

    return tokens.map(x=>x.text).join('')
  },
  
  directive_text: async function(token, i, tokens) {
    // no-op
  },

  directive_include: async function(token, i, tokens) {
    tokens[i].text = '***'
  },

  parse_text: function(text) {
    const out = []
    const include_re = /<~\s*INCLUDE\s+(.*?)\s*~>/g
    
    var m = null
    while( m = include_re.exec(text) ) {
      out.push({
        kind: 'include',
        directive: m[0],
        file: m[1],
        index: m.index
      })
    }

    return out
  }
}



