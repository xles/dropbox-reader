/**
 * Le comment.
 */
function readFile(md) 
{
	md = typeof md !== 'undefined' ? md : true;

	file = location.search.substring(1);
	if (!file) {
		document.body.innerHTML = 'No file specified.';
		copyBlurb();
		return false;
	}
	filename = file + '.txt';

	xhr = new XMLHttpRequest();
	xhr.open("GET", filename, true);
	xhr.onreadystatechange = function() {
		document.body.innerHTML = '';
		if (xhr.readyState == 4) {
			if (xhr.status == 404) {
				err = '"' + filename + '" no such file.';
				document.body.innerHTML = err;
			} else {
				if(md == true)
					text = markdown(xhr.responseText);
				else 
					text =    nltop(xhr.responseText);
				
				formatText(file, text);
			}
		}
		copyBlurb();
	}
	xhr.send(null);
}

/**
 * Le comment.
 */
function formatText(file, text)
{
	rawLink = document.createElement('a');
	rawLink.href = file + '.txt';
	rawLink.innerHTML = "View raw file.";
	document.body.appendChild(rawLink);

	document.body.appendChild(text);
	
	article = document.body.getElementsByTagName('div')[0];

	leFirstChild = article.firstChild;
	while (leFirstChild.nodeType != 1) 
		leFirstChild = leFirstChild.nextSibling;
	
	if (leFirstChild.nodeName != 'H1') {
		header = document.createElement('h1');
		header.innerHTML = file.replace('-', ' ');
		document.title = header.innerHTML;
		article.insertBefore(header, leFirstChild);
	} else {
		document.title = leFirstChild.innerHTML;
	}
}

/**
 * Le comment.
 */
function markdown(str)
{
	var parser = new stmd.DocParser();
	var renderer = new stmd.HtmlRenderer();

	article = document.createElement('div');
	article.innerHTML = renderer.render(parser.parse(str));
	return article;
}

/**
 * Le comment.
 */
function nltop(str) 
{
	str = str.replace(/\r\n/g,"\n");
	str = str.replace(/\n\r/g,"\n");
	str = str.replace(/\r/g,  "\n");

	str = str.split("\n\n");

	article = document.createElement('div');
	for (line in str) {
		if (str[line]){
			paragraph = document.createElement('p');
			paragraph.innerHTML = str[line];
			article.appendChild(paragraph);
		}
	}
	return article;
}

/**
 * Le comment.
 */
function copyBlurb()
{
	copy = document.createElement('div');
	copy.className = 'copyright';
	copy.innerHTML = 'Text prettifier &copy; xles 2012<br>'
			+ 'Showdown markdown parser by John Fraser';
	document.body.appendChild(copy);
}
