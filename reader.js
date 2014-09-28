(function(window){

	/**
	 * Checks if file exists on the server.
	 */
	function fileExists(url)
	{
		var xhr = new XMLHttpRequest();
		xhr.open('HEAD', url, false);
		xhr.send();
		return xhr.status!==404;
	}
	
	/**
	 * Preperes the text for rendering.
	 */
	function formatText(file, text)
	{
		var rawLink = document.createElement('a'),
		    header = document.createElement('h1');

		rawLink.href = file + '.txt';
		rawLink.innerHTML = "View raw file.";

		document.body.appendChild(rawLink);
		document.body.appendChild(text);

		var article = document.body.getElementsByTagName('div')[0],
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
	}

	/**
	 * Runs text through a markdown parser and renderer.
	 */
	function markdown(str)
	{
		var parser = new stmd.DocParser(),
		    renderer = new stmd.HtmlRenderer(),
		    article = document.createElement('div');

		article.innerHTML = renderer.render(parser.parse(str));
		return article;
	}

	/**
	 * Converts NL to <p> elements.
	 */
	function nltop(str) 
	{
		var i, paragraph,
		    article = document.createElement('div');
		
		str = str.replace(/\r\n/g,"\n");
		str = str.replace(/\n\r/g,"\n");
		str = str.replace(/\r/g,  "\n");

		str = str.split("\n\n");

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
	 * Spits out copyright information at the bottom of the page.
	 */
	function copyBlurb()
	{
		var copy = document.createElement('div');

		copy.className = 'copyright';
		copy.innerHTML = 'Text prettifier &copy; xles 2012<br>'
		               + 'Showdown markdown parser by John Fraser';
		document.body.appendChild(copy);
	}

	/**
	 * Reads in a file from the server (if it exists), formats it
	 * and renders it to the DOM tree.
	 */
	function readFile(md) 
	{
		md = md === undefined ? true : md;

		var xhr, i, file, filename, err, text,
		    exts = ['.md', '.txt'];

		file = location.search.substring(1);
		if (!file) {
			document.body.innerHTML = 'No file specified.';
			copyBlurb();
			return false;
		}
		for (i = 0; i < exts.length; i++) {
			filename = file + exts[i];
			if (fileExists(filename)) {
				break;
			}
		}

		xhr = new XMLHttpRequest();
		xhr.open("GET", filename, true);
		xhr.onreadystatechange = function() {
			document.body.innerHTML = '';
			if (xhr.readyState == 4) {
				if (xhr.status == 404) {
					err = '"' + filename + '" no such file.';
					document.body.innerHTML = err;
				} else {
					if (md == true) {
						text = markdown(xhr.responseText);
					} else {
						text =    nltop(xhr.responseText);
					}
					
					formatText(file, text);
				}
			}
			copyBlurb();
		};
		xhr.send(null);
	}

	/**
	 * Exposes readFile to global scope.
	 */
	window.readFile = readFile;
}(window));
