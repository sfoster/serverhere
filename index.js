var connect = require('connect'), 
	express = require('express'), 
	cwd = process.cwd(), 
    argv = require('optimist').argv, 
	docRoot = cwd;

// delegation the way I like it
var delegate = function(proto, mixin){
	var o = Object.create(proto);
	if(mixin){
		for(var i in mixin) o[i] = mixin[i];
	}
	return o;
};

var server = express.createServer();

//
// set up config for the server,
//      overriding defaults from argv
//
var configDefaults = {
	docRoot : docRoot,
	port: 3000, 
	hostname: 'localhost',
	verbose: false,
	logger: 'short'
};
var appConfig = delegate(configDefaults, argv);

var verbose = appConfig.verbose;

server.configure(function(){
	if(appConfig.logger){
	    server.use(express.logger(appConfig.logger));
	}
    server.use(express['static'](appConfig.docRoot));
	server.use(express.directory(appConfig.docRoot));
});

if(require.main === module){
	if("help" in argv){
		var helpStr = "Usage: node index.js [options]\n\n";
			helpStr += "Options:\n";
		Object.keys(configDefaults).forEach(function(name){
			helpStr += "  --"+name+ " "+ configDefaults[name] + "\n";
		});
		console.log(helpStr);
	} else {
		server.listen(appConfig.port, appConfig.hostname);
	}
	console.log('serving on %s:%s; out of %', appConfig.hostname, appConfig.port, appConfig.docRoot);
}
