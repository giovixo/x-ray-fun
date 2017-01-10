/*
* An object containing all the vents
*/
var events = {};

/*
* dataRead
*
* Read the data from the event file
*/
var dataRead = function (file) {
  var jsonfile = require('jsonfile');
  events = jsonfile.readFileSync(file);
}

/*
* buildSpec
*	Build an object with the spectrum ready for plotting
*/
var buildSpec = function (en, spec, enMax) {
	spec[0] = 0;
	return {
		data: [{
			type: 'bar',
			marker: {symbol: 1, size: 10, color: 'blue'},
			x: en,
			y: spec
		}],
		layout: {
			title: "Detected energy",
			xaxis: {title: 'Energy (keV)', titlefont: {size: 18}, range: [0, enMax + 10]},
			yaxis: {title: 'no. photons', titlefont: {size: 18}, type: "log"}
    	}
  };
};

/*
* dataProcessing
*
* Process the data
*/
var dataProcessing = function() {
  var x = events;
  //console.log(">> Processing data...");
  //console.log('Keywords:');
  //console.log(Object.getOwnPropertyNames(x));
  var nLines = x.EVT_ID.length;
  //console.log('No. lines: ' + nLines);

  // The array containig the energies
  //var n = 1000000;
	var n = nLines;
  var energyDepArray = new Array(n);
  // The array containig the energy spectrum
  var m = 6000;
  var energy = new Array(m);
  var energySpec = new Array(m);
  for (i = 0; i < m; i++) {
    energy[i] = i;
    energySpec[i] = 0;
  }
  // Loop over the data
  energyDep = 0;
  energyDepArray[0] = 0;
	var i = 0;
	for (i = 1; i < nLines; i++) {
		if (x.EVT_ID[i] == x.EVT_ID[i-1]) {
			energyDep += x.E_DEP[i];
		} else {
			energyDepArray[x.EVT_ID[i]] = energyDep;
			energyDep = x.E_DEP[i];
		}
	}
	energyDepArray[x.EVT_ID[nLines-1]] = energyDep;
  // Evaluate the energy spectrum
  for (i = 0; i < nLines; i++) {
    energySpec[Math.round(energyDepArray[i])] += 1;
  }
  // Evaluate the maximum energy
  var maxEnergy = 0.;
  for (i = 0; i < x.EVT_ID[nLines-1]; i++) {
    maxEnergy = Math.max(maxEnergy, energyDepArray[i]);
  }
  // Build the spectrum object
  var objSpec = buildSpec(energy, energySpec, maxEnergy);
  return objSpec;
};

/*
  Get the file name from req.body json string
*/
var getFileName = function (obj) {
  fileName = obj.material + '.' + obj.thickness + '.' + obj.energy + '.1000000ph.MONO.json';
  return fileName;
}


module.exports = {
    getFileName: getFileName,
    loadData: dataRead,
    getSpec: dataProcessing
};
