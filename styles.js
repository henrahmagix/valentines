var fs = require('fs');
var sass = require('node-sass')
var bourbon = require('node-bourbon');

var result = sass.renderSync({
    file: 'sass/valentines.sass',
    outFile: 'css/valentines.css',
    includePaths: bourbon.with('font-awesome-4.3.0/scss'),
    outputStyle: 'compressed'
});

if (!fs.existsSync('css')) {
    fs.mkdirSync('css');
}
fs.writeFileSync('css/valentines.css', result.css);
