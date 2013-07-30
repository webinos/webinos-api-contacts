if(process.platform == "win32"){
	console.log("Windows OS found. Please wait while installing win32ole module and its dependencies..");
	var exec = require('child_process').exec;
	exec('npm install win32ole');  
}