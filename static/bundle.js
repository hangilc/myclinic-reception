/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Wqueue = __webpack_require__(1);
	var service = __webpack_require__(7);
	var conti = __webpack_require__(11);

	document.getElementById("update-wqueue-button").addEventListener("click", function(){
		var dom = document.getElementById("wqueue-table");
		var wqueue;
		conti.exec([
			function(done){
				service.listFullWqueue(function(err, result){
					if( err ){
						done(err);
						return;
					}
					wqueue = result;
					done();
				});
			}
		], function(err){
			if( err ){
				alert(err);
				return;
			}
			Wqueue.render(dom, wqueue);
		});
	});



/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var hogan = __webpack_require__(2);
	var tmplSrc = __webpack_require__(5);
	var tmpl = hogan.compile(tmplSrc);
	var mConsts = __webpack_require__(6);

	exports.render = function(dom, wqueue){
		var list = wqueue.map(function(wq){
			return {
				state_as_alpha: wqueueStateToAlpha(wq.wait_state),
				state_as_kanji: wqueueStateToKanji(wq.wait_state),
				patient_id_rep: padNumber(wq.patient_id),
				last_name: wq.last_name,
				first_name: wq.first_name,	
				last_name_yomi: wq.last_name_yomi,
				first_name_yomi: wq.first_name_yomi,	
				visit_id: wq.visit_id
			};
		});
		dom.innerHTML = tmpl.render({ list: list });
	};

	function padNumber(num){
		return ("0000" + num).substr(-4);
	}

	function wqueueStateToKanji(wqState){
		switch(wqState){
			case mConsts.WqueueStateWaitExam: return "診待";
			case mConsts.WqueueStateInExam: return "診中";
			case mConsts.WqueueStateWaitCashier: return "会待";
			case mConsts.WqueueStateWaitDrug: return "薬待";
			case mConsts.WqueueStateWaitReExam: return "再待";
			case mConsts.WqueueStateWaitAppoint: return "予待";
			default: return "不明";
		}
	};

	function wqueueStateToAlpha(wqState){
		switch(wqState){
			case mConsts.WqueueStateWaitExam: return "wait-exam";
			case mConsts.WqueueStateInExam: return "in-exam";
			case mConsts.WqueueStateWaitCashier: return "wait-cashier";
			case mConsts.WqueueStateWaitDrug: return "wait-drug";
			case mConsts.WqueueStateWaitReExam: return "wait-re-exam";
			case mConsts.WqueueStateWaitAppoint: return "wait-appointed-exam";
			default: return "unknown";
		}
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	// This file is for use with Node.js. See dist/ for browser files.

	var Hogan = __webpack_require__(3);
	Hogan.Template = __webpack_require__(4).Template;
	Hogan.template = Hogan.Template;
	module.exports = Hogan;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	(function (Hogan) {
	  // Setup regex  assignments
	  // remove whitespace according to Mustache spec
	  var rIsWhitespace = /\S/,
	      rQuot = /\"/g,
	      rNewline =  /\n/g,
	      rCr = /\r/g,
	      rSlash = /\\/g,
	      rLineSep = /\u2028/,
	      rParagraphSep = /\u2029/;

	  Hogan.tags = {
	    '#': 1, '^': 2, '<': 3, '$': 4,
	    '/': 5, '!': 6, '>': 7, '=': 8, '_v': 9,
	    '{': 10, '&': 11, '_t': 12
	  };

	  Hogan.scan = function scan(text, delimiters) {
	    var len = text.length,
	        IN_TEXT = 0,
	        IN_TAG_TYPE = 1,
	        IN_TAG = 2,
	        state = IN_TEXT,
	        tagType = null,
	        tag = null,
	        buf = '',
	        tokens = [],
	        seenTag = false,
	        i = 0,
	        lineStart = 0,
	        otag = '{{',
	        ctag = '}}';

	    function addBuf() {
	      if (buf.length > 0) {
	        tokens.push({tag: '_t', text: new String(buf)});
	        buf = '';
	      }
	    }

	    function lineIsWhitespace() {
	      var isAllWhitespace = true;
	      for (var j = lineStart; j < tokens.length; j++) {
	        isAllWhitespace =
	          (Hogan.tags[tokens[j].tag] < Hogan.tags['_v']) ||
	          (tokens[j].tag == '_t' && tokens[j].text.match(rIsWhitespace) === null);
	        if (!isAllWhitespace) {
	          return false;
	        }
	      }

	      return isAllWhitespace;
	    }

	    function filterLine(haveSeenTag, noNewLine) {
	      addBuf();

	      if (haveSeenTag && lineIsWhitespace()) {
	        for (var j = lineStart, next; j < tokens.length; j++) {
	          if (tokens[j].text) {
	            if ((next = tokens[j+1]) && next.tag == '>') {
	              // set indent to token value
	              next.indent = tokens[j].text.toString()
	            }
	            tokens.splice(j, 1);
	          }
	        }
	      } else if (!noNewLine) {
	        tokens.push({tag:'\n'});
	      }

	      seenTag = false;
	      lineStart = tokens.length;
	    }

	    function changeDelimiters(text, index) {
	      var close = '=' + ctag,
	          closeIndex = text.indexOf(close, index),
	          delimiters = trim(
	            text.substring(text.indexOf('=', index) + 1, closeIndex)
	          ).split(' ');

	      otag = delimiters[0];
	      ctag = delimiters[delimiters.length - 1];

	      return closeIndex + close.length - 1;
	    }

	    if (delimiters) {
	      delimiters = delimiters.split(' ');
	      otag = delimiters[0];
	      ctag = delimiters[1];
	    }

	    for (i = 0; i < len; i++) {
	      if (state == IN_TEXT) {
	        if (tagChange(otag, text, i)) {
	          --i;
	          addBuf();
	          state = IN_TAG_TYPE;
	        } else {
	          if (text.charAt(i) == '\n') {
	            filterLine(seenTag);
	          } else {
	            buf += text.charAt(i);
	          }
	        }
	      } else if (state == IN_TAG_TYPE) {
	        i += otag.length - 1;
	        tag = Hogan.tags[text.charAt(i + 1)];
	        tagType = tag ? text.charAt(i + 1) : '_v';
	        if (tagType == '=') {
	          i = changeDelimiters(text, i);
	          state = IN_TEXT;
	        } else {
	          if (tag) {
	            i++;
	          }
	          state = IN_TAG;
	        }
	        seenTag = i;
	      } else {
	        if (tagChange(ctag, text, i)) {
	          tokens.push({tag: tagType, n: trim(buf), otag: otag, ctag: ctag,
	                       i: (tagType == '/') ? seenTag - otag.length : i + ctag.length});
	          buf = '';
	          i += ctag.length - 1;
	          state = IN_TEXT;
	          if (tagType == '{') {
	            if (ctag == '}}') {
	              i++;
	            } else {
	              cleanTripleStache(tokens[tokens.length - 1]);
	            }
	          }
	        } else {
	          buf += text.charAt(i);
	        }
	      }
	    }

	    filterLine(seenTag, true);

	    return tokens;
	  }

	  function cleanTripleStache(token) {
	    if (token.n.substr(token.n.length - 1) === '}') {
	      token.n = token.n.substring(0, token.n.length - 1);
	    }
	  }

	  function trim(s) {
	    if (s.trim) {
	      return s.trim();
	    }

	    return s.replace(/^\s*|\s*$/g, '');
	  }

	  function tagChange(tag, text, index) {
	    if (text.charAt(index) != tag.charAt(0)) {
	      return false;
	    }

	    for (var i = 1, l = tag.length; i < l; i++) {
	      if (text.charAt(index + i) != tag.charAt(i)) {
	        return false;
	      }
	    }

	    return true;
	  }

	  // the tags allowed inside super templates
	  var allowedInSuper = {'_t': true, '\n': true, '$': true, '/': true};

	  function buildTree(tokens, kind, stack, customTags) {
	    var instructions = [],
	        opener = null,
	        tail = null,
	        token = null;

	    tail = stack[stack.length - 1];

	    while (tokens.length > 0) {
	      token = tokens.shift();

	      if (tail && tail.tag == '<' && !(token.tag in allowedInSuper)) {
	        throw new Error('Illegal content in < super tag.');
	      }

	      if (Hogan.tags[token.tag] <= Hogan.tags['$'] || isOpener(token, customTags)) {
	        stack.push(token);
	        token.nodes = buildTree(tokens, token.tag, stack, customTags);
	      } else if (token.tag == '/') {
	        if (stack.length === 0) {
	          throw new Error('Closing tag without opener: /' + token.n);
	        }
	        opener = stack.pop();
	        if (token.n != opener.n && !isCloser(token.n, opener.n, customTags)) {
	          throw new Error('Nesting error: ' + opener.n + ' vs. ' + token.n);
	        }
	        opener.end = token.i;
	        return instructions;
	      } else if (token.tag == '\n') {
	        token.last = (tokens.length == 0) || (tokens[0].tag == '\n');
	      }

	      instructions.push(token);
	    }

	    if (stack.length > 0) {
	      throw new Error('missing closing tag: ' + stack.pop().n);
	    }

	    return instructions;
	  }

	  function isOpener(token, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].o == token.n) {
	        token.tag = '#';
	        return true;
	      }
	    }
	  }

	  function isCloser(close, open, tags) {
	    for (var i = 0, l = tags.length; i < l; i++) {
	      if (tags[i].c == close && tags[i].o == open) {
	        return true;
	      }
	    }
	  }

	  function stringifySubstitutions(obj) {
	    var items = [];
	    for (var key in obj) {
	      items.push('"' + esc(key) + '": function(c,p,t,i) {' + obj[key] + '}');
	    }
	    return "{ " + items.join(",") + " }";
	  }

	  function stringifyPartials(codeObj) {
	    var partials = [];
	    for (var key in codeObj.partials) {
	      partials.push('"' + esc(key) + '":{name:"' + esc(codeObj.partials[key].name) + '", ' + stringifyPartials(codeObj.partials[key]) + "}");
	    }
	    return "partials: {" + partials.join(",") + "}, subs: " + stringifySubstitutions(codeObj.subs);
	  }

	  Hogan.stringify = function(codeObj, text, options) {
	    return "{code: function (c,p,i) { " + Hogan.wrapMain(codeObj.code) + " }," + stringifyPartials(codeObj) +  "}";
	  }

	  var serialNo = 0;
	  Hogan.generate = function(tree, text, options) {
	    serialNo = 0;
	    var context = { code: '', subs: {}, partials: {} };
	    Hogan.walk(tree, context);

	    if (options.asString) {
	      return this.stringify(context, text, options);
	    }

	    return this.makeTemplate(context, text, options);
	  }

	  Hogan.wrapMain = function(code) {
	    return 'var t=this;t.b(i=i||"");' + code + 'return t.fl();';
	  }

	  Hogan.template = Hogan.Template;

	  Hogan.makeTemplate = function(codeObj, text, options) {
	    var template = this.makePartials(codeObj);
	    template.code = new Function('c', 'p', 'i', this.wrapMain(codeObj.code));
	    return new this.template(template, text, this, options);
	  }

	  Hogan.makePartials = function(codeObj) {
	    var key, template = {subs: {}, partials: codeObj.partials, name: codeObj.name};
	    for (key in template.partials) {
	      template.partials[key] = this.makePartials(template.partials[key]);
	    }
	    for (key in codeObj.subs) {
	      template.subs[key] = new Function('c', 'p', 't', 'i', codeObj.subs[key]);
	    }
	    return template;
	  }

	  function esc(s) {
	    return s.replace(rSlash, '\\\\')
	            .replace(rQuot, '\\\"')
	            .replace(rNewline, '\\n')
	            .replace(rCr, '\\r')
	            .replace(rLineSep, '\\u2028')
	            .replace(rParagraphSep, '\\u2029');
	  }

	  function chooseMethod(s) {
	    return (~s.indexOf('.')) ? 'd' : 'f';
	  }

	  function createPartial(node, context) {
	    var prefix = "<" + (context.prefix || "");
	    var sym = prefix + node.n + serialNo++;
	    context.partials[sym] = {name: node.n, partials: {}};
	    context.code += 't.b(t.rp("' +  esc(sym) + '",c,p,"' + (node.indent || '') + '"));';
	    return sym;
	  }

	  Hogan.codegen = {
	    '#': function(node, context) {
	      context.code += 'if(t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),' +
	                      'c,p,0,' + node.i + ',' + node.end + ',"' + node.otag + " " + node.ctag + '")){' +
	                      't.rs(c,p,' + 'function(c,p,t){';
	      Hogan.walk(node.nodes, context);
	      context.code += '});c.pop();}';
	    },

	    '^': function(node, context) {
	      context.code += 'if(!t.s(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,1),c,p,1,0,0,"")){';
	      Hogan.walk(node.nodes, context);
	      context.code += '};';
	    },

	    '>': createPartial,
	    '<': function(node, context) {
	      var ctx = {partials: {}, code: '', subs: {}, inPartial: true};
	      Hogan.walk(node.nodes, ctx);
	      var template = context.partials[createPartial(node, context)];
	      template.subs = ctx.subs;
	      template.partials = ctx.partials;
	    },

	    '$': function(node, context) {
	      var ctx = {subs: {}, code: '', partials: context.partials, prefix: node.n};
	      Hogan.walk(node.nodes, ctx);
	      context.subs[node.n] = ctx.code;
	      if (!context.inPartial) {
	        context.code += 't.sub("' + esc(node.n) + '",c,p,i);';
	      }
	    },

	    '\n': function(node, context) {
	      context.code += write('"\\n"' + (node.last ? '' : ' + i'));
	    },

	    '_v': function(node, context) {
	      context.code += 't.b(t.v(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
	    },

	    '_t': function(node, context) {
	      context.code += write('"' + esc(node.text) + '"');
	    },

	    '{': tripleStache,

	    '&': tripleStache
	  }

	  function tripleStache(node, context) {
	    context.code += 't.b(t.t(t.' + chooseMethod(node.n) + '("' + esc(node.n) + '",c,p,0)));';
	  }

	  function write(s) {
	    return 't.b(' + s + ');';
	  }

	  Hogan.walk = function(nodelist, context) {
	    var func;
	    for (var i = 0, l = nodelist.length; i < l; i++) {
	      func = Hogan.codegen[nodelist[i].tag];
	      func && func(nodelist[i], context);
	    }
	    return context;
	  }

	  Hogan.parse = function(tokens, text, options) {
	    options = options || {};
	    return buildTree(tokens, '', [], options.sectionTags || []);
	  }

	  Hogan.cache = {};

	  Hogan.cacheKey = function(text, options) {
	    return [text, !!options.asString, !!options.disableLambda, options.delimiters, !!options.modelGet].join('||');
	  }

	  Hogan.compile = function(text, options) {
	    options = options || {};
	    var key = Hogan.cacheKey(text, options);
	    var template = this.cache[key];

	    if (template) {
	      var partials = template.partials;
	      for (var name in partials) {
	        delete partials[name].instance;
	      }
	      return template;
	    }

	    template = this.generate(this.parse(this.scan(text, options.delimiters), text, options), text, options);
	    return this.cache[key] = template;
	  }
	})( true ? exports : Hogan);


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 *  Copyright 2011 Twitter, Inc.
	 *  Licensed under the Apache License, Version 2.0 (the "License");
	 *  you may not use this file except in compliance with the License.
	 *  You may obtain a copy of the License at
	 *
	 *  http://www.apache.org/licenses/LICENSE-2.0
	 *
	 *  Unless required by applicable law or agreed to in writing, software
	 *  distributed under the License is distributed on an "AS IS" BASIS,
	 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 *  See the License for the specific language governing permissions and
	 *  limitations under the License.
	 */

	var Hogan = {};

	(function (Hogan) {
	  Hogan.Template = function (codeObj, text, compiler, options) {
	    codeObj = codeObj || {};
	    this.r = codeObj.code || this.r;
	    this.c = compiler;
	    this.options = options || {};
	    this.text = text || '';
	    this.partials = codeObj.partials || {};
	    this.subs = codeObj.subs || {};
	    this.buf = '';
	  }

	  Hogan.Template.prototype = {
	    // render: replaced by generated code.
	    r: function (context, partials, indent) { return ''; },

	    // variable escaping
	    v: hoganEscape,

	    // triple stache
	    t: coerceToString,

	    render: function render(context, partials, indent) {
	      return this.ri([context], partials || {}, indent);
	    },

	    // render internal -- a hook for overrides that catches partials too
	    ri: function (context, partials, indent) {
	      return this.r(context, partials, indent);
	    },

	    // ensurePartial
	    ep: function(symbol, partials) {
	      var partial = this.partials[symbol];

	      // check to see that if we've instantiated this partial before
	      var template = partials[partial.name];
	      if (partial.instance && partial.base == template) {
	        return partial.instance;
	      }

	      if (typeof template == 'string') {
	        if (!this.c) {
	          throw new Error("No compiler available.");
	        }
	        template = this.c.compile(template, this.options);
	      }

	      if (!template) {
	        return null;
	      }

	      // We use this to check whether the partials dictionary has changed
	      this.partials[symbol].base = template;

	      if (partial.subs) {
	        // Make sure we consider parent template now
	        if (!partials.stackText) partials.stackText = {};
	        for (key in partial.subs) {
	          if (!partials.stackText[key]) {
	            partials.stackText[key] = (this.activeSub !== undefined && partials.stackText[this.activeSub]) ? partials.stackText[this.activeSub] : this.text;
	          }
	        }
	        template = createSpecializedPartial(template, partial.subs, partial.partials,
	          this.stackSubs, this.stackPartials, partials.stackText);
	      }
	      this.partials[symbol].instance = template;

	      return template;
	    },

	    // tries to find a partial in the current scope and render it
	    rp: function(symbol, context, partials, indent) {
	      var partial = this.ep(symbol, partials);
	      if (!partial) {
	        return '';
	      }

	      return partial.ri(context, partials, indent);
	    },

	    // render a section
	    rs: function(context, partials, section) {
	      var tail = context[context.length - 1];

	      if (!isArray(tail)) {
	        section(context, partials, this);
	        return;
	      }

	      for (var i = 0; i < tail.length; i++) {
	        context.push(tail[i]);
	        section(context, partials, this);
	        context.pop();
	      }
	    },

	    // maybe start a section
	    s: function(val, ctx, partials, inverted, start, end, tags) {
	      var pass;

	      if (isArray(val) && val.length === 0) {
	        return false;
	      }

	      if (typeof val == 'function') {
	        val = this.ms(val, ctx, partials, inverted, start, end, tags);
	      }

	      pass = !!val;

	      if (!inverted && pass && ctx) {
	        ctx.push((typeof val == 'object') ? val : ctx[ctx.length - 1]);
	      }

	      return pass;
	    },

	    // find values with dotted names
	    d: function(key, ctx, partials, returnFound) {
	      var found,
	          names = key.split('.'),
	          val = this.f(names[0], ctx, partials, returnFound),
	          doModelGet = this.options.modelGet,
	          cx = null;

	      if (key === '.' && isArray(ctx[ctx.length - 2])) {
	        val = ctx[ctx.length - 1];
	      } else {
	        for (var i = 1; i < names.length; i++) {
	          found = findInScope(names[i], val, doModelGet);
	          if (found !== undefined) {
	            cx = val;
	            val = found;
	          } else {
	            val = '';
	          }
	        }
	      }

	      if (returnFound && !val) {
	        return false;
	      }

	      if (!returnFound && typeof val == 'function') {
	        ctx.push(cx);
	        val = this.mv(val, ctx, partials);
	        ctx.pop();
	      }

	      return val;
	    },

	    // find values with normal names
	    f: function(key, ctx, partials, returnFound) {
	      var val = false,
	          v = null,
	          found = false,
	          doModelGet = this.options.modelGet;

	      for (var i = ctx.length - 1; i >= 0; i--) {
	        v = ctx[i];
	        val = findInScope(key, v, doModelGet);
	        if (val !== undefined) {
	          found = true;
	          break;
	        }
	      }

	      if (!found) {
	        return (returnFound) ? false : "";
	      }

	      if (!returnFound && typeof val == 'function') {
	        val = this.mv(val, ctx, partials);
	      }

	      return val;
	    },

	    // higher order templates
	    ls: function(func, cx, partials, text, tags) {
	      var oldTags = this.options.delimiters;

	      this.options.delimiters = tags;
	      this.b(this.ct(coerceToString(func.call(cx, text)), cx, partials));
	      this.options.delimiters = oldTags;

	      return false;
	    },

	    // compile text
	    ct: function(text, cx, partials) {
	      if (this.options.disableLambda) {
	        throw new Error('Lambda features disabled.');
	      }
	      return this.c.compile(text, this.options).render(cx, partials);
	    },

	    // template result buffering
	    b: function(s) { this.buf += s; },

	    fl: function() { var r = this.buf; this.buf = ''; return r; },

	    // method replace section
	    ms: function(func, ctx, partials, inverted, start, end, tags) {
	      var textSource,
	          cx = ctx[ctx.length - 1],
	          result = func.call(cx);

	      if (typeof result == 'function') {
	        if (inverted) {
	          return true;
	        } else {
	          textSource = (this.activeSub && this.subsText && this.subsText[this.activeSub]) ? this.subsText[this.activeSub] : this.text;
	          return this.ls(result, cx, partials, textSource.substring(start, end), tags);
	        }
	      }

	      return result;
	    },

	    // method replace variable
	    mv: function(func, ctx, partials) {
	      var cx = ctx[ctx.length - 1];
	      var result = func.call(cx);

	      if (typeof result == 'function') {
	        return this.ct(coerceToString(result.call(cx)), cx, partials);
	      }

	      return result;
	    },

	    sub: function(name, context, partials, indent) {
	      var f = this.subs[name];
	      if (f) {
	        this.activeSub = name;
	        f(context, partials, this, indent);
	        this.activeSub = false;
	      }
	    }

	  };

	  //Find a key in an object
	  function findInScope(key, scope, doModelGet) {
	    var val;

	    if (scope && typeof scope == 'object') {

	      if (scope[key] !== undefined) {
	        val = scope[key];

	      // try lookup with get for backbone or similar model data
	      } else if (doModelGet && scope.get && typeof scope.get == 'function') {
	        val = scope.get(key);
	      }
	    }

	    return val;
	  }

	  function createSpecializedPartial(instance, subs, partials, stackSubs, stackPartials, stackText) {
	    function PartialTemplate() {};
	    PartialTemplate.prototype = instance;
	    function Substitutions() {};
	    Substitutions.prototype = instance.subs;
	    var key;
	    var partial = new PartialTemplate();
	    partial.subs = new Substitutions();
	    partial.subsText = {};  //hehe. substext.
	    partial.buf = '';

	    stackSubs = stackSubs || {};
	    partial.stackSubs = stackSubs;
	    partial.subsText = stackText;
	    for (key in subs) {
	      if (!stackSubs[key]) stackSubs[key] = subs[key];
	    }
	    for (key in stackSubs) {
	      partial.subs[key] = stackSubs[key];
	    }

	    stackPartials = stackPartials || {};
	    partial.stackPartials = stackPartials;
	    for (key in partials) {
	      if (!stackPartials[key]) stackPartials[key] = partials[key];
	    }
	    for (key in stackPartials) {
	      partial.partials[key] = stackPartials[key];
	    }

	    return partial;
	  }

	  var rAmp = /&/g,
	      rLt = /</g,
	      rGt = />/g,
	      rApos = /\'/g,
	      rQuot = /\"/g,
	      hChars = /[&<>\"\']/;

	  function coerceToString(val) {
	    return String((val === null || val === undefined) ? '' : val);
	  }

	  function hoganEscape(str) {
	    str = coerceToString(str);
	    return hChars.test(str) ?
	      str
	        .replace(rAmp, '&amp;')
	        .replace(rLt, '&lt;')
	        .replace(rGt, '&gt;')
	        .replace(rApos, '&#39;')
	        .replace(rQuot, '&quot;') :
	      str;
	  }

	  var isArray = Array.isArray || function(a) {
	    return Object.prototype.toString.call(a) === '[object Array]';
	  };

	})( true ? exports : Hogan);


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = "\r\n<table class=\"wqueue-table\">\r\n\t{{#list}}\r\n\t<tr>\r\n\t\t<td class=\"{{state_as_alpha}}\">{{state_as_kanji}}</td>\r\n\t\t<td class=\"{{state_as_alpha}}\" style=\"text-align:right\">[{{patient_id_rep}}]</td>\r\n\t\t<td class=\"{{state_as_alpha}}\" style=\"max-width:260px\">{{last_name}} {{first_name}} ({{last_name_yomi}} {{first_name_yomi}})</td>\r\n\t\t<td>\r\n\t\t\t受付番号：{{visit_id}}\r\n\t\t</td>\r\n\t</tr>\r\n\t{{/list}}\r\n</table>\r\n"

/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";

	exports.WqueueStateWaitExam = 0;
	exports.WqueueStateInExam = 1;
	exports.WqueueStateWaitCashier = 2;
	exports.WqueueStateWaitDrug = 3;
	exports.WqueueStateWaitReExam = 4;
	exports.WqueueStateWaitAppoint = 5;

	exports.PharmaQueueStateWaitPack = 0;
	exports.PharmaQueueStateInPack   = 1;
	exports.PharmaQueueStatePackDone = 2;

	exports.DiseaseEndReasonNotEnded = "N";
	exports.DiseaseEndReasonCured = "C";
	exports.DiseaseEndReasonStopped = "S";
	exports.DiseaseEndReasonDead = "D";

	exports.DrugCategoryNaifuku = 0;
	exports.DrugCategoryTonpuku = 1;
	exports.DrugCategoryGaiyou  = 2;

	exports.ConductKindHikaChuusha = 0;
	exports.ConductKindJoumyakuChuusha = 1;
	exports.ConductKindOtherChuusha = 2;
	exports.ConductKindGazou = 3;

	exports.ZaikeiNaifuku = 1;
	exports.ZaikeiOther = 3;
	exports.ZaikeiChuusha = 4;
	exports.ZaikeiGaiyou = 6;
	exports.ZaikeiShikaYakuzai = 8;
	exports.ZaikeiShikaTokutei = 9;

	exports.SmallestPostfixShuushokugoCode = 8000;
	exports.LargestPostfixShuushookugoCode = 8999;

	exports.MeisaiSections = [
	        "初・再診料", "医学管理等", "在宅医療", "検査", "画像診断",
	        "投薬", "注射", "処置", "その他"       
	    ];

	exports.SHUUKEI_SHOSHIN = "110";
	exports.SHUUKEI_SAISHIN_SAISHIN = "120";
	exports.SHUUKEI_SAISHIN_GAIRAIKANRI = "122";
	exports.SHUUKEI_SAISHIN_JIKANGAI = "123";
	exports.SHUUKEI_SAISHIN_KYUUJITSU = "124";
	exports.SHUUKEI_SAISHIN_SHINYA = "125";
	exports.SHUUKEI_SHIDO = "130";
	exports.SHUUKEI_ZAITAKU = "140";
	exports.SHUUKEI_TOYAKU_NAIFUKUTONPUKUCHOZAI = "210";
	exports.SHUUKEI_TOYAKU_GAIYOCHOZAI = "230";
	exports.SHUUKEI_TOYAKU_SHOHO = "250";
	exports.SHUUKEI_TOYAKU_MADOKU = "260";
	exports.SHUUKEI_TOYAKU_CHOKI = "270";
	exports.SHUUKEI_CHUSHA_SEIBUTSUETC = "300";
	exports.SHUUKEI_CHUSHA_HIKA = "311";
	exports.SHUUKEI_CHUSHA_JOMYAKU = "321";
	exports.SHUUKEI_CHUSHA_OTHERS = "331";
	exports.SHUUKEI_SHOCHI = "400";
	exports.SHUUKEI_SHUJUTSU_SHUJUTSU = "500";
	exports.SHUUKEI_SHUJUTSU_YUKETSU = "502";
	exports.SHUUKEI_MASUI = "540";
	exports.SHUUKEI_KENSA = "600";
	exports.SHUUKEI_GAZOSHINDAN = "700";
	exports.SHUUKEI_OTHERS = "800";

	exports.HOUKATSU_NONE = '00';
	exports.HOUKATSU_KETSUEKIKageKU = "01";
	exports.HOUKATSU_ENDOCRINE = "02";
	exports.HOUKATSU_HEPATITIS = "03";
	exports.HOUKATSU_TUMOR = "04";
	exports.HOUKATSU_TUMORMISC = "05";
	exports.HOUKATSU_COAGULO = "06";
	exports.HOUKATSU_AUTOANTIBODY = "07";
	exports.HOUKATSU_TOLERANCE = "08";


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	__webpack_require__(8);
	var conti = __webpack_require__(10);

	var timeout = 15000;

	function request(service, data, method, cb){
		data = data || {};
		method = method || "GET";
		var url = window.location.origin + "/service";
		var searchParams = new URLSearchParams();
		searchParams.append("_q", service);
		var opt = {
			method: method,
			headers: {}
		};
		if( method === "GET" ){
			Object.keys(data).forEach(function(key){
				searchParams.append(key, data[key]);
			});
		}
		if( method === "POST" ){
			if( typeof data === "string" ){
				opt.body = data;
			} else {
				opt.body = JSON.stringify(data);
			}
			opt.headers["content-type"] = "application/json";
		}
		var done = false;
		var timer = setTimeout(function(){
			timer = null;
			if( !done ){
				done = true;
				cb("TIMEOUT");
			}
		}, timeout);
		url += "?" + searchParams.toString();
		conti.fetchJson(url, opt, function(err, result){
			if( timer ){
				clearTimeout(timer)
			}
			if( !done ){
				done = true;
				cb(err, result);
			}
		});
	}

	exports.recentVisits = function(cb){
		request("recent_visits", "", "GET", cb);
	};

	exports.getPatient = function(patientId, cb){
		request("get_patient", {patient_id: patientId}, "GET", cb);
	};

	exports.enterPatient = function(patient, cb){
		request("enter_patient", patient, "POST", function(err, result){
			if( err ){
				cb(err);
				return;
			}
			patient.patient_id = result;
			cb();
		});
	};

	exports.insertPatient = exports.enterPatient;

	exports.calcVisits = function(patientId, cb){
		request("calc_visits", {patient_id: patientId}, "GET", cb);
	};

	exports.listFullVisits = function(patientId, offset, n, cb){
		request("list_full_visits", {patient_id: patientId, offset: offset, n: n}, "GET", cb);
	};

	exports.startExam = function(visitId, done){
		request("start_exam", {visit_id: visitId}, "POST", done);
	};

	exports.suspendExam = function(visitId, done){
		request("suspend_exam", {visit_id: visitId}, "POST", done);
	};

	exports.endExam = function(visitId, charge, done){
		request("end_exam", {visit_id: visitId, charge: charge}, "POST", done);
	};

	exports.listCurrentFullDiseases = function(patientId, cb){
		request("list_current_full_diseases", {patient_id: patientId}, "GET", cb);
	};

	exports.listFullWqueueForExam = function(cb){
		request("list_full_wqueue_for_exam", {}, "GET", cb);
	};

	exports.listFullWqueueForCashier = function(cb){
		request("list_full_wqueue_for_cashier", {}, "GET", cb);
	};

	exports.enterWqueue = function(wqueue, done){
		request("enter_wqueue", wqueue, "POST", done);
	};

	exports.insertWqueue = exports.enterWqueue;

	exports.findWqueue = function(visitId, cb){
		request("find_wqueue", { visit_id: visitId }, "GET", cb);
	};

	exports.getVisit = function(visitId, cb){
		request("get_visit", {visit_id: +visitId}, "GET", cb);
	};

	exports.enterVisit = function(visit, cb){
		request("enter_visit", visit, "POST", function(err, visitId){
			if( err ){
				cb(err);
				return;	
			}
			visit.visit_id = visitId;
			cb();
		});
	};

	exports.insertVisit = exports.enterVisit;

	exports.searchPatient = function(text, cb){
		request("search_patient", {text: text}, "GET", cb);
	};

	exports.listTodaysVisits = function(cb){
		request("list_todays_visits", {}, "GET", cb);
	};

	exports.startVisit = function(patientId, at, cb){
		request("start_visit", {patient_id: patientId, at: at}, "POST", cb);
	};

	exports.deleteVisit = function(visitId, done){
		request("delete_visit", {visit_id: visitId}, "POST", done);
	};

	exports.getText = function(textId, cb){
		request("get_text", {text_id: textId}, "GET", cb);
	};

	exports.updateText = function(text, done){
		request("update_text", text, "POST", done);
	};

	exports.deleteText = function(textId, done){
		request("delete_text", {text_id: textId}, "POST", done);
	};

	exports.enterText = function(text, cb){
		request("enter_text", text, "POST", cb);
	};

	exports.listAvailableHoken = function(patientId, at, cb){
		request("list_available_hoken", {patient_id: patientId, at: at}, "GET", cb);
	};

	exports.updateVisit = function(visit, done){
		request("update_visit", visit, "POST", done);
	};

	exports.getVisitWithFullHoken = function(visitId, cb){
		request("get_visit_with_full_hoken", {visit_id: visitId}, "GET", cb);
	};

	exports.searchIyakuhinMaster = function(text, at, cb){
		request("search_iyakuhin_master", {text: text, at: at}, "GET", cb);
	};

	exports.searchPrescExample = function(text, cb){
		request("search_presc_example", {text: text}, "GET", cb);
	};

	exports.searchFullDrugForPatient = function(patientId, text, cb){
		request("search_full_drug_for_patient", {patient_id: patientId, text: text}, "GET", cb);
	};

	exports.resolveIyakuhinMasterAt = function(iyakuhincode, at, cb){
		request("resolve_iyakuhin_master_at", {iyakuhincode: iyakuhincode, at: at}, "GET", cb);
	};

	exports.getIyakuhinMaster = function(iyakuhincode, at, cb){
		request("get_iyakuhin_master", {iyakuhincode: iyakuhincode, at: at}, "GET", cb);
	};

	exports.enterDrug = function(drug, cb){
		request("enter_drug", drug, "POST", function(err, result){
			if( err ){
				cb(err);
				return;
			}
			drug.drug_id = result;
			cb(undefined, result);
		});
	};

	exports.insertDrug = exports.enterDrug;

	exports.getFullDrug = function(drugId, at, cb){
		request("get_full_drug", {drug_id: drugId, at: at}, "GET", cb);
	};

	exports.listFullDrugsForVisit = function(visitId, at, cb){
		request("list_full_drugs_for_visit", {visit_id: visitId, at: at}, "GET", cb);
	};

	exports.batchEnterDrugs = function(drugs, cb){
		request("batch_enter_drugs", JSON.stringify(drugs), "POST", cb);
	};

	exports.batchDeleteDrugs = function(drugIds, done){
		request("batch_delete_drugs", JSON.stringify(drugIds), "POST", done);
	};

	exports.batchUpdateDrugsDays = function(drugIds, days, done){
		var data = {
			drug_ids: drugIds,
			days: days
		};
		request("batch_update_drugs_days", JSON.stringify(data), "POST", done);
	};

	exports.modifyDrug = function(drug, done){
		request("modify_drug", JSON.stringify(drug), "POST", done);
	};

	exports.batchResolveShinryouNamesAt = function(names, at, cb){
		var body = JSON.stringify({
			names: names,
			at: at
		});
		request("batch_resolve_shinryou_names_at", body, "POST", cb);
	};

	exports.batchEnterShinryou = function(shinryouList, cb){
		var body = JSON.stringify(shinryouList);
		request("batch_enter_shinryou", body, "POST", cb);
	};

	exports.getShinryou = function(shinryouId, cb){
		request("get_shinryou", {shinryou_id: shinryouId}, "GET", cb);
	};

	exports.getFullShinryou = function(shinryouId, at, cb){
		request("get_full_shinryou", {shinryou_id: shinryouId, at: at}, "GET", cb);
	};

	exports.listFullShinryouForVisit = function(visitId, at, cb){
		request("list_full_shinryou_for_visit", {visit_id: visitId, at: at}, "GET", cb);
	};

	exports.batchDeleteShinryou = function(shinryouIds, done){
		request("batch_delete_shinryou", JSON.stringify(shinryouIds), "POST", done);
	};

	exports.searchShinryouMaster = function(text, at, cb){
		request("search_shinryou_master", {text: text, at: at}, "GET", cb);
	};

	exports.resolveShinryouMasterAt = function(shinryoucode, at, cb){
		request("resolve_shinryou_master_at", {shinryoucode: shinryoucode, at: at}, "GET", cb);
	};

	exports.getShinryouMaster = function(shinryoucode, at, cb){
		request("get_shinryou_master", {shinryoucode: shinryoucode, at: at}, "GET", cb);
	};

	exports.enterConduct = function(conduct, cb){
		request("enter_conduct", JSON.stringify(conduct), "POST", cb);
	};

	exports.enterGazouLabel = function(gazouLabel, done){
		request("enter_gazou_label", JSON.stringify(gazouLabel), "POST", done);
	};

	exports.enterConductDrug = function(conductDrug, cb){
		request("enter_conduct_drug", JSON.stringify(conductDrug), "POST", cb);
	};

	exports.enterConductKizai = function(conductKizai, cb){
		request("enter_conduct_kizai", JSON.stringify(conductKizai), "POST", cb);
	};

	exports.resolveKizaiNameAt = function(name, at, cb){
		var data = {
			name: name,
			at: at
		};
		request("resolve_kizai_name_at", data, "GET", cb);
	};

	exports.batchEnterConductShinryou = function(conductShinryouList, cb){
		request("batch_enter_conduct_shinryou", JSON.stringify(conductShinryouList), "POST", cb);
	};

	exports.getFullConduct = function(conductId, at, cb){
		request("get_full_conduct", {conduct_id: conductId, at: at}, "GET", cb);
	};

	exports.enterConductShinryou = function(conductShinryou, cb){
		request("enter_conduct_shinryou", JSON.stringify(conductShinryou), "POST", cb);
	};

	exports.enterConductDrug = function(conductDrug, cb){
		request("enter_conduct_drug", JSON.stringify(conductDrug), "POST", cb);
	};

	exports.copyConducts = function(srcVisitId, dstVisitId, cb){
		request("copy_conducts", {src_visit_id: srcVisitId, dst_visit_id: dstVisitId}, "POST", cb);
	};

	exports.deleteConduct = function(conductId, done){
		request("delete_conduct", {conduct_id: conductId}, "POST", done);
	};

	exports.deleteConductShinryou = function(conductShinryouId, done){
		request("delete_conduct_shinryou", {conduct_shinryou_id: conductShinryouId}, "POST", done);
	}

	exports.deleteConductDrug = function(conductDrugId, done){
		request("delete_conduct_drug", {conduct_drug_id: conductDrugId}, "POST", done);
	}

	exports.deleteConductKizai = function(conductKizaiId, done){
		request("delete_conduct_kizai", {conduct_kizai_id: conductKizaiId}, "POST", done);
	}

	exports.getKizaiMaster = function(kizaicode, at, cb){
		request("get_kizai_master", {kizaicode: kizaicode, at: at}, "GET", cb);
	};

	exports.searchKizaiMaster = function(text, at, cb){
		request("search_kizai_master", {text: text, at: at}, "GET", cb);
	};

	exports.changeConductKind = function(conductId, kind, done){
		request("change_conduct_kind", {conduct_id: conductId, kind: kind}, "POST", done);
	};

	exports.setGazouLabel = function(conductId, label, done){
		request("set_gazou_label", {conduct_id: conductId, label: label}, "POST", done);
	};

	exports.enterShinryouByNames = function(visitId, names, cb){
		var data = {
			visit_id: visitId,
			names: names
		};
		request("enter_shinryou_by_names", JSON.stringify(data), "POST", cb);
	};

	exports.calcMeisai = function(visitId, cb){
		request("calc_meisai", {visit_id: visitId}, "GET", cb);
	};

	exports.findCharge = function(visitId, cb){
		request("find_charge", {visit_id: visitId}, "GET", cb);
	};

	exports.updateCharge = function(charge, done){
		request("update_charge", JSON.stringify(charge), "POST", done);
	};

	exports.getCharge = function(visitId, cb){
		request("get_charge", {visit_id: visitId}, "GET", cb);
	};

	exports.searchShoubyoumeiMaster = function(text, at, cb){
		request("search_shoubyoumei_master", {text: text, at: at}, "GET", cb);
	};

	exports.searchShuushokugoMaster = function(text, cb){
		request("search_shuushokugo_master", {text: text}, "GET", cb);
	};

	exports.getShoubyoumeiMaster = function(shoubyoumeicode, at, cb){
		request("get_shoubyoumei_master", {shoubyoumeicode: shoubyoumeicode, at: at}, "GET", cb);
	};

	exports.getShuushokugoMaster = function(shuushokugocode, cb){
		request("get_shuushokugo_master", {shuushokugocode: shuushokugocode}, "GET", cb);
	};

	exports.getShoubyoumeiMasterByName = function(name, at, cb){
		request("get_shoubyoumei_master_by_name", {name: name, at: at}, "GET", cb);
	};

	exports.getShuushokugoMasterByName = function(name, cb){
		request("get_shuushokugo_master_by_name", {name: name}, "GET", cb);
	};

	exports.enterDisease = function(shoubyoumeicode, patientId, startDate, shuushokugocodes, cb){
		var data = {
			shoubyoumeicode: shoubyoumeicode,
			patient_id: patientId,
			start_date: startDate,
			shuushokugocodes: shuushokugocodes
		};
		request("enter_disease", JSON.stringify(data), "POST", cb);
	};

	exports.getFullDisease = function(diseaseId, cb){
		request("get_full_disease", {disease_id: diseaseId}, "GET", cb);
	};

	exports.getDisease = function(diseaseId, cb){
		request("get_disease", {disease_id: diseaseId}, "GET", cb);
	};

	exports.batchUpdateDiseases = function(diseases, done){
		request("batch_update_diseases", JSON.stringify(diseases), "POST", done);
	};

	exports.listAllFullDiseases = function(patientId, cb){
		request("list_all_full_diseases", {patient_id: patientId}, "GET", cb);
	};

	exports.updateDiseaseWithAdj = function(disease, done){
		request("update_disease_with_adj", JSON.stringify(disease), "POST", done);
	};

	exports.deleteDiseaseWithAdj = function(diseaseId, done){
		request("delete_disease_with_adj", {disease_id: diseaseId}, "POST", done);
	};

	exports.searchTextForPatient = function(patientId, text, cb){
		request("search_text_for_patient", {patient_id: patientId, text: text}, "GET", cb);
	};

	exports.searchWholeText = function(text, cb){
		request("search_whole_text", {text: text}, "GET", cb);
	};

	// added for pharma

	exports.listFullPharmaQueue = function(cb){
		request("list_full_pharma_queue", {}, "GET", cb);
	};

	exports.listTodaysVisitsForPharma = function(cb){ 
		request("list_todays_visits_for_pharma", {}, "GET", cb);
	};

	exports.listDrugs = function(visitId, cb){
		request("list_drugs", {visit_id: visitId}, "GET", cb);
	};

	exports.listVisits = function(patientId, offset, n, cb){
		request("list_visits", {
			patient_id: patientId,
			offset: offset,
			n: n
		}, "GET", cb);
	};

	exports.listIyakuhinByPatient = function(patientId, cb){
		request("list_iyakuhin_by_patient", {patient_id: patientId}, "GET", cb);
	};

	exports.countVisitsByIyakuhincode = function(patientId, iyakuhincode, cb){
		request("count_visits_by_iyakuhincode", {
			patient_id: patientId,
			iyakuhincode: iyakuhincode
		}, "GET", cb);
	};

	exports.listFullVisitsByIyakuhincode = function(patientId, iyakuhincode, offset, n, cb){
		request("list_full_visits_by_iyakuhincode", {
			patient_id: patientId,
			iyakuhincode: iyakuhincode,
			offset: offset,
			n: n
		}, "GET", cb);
	};

	exports.findPharmaDrug = function(iyakuhincode, cb){
		request("find_pharma_drug", {
			iyakuhincode: iyakuhincode
		}, "GET", cb);
	};

	exports.prescDone = function(visitId, done){
		request("presc_done", {
			visit_id: visitId
		}, "POST", done);
	};

	exports.getDrug = function(drugId, cb){
		request("get_drug", {
			drug_id: drugId
		}, "GET", cb);
	};

	exports.enterPayment = function(payment, done){
		request("enter_payment", payment, "POST", done);
	};

	exports.insertPayment = exports.enterPayment;

	exports.listPayments = function(visitId, cb){
		request("list_payment", { visit_id: visitId }, "GET", cb);
	};

	exports.finishCashier = function(visitId, amount, paytime, done){
		request("finish_cashier", { visit_id: visitId, amount: amount, paytime: paytime }, "POST", done);
	};

	exports.enterPharmaQueue = function(queue, done){
		request("enter_pharma_queue", queue, "POST", done);
	};

	exports.insertPharmaQueue = exports.enterPharmaQueue;

	// reception //////////////////////////////////////////////////////

	exports.listFullWqueue = function(cb){
		request("list_full_wqueue", {}, "GET", cb);
	};

	exports.updatePatient = function(patient){
		request("update_patient", patient, "POST", done);
	};

	exports.listAvailableHoken = function(patientId, ati, cb){
		request("list_available_hoken", { patient_id: patientId, at: at }, "GET", cb);
	};

	exports.getShahokokuho = function(shahokokuhoId, cb){
		request("get_shahokokuho", { shahokokuho_id: shahokokuhoId }, "GET", cb);
	};

	exports.updateShahokokuho = function(shahokokuho, done){
		request("update_shahokokuho", shahokokuho, "POST", done);
	};

	exports.deleteShahokokuho = function(shahokokuhoId, done){
		request("delete_shahokokuho", { shahokokuho_id: shahokokuhoId }, "POST", done);
	};

	exports.enterShahokokuho = function(shahokokuho, done){
		request("enter_shahokokuho", shahokokuho, "POST", function(err, result){
			if( err ){
				done(err);
				return;
			}
			shahokokuho.shahokokuho_id = result;
			done();
		});
	};

	exports.getKoukikourei = function(koukikoureiId, cb){
		request("get_koukikourei", { koukikourei_id: koukikoureiId }, "GET", cb);
	};

	exports.updateKoukikourei = function(koukikourei, done){
		request("update_koukikourei", koukikourei, "POST", done);
	};

	exports.deleteKoukikourei = function(koukikoureiId, done){
		request("delete_koukikourei", { koukikourei_id: koukikoureiId }, "POST", done);
	};

	exports.enterKoukikourei = function(koukikourei, done){
		request("enter_koukikourei", koukikourei, "POST", function(err, result){
			if( err ){
				done(err);
				return;
			}
			koukikourei.koukikourei_id = result;
			done();
		});
	};

	exports.getRoujin = function(roujinId, cb){
		request("get_roujin", { roujin_id: roujinId }, "GET", cb);
	};

	exports.updateRoujin = function(roujin, done){
		request("update_roujin", roujin, "POST", done);
	};

	exports.deleteRoujin = function(roujinId, done){
		request("delete_roujin", { roujin_id: roujinId }, "POST", done);
	};

	exports.enterRoujin = function(roujin, done){
		request("enter_roujin", roujin, "POST", function(err, result){
			if( err ){
				done(err);
				return;
			}
			roujin.roujin_id = result;
			done();
		});
	};

	exports.getKouhi = function(kouhiId, cb){
		request("get_kouhi", { kouhi_id: kouhiId }, "GET", cb);
	};

	exports.updateKouhi = function(kouhi, done){
		request("update_kouhi", kouhi, "POST", done);
	};

	exports.deleteKouhi = function(kouhiId, done){
		request("delete_kouhi", { kouhi_id: kouhiId }, "POST", done);
	};

	exports.enterKouhi = function(kouhi, done){
		request("enter_kouhi", kouhi, "POST", function(err, result){
			if( err ){
				done(err);
				return;
			}
			kouhi.kouhi_id = result;
			done();
		});
	};

	exports.listRecentlyEnteredPatients = function(n, cb){
		request("list_recently_entered_patients", {n : n}, "GET", cb);
	};

	exports.deletePatient = function(patientId, done){
		request("delete_patient", { patient_id: patientId }, "POST", done);
	};



/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();

	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();

	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();

	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();

	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(9)))

