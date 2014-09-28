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

## Credits

* Author of the Markdown parser stmd.js, John MacFarlane. Showdown can 
be found here: https://github.com/jgm/stmd

* Markdown creator and massive diva, John Gruber.
