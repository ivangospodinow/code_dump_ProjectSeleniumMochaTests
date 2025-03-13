let buildNumber = 0;
for (let str of process.argv) {
    if (str.includes('--BUILD_NUMBER=')) {
        buildNumber = parseInt(str.split('--BUILD_NUMBER=')[1]);
        break;
    }
}
if (!buildNumber) {
    console.log('build number is required');
}


// --BUILD_NUMBER
module.exports.xunitReporterOptions = {
    "id": "xunit",
    "output": "reports/xunit-" + buildNumber + ".xml"
};
