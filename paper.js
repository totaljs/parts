require('total4');

var TYPE = 'paper';

PATH.fs.readdir(TYPE, function(err, response) {

	var arr = [];
	var evaluate = function(code) {
		var obj = {};
		new Function('exports', code)(obj);
		return obj;
	};

	try {
		PATH.fs.mkdirSync('cdn');
	} catch(e) {}

	try {
		PATH.fs.mkdirSync('cdn/paper');
	} catch(e) {}

	for (var item of response) {

		var html = F.Fs.readFileSync(PATH.join(TYPE, item)).toString('utf8');
		if (!html)
			continue;

		var parsed = html.parseComponent({ readme: '<readme>', settings: '<settings>', be: '<script total>', html: '<body>', js: '<script>', css: '<style>' });
		var version = parsed.js.match(/exports\.version.*?;/);
		var author = parsed.js.match(/exports\.author.*?;/);
		var color = parsed.js.match(/exports\.color.*?;/);
		var icon = parsed.js.match(/exports\.icon.*?;/);
		var name = parsed.js.match(/exports\.name.*?;/);
		var group = parsed.js.match(/exports\.group.*?;/);
		var preview = parsed.js.match(/exports\.preview.*?;/);

		var obj = {};
		obj.name = name ? evaluate(name[0]).name : '';
		obj.group = group ? evaluate(group[0]).group : '';
		obj.author = author ? evaluate(author[0]).author : '';
		obj.icon = icon ? evaluate(icon[0]).icon : '';
		obj.preview = preview ? evaluate(preview[0]).preview : '';
		obj.color = color ? evaluate(color[0]).color : '';
		obj.version = version ? evaluate(version[0]).version : '';
		obj.js = (parsed.js || '').trim();
		obj.css = (parsed.css || '').trim();
		obj.html = (parsed.html || '').trim();
		arr.push(obj);
	}

	arr.quicksort('name');
	PATH.fs.writeFile('cdn/' + TYPE + '/db.json', JSON.stringify(arr, null, '\t'), NOOP);

});