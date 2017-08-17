define(function (require, exports) {let fs = require('fs');
let path = require('path');
let {input, output, prefix, suffix} = require('./config');

exports.transform = (config = {input, output}) => {
    let {input, output} = config;
    fs.readdir(input, (err, files) => {
        if (err) {
            throw new Error('This dir can not be read: ' + input);
        }
        files.forEach(file => {
            if (isDirectory(input, file)) {
                this.transform({input: getPath(input, file), output: getPath(output, file)});
                return;
            }
            if (isTargetFile(file)) {
                let info = {file, output, input};
                this.write(info);
                this.watch(info);
            }
        });
    });
};

function isTargetFile(fileName) {
    let regx = /\.(js)$/;
    return regx.test(fileName);
}

function getPath(pathName, fileName) {
    return path.normalize(pathName + '/' + fileName);
}

function isDirectory(pathName, fileName) {
    if (fileName.indexOf('.') === 0) {
        return false;
    }
    let stat = fs.statSync(getPath(pathName, fileName));
    return stat.isDirectory();
}

exports.write = function (info) {
    let inputFile = getPath(info.input, info.file);
    fs.readFile(inputFile, (err, data) => {
        if (err) {
            throw new Error('This file can not be read: ' + inputFile);
        }
        let outputFile = getPath(info.output, info.file);
        if (!fs.existsSync(info.output)) {
            fs.mkdirSync(info.output);
        }
        fs.writeFileSync(outputFile, prefix + data.toString() + suffix);
    });
};

exports.watch = function (info) {
    // to be continue
};
})