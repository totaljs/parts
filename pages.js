require('total4');

var TYPE = 'pages';

PATH.fs.readdir(TYPE, function(err, response) {

	var arr = [];
	var evaluate = function(code) {
		var obj = {};
		new Function('exports', code)(obj);
		return obj;
	};

	response.wait(function(filename, next) {

		var data = {};
		data.id = filename;

		PATH.fs.readFile(TYPE + '/' + filename + '/index.html', function(err, response) {

			data.size = response.length;
			response = response.toString('utf8');

			var version = response.match(/exports\.version.*?;/);
			var author = response.match(/exports\.author.*?;/);
			var color = response.match(/exports\.color.*?;/);
			var icon = response.match(/exports\.icon.*?;/);
			var name = response.match(/exports\.name.*?;/);
			var group = response.match(/exports\.group.*?;/);
			var preview = response.match(/exports\.preview.*?;/);

			data.group = group ? evaluate(group[0]).group : '';
			data.name = name ? evaluate(name[0]).name : '';
			data.author = author ? evaluate(author[0]).author : '';
			data.icon = icon ? evaluate(icon[0]).icon : '';
			data.preview = preview ? evaluate(preview[0]).preview : '';
			data.color = color ? evaluate(color[0]).color : '';
			data.version = version ? evaluate(version[0]).version : '';

			PATH.fs.writeFile('cdn/' + TYPE + '/' + data.id + '.html', response, NOOP);
			arr.push(data);
			next();
		});

	}, function() {
		arr.quicksort('name');
		PATH.fs.writeFile('cdn/' + TYPE + '/db.json', JSON.stringify(arr, null, '\t'), NOOP);
	});

});