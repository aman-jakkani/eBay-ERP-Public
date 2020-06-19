const express = require('express')
const {spawn} = require('child_process');
const app = express()
const port = 3000

app.get('/', (req, res) => {
	
	var dataToSend ;
	var largeDataSet = [];
	



	// spawn new child process to call the python script
	const python = spawn('python3', ['techsouptest.py']);
	// const python = spawn('./node_modules/nopy', ['techsouptest.py']);




	// collect data from script
	python.stdout.on('data', function (data) {
		console.log('Pipe data from python script ...');
		//dataToSend =  data;
		largeDataSet.push(data);
	});
	// in close event we are sure that stream is from child process is closed
	python.on('close', (code) => {
	console.log(`child process close all stdio with code ${code}`);
	// send data to browser
	res.send(largeDataSet.join(""))
	});
	var uint8arrayToString = function(data){
		return String.fromCharCode.apply(null, data);
	  };
	python.stderr.on('data', (data) => {
		// As said before, convert the Uint8Array to a readable string.
		console.log("stderr");
		console.log(uint8arrayToString(data));
	  });
	

})
app.listen(port, () => console.log(`Example app listening on port 
${port}!`))