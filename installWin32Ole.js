if(process.platform == "win32"){
	console.log("Windows OS found...");
	var exec = require('child_process').exec;
	exec('npm install win32ole');  
}