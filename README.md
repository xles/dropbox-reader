# Text prettifier

Ok, so I wrote this little JavaScript thing, as an exercise to learn
me some JavaScript. But it also turned out to be a useful little 
script on my dropbox.

### So what is it?

It's a text-file wrapper, so that you can view (and share) plain-text
files on your dropbox with a teeny tiny bit of civilized styling.

Also, thanks to stmd.js by John MacFarlane you can also get some
Standard Markdown goodness.

## Installation

Just dump all the files in the Public directory on your dropbox. 

Don't want to have a bunch of files cluttering up your dropbox? Get 
the single file version from my gist here: 
https://gist.github.com/3398421

(The single file version may become wonky in firefox for some reason.)

### Options

```
reader.run({
	adjustViewport: true,
	fileExtensions: ['md','markdown','txt'],
	hyphenator: true,
	markdown: true,
	tableOfContents: true
});
```

#### `adjustViewport` (boolean)

Runs a small script that automatically adjusts the `rem` size to scale
the viewport (primarilly for mobile devices).

Default value:  `true`

#### `fileExtensions` (array)

The list of valid file extensions.  The order of the array is the order
in which the script searches for files.

Default value:  `['md','markdown','txt']`

#### `hyphenator` (boolean)

Hyphenates the text document with the `Hyphenator.js` library.  If set 
to `false` it will also make the text jagged right rather than justified.

Default value:  `true`

#### `markdown` (boolean)

If set to `true` it will treat all documents as markdown documents and 
run them through the `commonmark.js` markdown parser.  Setting this to 
`false` will instead run a quick and dirty script that turns dual line
breaks into `<p>` elements.

Default value:  `true`

#### `tableOfContents` (boolean)

If enabled it will auto-generate a table of contents for the parsed 
document.  If `markdown` is disabled, this setting will have no effect.

Default value:  `true`


## Usage

First, you need a text file. For your convenience I have included, as 
a demo, a Markdown copy of the _Constitution of the United States of 
America_ in `usa.txt`. To access this file, just go to 
`path/to/script/reader.html?usa`, piece of cake!

*Your text files need to be in the same directory as your script*.

### Live demo 
https://dl.dropbox.com/u/58338447/reader.html?usa (single page version)

Should work in any modern-ish browser, including IE7 (not saying that 
IE7 is in any way, shape or form a modern browser, though).

### Known potential issues

I haven't spent much time checking how well it works with unclean file 
names. I do know it will work with any civilised `a-z0-9._-` file name
however.

## Colophon

* `Hyphenator.js` hyphenation library by 
  [Mathias Nater](https://github.com/mnater/Hyphenator).

* Nymphette ornamental font by 
  [Lauren Thompson](http://www.nymfont.com/2009/08/nymphette-font.html).

* `commonmark.js` Markdown parser, by 
  [John MacFarlane](https://github.com/jgm/commonmark.js).

* Markdown creator and massive diva, John Gruber.
