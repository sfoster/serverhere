var st = require('st'),
    http = require('http'),
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

if(require.main === module){
  if("help" in argv){
    var helpStr = "Usage: node index.js [options]\n\n";
      helpStr += "Options:\n";
    Object.keys(configDefaults).forEach(function(name){
      helpStr += "  --"+name+ " "+ configDefaults[name] + "\n";
    });
    console.log(helpStr);
  } else {

    var mount = st({
      path: appConfig.docRoot,
      url: '/',
      index: true,
      dot: false,
      cache: false
    });

    http.createServer(function(req, res){
      if( mount(req, res)) return;
      if(appConfig.verbose) {
        console.log("Unable to handle request for " + req.url);
      }
    }).listen(appConfig.port, appConfig.hostname);

  }
  console.log('serving on %s:%s; out of %', appConfig.hostname, appConfig.port, appConfig.docRoot);
}
