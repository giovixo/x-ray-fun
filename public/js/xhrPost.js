// This object will be send to the server
/* Example:
var inputData = {
    energy: 200,
    material: "CdTe",
    thickness: 2
};
*/
var inputData = {};

var sendJson = function() {
  // Convert the object into a json string
  var json = JSON.stringify(inputData);

  // Prepare the connection to the server
  var xhr = new XMLHttpRequest();
  var url = "/api/data";
  xhr.open("POST", url);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // Listen for the server response
  document.getElementById("result").innerHTML  = "processing data ...";
  xhr.addEventListener("load", function () {
      var spec = JSON.parse(xhr.responseText);
      document.getElementById("result").innerHTML = "Data sent to the server: ";
      document.getElementById("result").innerHTML += json;
      var data   = spec.data;
      var layout = spec.layout;
      Plotly.newPlot('plotArea', data, layout);
  });

  // Send the data
  xhr.send(json);
};

// Button click listener
window.onload = function() {
  // Material
  inputData.material  = document.getElementById('material').value; // example "15";
  document.getElementById('material').onchange = function() {
    inputData.material = document.getElementById('material').value;
  }
  // Thickness
  inputData.thickness = document.getElementById('thickness').value; //example "2";
  document.getElementById('thickness').onchange = function() {
    inputData.thickness = document.getElementById('thickness').value;
  }
  // Energy (keV)
  inputData.energy    = document.getElementById('energy').value; //example "50";
  document.getElementById('energy').onchange = function() {
    inputData.energy = document.getElementById('energy').value;
  }
  document.getElementById("myBtn").addEventListener("click", sendJson);
};