/***/ },
/* 9 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	(function(exports){

	function iterExec(i, funs, done){
		if( i >= funs.length ){
			done();
			return;
		}
		var f = funs[i];
		f(function(err){
			if( err ){
				done(err);
				return;
			}
			iterExec(i+1, funs, done);
		})
	}

	exports.exec = function(funs, done){
		funs = funs.slice();
		iterExec(0, funs, done);
	};

	exports.execPara = function(funs, done){
		if( funs.length === 0 ){
			done();
			return;
		}
		funs = funs.slice();
		var n = funs.length;
		var no_more = false;
		funs.forEach(function(f){
			if( no_more ){
				return;
			}
			f(function(err){
				if( no_more ){
					return;
				}
				if( err ){
					no_more = true;
					done(err);
					return;
				}
				n -= 1;
				if( n === 0 ){
					done();
				}
			})
		})
	}

	function iterForEach(i, arr, fn, done){
		if( i >= arr.length ){
			done();
			return;
		}
		fn(arr[i], function(err){
			if( err ){
				done(err);
				return;
			}
			iterForEach(i+1, arr, fn, done);
		})
	}

	exports.forEach = function(arr, fn, done){
		arr = arr.slice();
		iterForEach(0, arr, fn, done);
	};

	exports.forEachPara = function(arr, fn, done){
		if( arr.length === 0 ){
			done();
			return;
		}
		arr = arr.slice();
		var n = arr.length;
		var no_more = false;
		arr.forEach(function(ele){
			if( no_more ){
				return;
			}
			fn(ele, function(err){
				if( no_more ){
					return;
				}
				if( err ){
					no_more = true;
					done(err);
					return;
				}
				n -= 1;
				if( n === 0 ){
					done();
				}
			})
		});
	};

	function Queue(){
		this.queue = [];
	}

	Queue.prototype.push = function(fn, cb){
		this.queue.push({
			fn: fn,
			cb: cb
		});
		if( this.queue.length === 1 ){
			this.run();
		}
	}

	Queue.prototype.run = function(){
		if( this.queue.length === 0 ){
			return;
		}
		var entry = this.queue[0];
		var fn = entry.fn;
		var cb = entry.cb;
		var self = this;
		fn(function(){
			var args = [].slice.call(arguments);
			cb.apply(undefined, args);
			if( self.queue.length > 0 && self.queue[0] === entry ){
				self.queue.shift();
				self.run();
			}
		})
	}

	var theQueue = new Queue();

	exports.enqueue = function(fn, cb){
		theQueue.push(fn, cb);
	};

	exports.mapPara = function(arr, fn, cb){
		var index = 0;
		var dataArr = arr.map(function(value){
			return {
				index: index++,
				value: value
			}
		});
		var retArr = [];
		exports.forEachPara(dataArr, function(data, done){
			var value = fn(data.value, function(err, result){
				if( err ){
					done(err);
					return;
				}
				retArr[data.index] = result;
				done();
			});
		}, function(err){
			if( err ){
				cb(err);
				return;
			}
			cb(undefined, retArr);
		})
	};

	exports.fetch = function(url, opt, op, cb){
		fetch(url, opt)
		.then(function(response){
			if( response.ok ){
				response[op]()
				.then(function(result){
					cb(undefined, result);
				})
				.catch(function(err){
					cb(err.message);
				})
			} else { 
				response.text()
				.then(function(text){
					cb(text);
				})
				.catch(function(err){
					cb(err.message);
				})
			}
		})
		.catch(function(err){
			cb(err.message);
		})
	}

	exports.fetchJson = function (url, opt, cb){
		exports.fetch(url, opt, "json", function(err, result){
			setTimeout(function(){
				cb(err, result);
			}, 0);
	//		setImmediate(function(){
	//			cb(err, result);
	//		});
		});
	}

	exports.fetchText = function (url, opt, cb){
		exports.fetch(url, opt, "text", function(err, result){
			setTimeout(function(){
				cb(err, result);
			}, 0);
	//		setImmediate(function(){
	//			cb(err, result);
	//		});
		});
	}

	})( true ? exports : (window.conti = {}));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	(function(exports){

	function iterExec(i, funs, done){
		if( i >= funs.length ){
			done();
			return;
		}
		var f = funs[i];
		f(function(err){
			if( err ){
				done(err);
				return;
			}
			iterExec(i+1, funs, done);
		})
	}

	exports.exec = function(funs, done){
		funs = funs.slice();
		iterExec(0, funs, done);
	};

	exports.execPara = function(funs, done){
		if( funs.length === 0 ){
			done();
			return;
		}
		funs = funs.slice();
		var n = funs.length;
		var no_more = false;
		funs.forEach(function(f){
			if( no_more ){
				return;
			}
			f(function(err){
				if( no_more ){
					return;
				}
				if( err ){
					no_more = true;
					done(err);
					return;
				}
				n -= 1;
				if( n === 0 ){
					done();
				}
			})
		})
	}

	function iterForEach(i, arr, fn, done){
		if( i >= arr.length ){
			done();
			return;
		}
		fn(arr[i], function(err){
			if( err ){
				done(err);
				return;
			}
			iterForEach(i+1, arr, fn, done);
		})
	}

	exports.forEach = function(arr, fn, done){
		arr = arr.slice();
		iterForEach(0, arr, fn, done);
	};

	exports.forEachPara = function(arr, fn, done){
		if( arr.length === 0 ){
			done();
			return;
		}
		arr = arr.slice();
		var n = arr.length;
		var no_more = false;
		arr.forEach(function(ele){
			if( no_more ){
				return;
			}
			fn(ele, function(err){
				if( no_more ){
					return;
				}
				if( err ){
					no_more = true;
					done(err);
					return;
				}
				n -= 1;
				if( n === 0 ){
					done();
				}
			})
		});
	};

	function Queue(){
		this.queue = [];
	}

	Queue.prototype.push = function(fn, cb){
		this.queue.push({
			fn: fn,
			cb: cb
		});
		if( this.queue.length === 1 ){
			this.run();
		}
	}

	Queue.prototype.run = function(){
		if( this.queue.length === 0 ){
			return;
		}
		var entry = this.queue[0];
		var fn = entry.fn;
		var cb = entry.cb;
		var self = this;
		fn(function(){
			var args = [].slice.call(arguments);
			cb.apply(undefined, args);
			if( self.queue.length > 0 && self.queue[0] === entry ){
				self.queue.shift();
				self.run();
			}
		})
	}

	var theQueue = new Queue();

	exports.enqueue = function(fn, cb){
		theQueue.push(fn, cb);
	};

	exports.mapPara = function(arr, fn, cb){
		var index = 0;
		var dataArr = arr.map(function(value){
			return {
				index: index++,
				value: value
			}
		});
		var retArr = [];
		exports.forEachPara(dataArr, function(data, done){
			var value = fn(data.value, function(err, result){
				if( err ){
					done(err);
					return;
				}
				retArr[data.index] = result;
				done();
			});
		}, function(err){
			if( err ){
				cb(err);
				return;
			}
			cb(undefined, retArr);
		})
	};

	exports.fetch = function(url, opt, op, cb){
		fetch(url, opt)
		.then(function(response){
			if( response.ok ){
				response[op]()
				.then(function(result){
					cb(undefined, result);
				})
				.catch(function(err){
					cb(err.message);
				})
			} else { 
				response.text()
				.then(function(text){
					cb(text);
				})
				.catch(function(err){
					cb(err.message);
				})
			}
		})
		.catch(function(err){
			cb(err.message);
		})
	}

	exports.fetchJson = function (url, opt, cb){
		exports.fetch(url, opt, "json", function(err, result){
			setTimeout(function(){
				cb(err, result);
			}, 0);
	//		setImmediate(function(){
	//			cb(err, result);
	//		});
		});
	}

	exports.fetchText = function (url, opt, cb){
		exports.fetch(url, opt, "text", function(err, result){
			setTimeout(function(){
				cb(err, result);
			}, 0);
	//		setImmediate(function(){
	//			cb(err, result);
	//		});
		});
	}

	})( true ? exports : (window.conti = {}));


/***/ }
/******/ ]);