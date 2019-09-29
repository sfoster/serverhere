var connect = require('connect'),
    dirlisting = require('./directory'),
    fs = require('fs'),
    http = require('http'),
    https = require('https'),
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
  tlsPort: 33443,
  hostname: '0.0.0.0',
  verbose: false,
  logger: 'short'
};
var appConfig = delegate(configDefaults, argv);
var verbose = appConfig.verbose;
var sslOptions = {};
var keyFilename;
var certFilename;


if(require.main === module){
  process.title = 'serverhere'; // make us easier to find and kill

  if("help" in argv){
    var helpStr = "Usage: node index.js [options]\n\n";
      helpStr += "Options:\n";
    Object.keys(configDefaults).forEach(function(name){
      helpStr += "  --"+name+ " "+ configDefaults[name] + "\n";
    });
    console.log(helpStr);
  } else {
    var app = connect();
    app.use(connect.static(appConfig.docRoot))
    app.use(dirlisting(appConfig.docRoot));

    var httpServer = http.createServer(app)
                    .listen(appConfig.port);

    sslOptions = {};
    if (appConfig.hostname == "0.0.0.0") {
      keyFilename = `${__dirname}/keys/localhost.key`;
      certFilename = `${__dirname}/keys/localhost.crt`;
    } else {
      keyFilename = `${__dirname}/keys/${appConfig.hostname}/key.pem`;
      certFilename = `${__dirname}/keys/${appConfig.hostname}/cert.pem`;
    }
    console.log("Exists? ", fs.existsSync(keyFilename), fs.existsSync(certFilename));
    if (fs.existsSync(keyFilename) && fs.existsSync(certFilename)) {
      var sslOptions = {
        key: fs.readFileSync(keyFilename).toString(),
        cert: fs.readFileSync(certFilename).toString(),
        rejectUnauthorized: false
      };
      var sslServer = https.createServer(sslOptions, app)
                      .listen(appConfig.tlsPort);
    }
  }
  console.log('serving on http://%s:%s out of %',
              appConfig.hostname, appConfig.port, appConfig.docRoot);

  if (sslOptions.key && sslOptions.cert) {
    console.log('serving on https://%s:%s out of %',
              appConfig.hostname, appConfig.tlsPort, appConfig.docRoot);
  } else {
    console.log("Couldnt start sslServer, no key/cert found for hostname: " + appConfig.hostname);
    console.log(`I looked for ${keyFilename} and ${certFilename}`);
  }
}
