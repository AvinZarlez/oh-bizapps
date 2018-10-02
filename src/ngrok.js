var config = require('config');
var replace = require('replace-in-file');
var ngrok = require('ngrok');
var fs = require('fs');
var jszip = require('jszip');

async function run() {
    try {
        let ngrokUri = await ngrok.connect(config.app.port);

        console.error('ngrok uri: ', ngrokUri);

        // Ensure there is a build folder to copy to
        fs.mkdir('./build/', function (err) {}); 
        fs.copyFileSync('./src/manifest.json', './build/manifest.json')
        let changes = await replace({
            files: './build/manifest.json',
            from: /\{BASE_URI\}/g,
            to: ngrokUri,
        });

        let zip = new jszip();
        
        zip.file('manifest.json', fs.readFileSync('./build/manifest.json'));

        let imageFiles = fs.readdirSync('./src/static/images');
        await imageFiles.forEach(file => {
            zip.file(file, fs.readFileSync('./src/static/images/'+file));            
        });

        zip
            .generateNodeStream({type:'nodebuffer',streamFiles:true})
            .pipe(fs.createWriteStream('./build/package.zip'))
            .on('finish', function () {
                // JSZip generates a readable stream with a "end" event,
                // but is piped here in a writable stream which emits a "finish" event.
                console.log('Package created...'+
                    `Hit https://teams.microsoft.com and add ./build/package.zip as a custom app...`)
            }); 

        console.log(`Remember to hit https://dev.botframework.com/bots/ and change your messaging configuration endpoint to ${ngrokUri}/api/messages`);
    } catch (error) {
        console.error('Error occurred: ', error);
    }
}

run();