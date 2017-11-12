var baseUrl = "http://" + location.host + "/";

window.onload = function(){
  console.log("Hello bitchS")
  initTempData();
  setInterval(function() {
    refreshData();
  }, 1 * 1000);

}





function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}



/*
tempHistory = document.getElementById('graph1');
Plotly.newPlot(tempHistory,
  [{
    x: [1, 2, 3, 5, 9],
    y: [3, 4, 5, 7, 12],
    line: {shape: 'spline'}
  }], layout);


Plotly.extendTraces(tempHistory, {
  x: [[10,11,12,13,14]],
  y: [[3, 4, 5, 7, 13]]
}, [0]);





tempHistory = document.getElementById('graph3');

tempHistory = document.getElementById('graph4');
Plotly.plot(tempHistory,
  [{
    x: [1, 2, 3, 5, 9],
    y: [3, 4, 5, 7, 12],
    line: {shape: 'spline'}
  }],
  {
    line: {shape: 'spline'}
  }
);
*/
// 
// function runningAverage(data){
//   var output = [];
//   var lastN = [];
//   var Nn = 5;
//   Object.keys(data.temps).forEach(function(time){
//     if(lastN.length < Nn){
//       lastN.push(data.temps)
//     }
// 
//   });
// }


function initTempData() {
  httpGetAsync(baseUrl + "cup/temp/history", function(text) {
    var data = JSON.parse(text);
    var xs = [];
    var ys = [];
    
    var tempHistory = document.getElementById('graph1');
  
    
    data.data.forEach(function(obj) {
      var dateD = new Date(parseInt(obj[0])) ;
      xs.push(dateD);
      ys.push(obj[1]);
    });

    var data_update = [{
      x: xs,
      y: ys,
      line: {shape: 'spline'}
    }];
    
    var layout = {
      title: 'Temperature',
      xaxis: {
        title: 'Time',
        showgrid: true
      },
      yaxis: {
        title: 'Temperature',
        showgrid: true
      }
      
    }
    
    Plotly.newPlot(tempHistory,data_update,layout);
  });
}


function refreshData() {
  httpGetAsync(baseUrl + "cup/temp/history", function(text) {
    var data = JSON.parse(text);
    var xs = [];
    var ys = [];
    
    var tempHistory = document.getElementById('graph1');
    //console.log(tempHistory.data[0].x)
    data.data.forEach(function(obj,i) {
      var dateD = new Date(parseInt(obj[0])) ;
      if(tempHistory.data[0].x.map(Number).indexOf(+dateD) != -1){
        return;
      }
      xs.push(dateD);
      ys.push(obj[1]);
    });

    var data_update = {
      x: [xs],
      y: [ys]
    };
    
    var layout = {
      title: 'Temperature',
      xaxis: {
        title: 'Time',
        showgrid: true
      },
      yaxis: {
        title: 'Temperature',
        showgrid: true
      }
      
    }
    var desiredTemp = 68;
    var timeToEnd = Math.log(desiredTemp/data.reg.coeffs[0])/data.reg.coeffs[1];
    
    document.getElementById('teaTime').innerHTML = Math.floor(timeToEnd/60*10)/10;
    document.getElementById('coeffA').innerHTML = data.reg.coeffs[0]
    document.getElementById('coeffB').innerHTML = data.reg.coeffs[1];
    
    

    Plotly.extendTraces(tempHistory, data_update, [0]);
  });
}
