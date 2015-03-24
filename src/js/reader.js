/**
 * @file reader.js
 * @author xles <xles@mirakulix.org>
 * @version 0.0.1
 *
 * @copyright (c) 2012 xles <xles@miraukulix.org>
 *
 * @license MIT
 */
/*
Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
 */
'use strict';


/**
 * Takes a plain-text or markdown file, and renders it out to a more
 * aesthetically and typographically pleasing format.
 *
 * @summary Text prettifier.
 *
 * @global
 * @namespace reader
 */
var reader = (function (window) {
	/**
	 * Import commonmark from global scope.
	 *
	 * @var reader~commonmark
	 * @access private
	 */
	var commonmark = window.commonmark,

	/**
	 * Import Hyphenator from global scope.
	 *
	 * @var reader~Hyphenator
	 * @access private
	 */
	    Hyphenator = window.Hyphenator,

	/**
	 * Default configuration object.
	 *
	 * @var reader~config
	 * @access private
	 */
		config = {
			adjustViewport: true,
			fileExtensions: ['md','markdown','txt'],
			hyphenator: true,
			markdown: true,
			tableOfContents: true
		};

	/**
	 * Validates the user-supplied configuration object.
	 *
	 * @function reader~validateConfigurationObject
	 * @access private
	 * @param {object} obj - The user-supplied configuration object.
	 */
	function validateConfigurationObject(obj)
	{
/*		 	function validateConfigProperty(property, type)
			{
				if (typeof c[property] === type) {
					return true;
				} else {
					return false
				}
			} */
		if (obj.hasOwnProperty('adjustViewport')) {
			config.adjustViewport = obj.adjustViewport;
		}
		if (obj.hasOwnProperty('fileExtensions')) {
			config.fileExtensions = obj.fileExtensions;
		}
		if (obj.hasOwnProperty('hyphenator')) {
			config.hyphenator = obj.hyphenator;
		}
		if (obj.hasOwnProperty('markdown')) {
			console.log(typeof obj.markdown);
			config.markdown = obj.markdown;
		}
		if (obj.hasOwnProperty('tableOfContents')) {
			config.tableOfContents = obj.tableOfContents;
		}

	}

	/**
	 * Checks if file exists on the server.
	 *
	 * @function reader~fileExists
	 * @access private
	 * @param {string} file - The filename.
	 * @returns boolean
	 */
	function fileExists(file)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('HEAD', file, false);
		xhr.send();

		if (xhr.status === 404) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * Converts all relative paths to absolute paths, for printing.
	 *
	 * @function reader~absolutePaths
	 * @access private
	 */
	function absolutePaths()
	{
		var i, links = document.body.getElementsByTagName('a');
		for (i = 0; i < links.length; i++) {
			links[i].href = links[i].protocol + '//' + links[i].host +
			                links[i].pathname + links[i].search + links[i].hash;
		}
	}

	/**
	 * Checks possible file extensions to see if file exists on the
	 * server.
	 *
	 * @function reader~findFile
	 * @access private
	 * @param {string} str - Needle.
	 * @returns {string} - Found filename.
	 */
	function findFile(str)
	{
		return new Promise(function(resolve, reject) {
			var re = /(?:\.([^.]+))?$/,
			    ext = re.exec(str)[1],
			    allowedExtensions = ['md', 'markdown', 'txt'];

			if (allowedExtensions.indexOf(ext) !== -1) {
				return resolve(str);
			} else {
				allowedExtensions.forEach(function (extension) {
					if (fileExists(str + '.' + extension)) {
						resolve(str + '.' + extension);
					}
				});
				reject(str);
			}
		});
	}

	/**
	 * Preperes the text for rendering.
	 *
	 * @function reader~formatText
	 * @access private
	 * @param {string} file - The filename.
	 * @param {string} text - The raw text blob.
	 */
	function formatText(file, text)
	{
		var rawLink = document.createElement('a'),
		    header = document.createElement('h1');

		rawLink.href = file + '.txt';
		rawLink.id = 'raw-file';
		rawLink.innerHTML = 'View raw file.';

		document.body.appendChild(rawLink);
		document.body.appendChild(text);

		var article = document.body.getElementsByTagName('article')[0],
		    leFirstChild = article.firstChild;

		while (leFirstChild.nodeType !== 1) {
			leFirstChild = leFirstChild.nextSibling;
		}

		if (leFirstChild.nodeName !== 'H1') {
			header.innerHTML = file.replace('-', ' ');
			document.title = header.innerHTML;
			article.insertBefore(header, leFirstChild);
		} else {
			document.title = leFirstChild.innerHTML;
		}
		if (config.hyphenator)
			Hyphenator.run();
		if (config.tableOfContents)
			generateTableOfContents();
		absolutePaths();
	}

	/**
	 * Runs text through a markdown parser and renderer.
	 *
	 * @function reader~markdown
	 * @access private
	 * @param {string} str - the raw text string.
	 * @returns {object} article - DOM-node object
	 */
	function markdown(str)
	{
		var reader = new commonmark.Parser(),
		    writer = new commonmark.HtmlRenderer(),
		    article = document.createElement('article');

		if (config.hyphenator)
			article.className = 'hyphenate';
		article.innerHTML = writer.render(reader.parse(str));
		return article;
	}

	/**
	 * Converts NL to <p> elements.
	 *
	 * @function reader~nltop
	 * @access private
	 * @param {string} str - the raw text string.
	 * @returns {object} article - DOM-node object
	 */
	function nltop(str)
	{
		var i, paragraph,
		    article = document.createElement('article');

		if (config.hyphenator)
			article.className = 'hyphenate';

		str = str
			.replace(/\r\n/g,'\n')
			.replace(/\n\r/g,'\n')
			.replace(/\r/g,  '\n')
			.split('\n\n');

		for (i = 0; i < str.length; i++) {
			if (str[i]){
				paragraph = document.createElement('p');
				paragraph.innerHTML = str[i];
				article.appendChild(paragraph);
			}
		}
		return article;
	}

	/**
	 * Spits out credits and copyright information at the bottom of the
	 * page.
	 *
	 * @function reader~printColophon
	 * @access private
	 */
	function printColophon()
	{
		var copy = document.createElement('div');
		copy.id = 'colophon';
		copy.innerHTML = '<a href="https://github.com/xles/dropbox-reader/">Text prettifier</a>' +
			' &copy; <span style="font-variant:normal;">xles</span> mmxii<br>' +
			'<a href="http://commonmark.org/">Commonmark markdown parser by John MacFarlane</a><br>' +
			'<a href="https://github.com/mnater/Hyphenator">Hyphenator.js hyphenation library by Mathias Nater</a><br>' +
			'<a href="http://www.nymfont.com/2009/08/nymphette-font.html">Nymphette ornamental font by Lauren Thompson</a>';
		document.body.appendChild(copy);
	}

	/**
	 * Reads in a file from the server (if it exists).
	 *
	 * @function reader~readFle
	 * @access private
	 * @returns boolean
	 */
	function readFile()
	{
		var xhr, file, err, text;

		file = location.search.substring(1);

		if (!file) {
			document.body.innerHTML = 'No file specified.';
			printColophon();
			return false;
		}
		findFile(file).then(function(filename) {
			xhr = new XMLHttpRequest();
			if (xhr.overrideMimeType)
				xhr.overrideMimeType('text/plain; charset=utf-8');
			xhr.open('GET', filename, true);
			xhr.onreadystatechange = function() {
				document.body.innerHTML = '';
				if (xhr.readyState === 4) {
					if (xhr.status === 404) {
						err = '"' + filename + '" no such file.';
						document.body.innerHTML = err;
					} else {
						if (config.markdown === true) {
							text = xhr.responseText;
							//text = prosedown(text);
							text = markdown(text);
						} else
							text =    nltop(xhr.responseText);

						formatText(file, text);
					}
				}
				printColophon();
			};
			xhr.send(null);
			return true;
		}, function(filename) {
			err = '"' + filename + '" no such file.';
			document.body.innerHTML = err;
		});
	}

	/**
	 * Traverses the DOM-tree and auto-generates a Table of Contents.
	 *
	 * @function reader~generateTableOfContents
	 * @access private
	 */
	function generateTableOfContents()
	{
		function generateSlug(str) {
			var slug = str
				.replace(/\s+/g, '-')
				.replace(/[^\w\-]/g, '')
				.toLowerCase();
			if (idx.indexOf(slug) !== -1) {
				var i = 1, newSlug = slug;
				while (idx.indexOf(newSlug) !== -1) {
					newSlug = slug + '_' + i;
					i++;
				}
				slug = newSlug;
			}
			idx.push(slug);
			return slug;
		}

		var article = document.body.getElementsByTagName('article');
		if (article.length !== 1)
			return false;

		article = article[0];

		var container = document.getElementById('toc');
		if (!container) {
			container = document.createElement('nav');
			container.id = 'toc';
			document.body.insertBefore(container, document.body.firstChild);
		}
		var toc = container;
		var tocTitle = document.createElement('span');
		tocTitle.innerHTML = 'Table of Contents';
		tocTitle.className = 'title';

		var idx = [];

		var h1 = article.getElementsByTagName('h1')[0];
		var h1Link = document.createElement('a');
		h1.id = generateSlug(h1.innerHTML);
		h1Link.href = '#' + h1.id;
		h1Link.innerHTML = h1.innerHTML;

		h1 = document.createElement('h1');
		h1.appendChild(h1Link);

		function recursion(oldlevel, root) {
			var ctx;
			for (var i = 0; i < root.childNodes.length; ++i) {
				if (root.childNodes[i].nodeType !== 1)
					continue;

				var node = root.childNodes[i];
				ctx = toc;
				var tagName = node.nodeName.toLowerCase();

				if (tagName.length === 2 && tagName.charAt(0) === 'h' &&
						tagName !== 'hr' && tagName !== 'h1') {
					node.id = generateSlug(node.innerHTML);
				}
				var link = document.createElement('a');
				link.href = '#' + node.id;
				link.innerHTML = node.innerHTML;

				if (tagName === 'h1') {
					continue;
				} else
				if (tagName.length === 2 && tagName.charAt(0) === 'h' &&
						tagName !== 'hr') {
					var level = tagName.charAt(1);
					for (var n = 1; n < level; n++) {
						if(ctx.lastChild)
							ctx = ctx.lastChild;
					}
					var li = document.createElement('li');
					li.appendChild(link);
					if (level > oldlevel) {
						var ol = document.createElement('ol');
						ol.appendChild(li);
						ctx.appendChild(ol);
					} else if (level === oldlevel) {
						ctx.lastChild.appendChild(li);
					} else {
						ctx.appendChild(li);
					}
					oldlevel = level;
				} else
				if (node.childNodes.length > 0) {
					ctx = recursion(oldlevel, node);
				}
			}
			return ctx;
		}

		function tocGen(toc, root) {
			var oldlevel = 0;
			toc = recursion(oldlevel, root);
		}

		tocGen(container,article);

		toc.insertBefore(tocTitle, toc.firstChild);
		toc.insertBefore(h1, toc.firstChild);
	}

	/**
	 * Adjusts the rem unit to scale the viewport automatically.
	 *
	 * @function reader~adjustViewport
	 * @access private
	 */
	function adjustViewport()
	{
		var measure, remSize, width = window.innerWidth;

		if (width <= 768) {
			measure = 26;
		} else if (width > 768 && width <= 1024) {
			measure = 32;
		} else {
			measure = 45;
		}
		if (width <= 1024) {
			remSize = width/measure;
			document.body.style.fontSize = remSize + 'px';
		}
	}

	return {
		/**
		 * Runs the application, with optional user configurations.
		 *
		 * @method reader~run
		 * @access public
		 * @param {object} userConfig - The user-supplied configuration
		 * object.
		 */
		run: function(userConfig) {
			if (userConfig !== undefined) {
				validateConfigurationObject(userConfig);
			}
			if (config.adjustViewport) {
				adjustViewport();
			}

			readFile();
		}
	};
}(window));
