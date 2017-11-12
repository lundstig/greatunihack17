var baseUrl = "http://" + location.host + "/";



window.onload = function() {
  initTempData();
  initSipData();
  setInterval(function() {
    refreshTempData();
    refreshSipData();
    
  }, 1 * 1000);
  document.getElementById('auto-dip').onchange = function(e){
    if(this.checked){
      document.getElementById('manual-dip-div').hidden = true;
      httpPostAsync(baseUrl + "cup/commands", "{\"autodip\":true, \"dip\":false}", function(){})
    } else {
      document.getElementById('manual-dip-div').hidden = false;
      httpPostAsync(baseUrl + "cup/commands", "{\"autodip\":true, \"dip\":" + document.getElementById('manual-dip').checked + "}", function(){})
    }
  }
  document.getElementById('manual-dip').onchange = function(e){
    if(this.checked){
      httpPostAsync(baseUrl + "cup/commands", "{\"autodip\":false, \"dip\":true}", function(){})
    } else {
      httpPostAsync(baseUrl + "cup/commands", "{\"autodip\":false, \"dip\":false}", function(){})
    }
  
  }
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

function httpPostAsync(theUrl, data, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
    xmlHttp.setRequestHeader("Content-type", "application/json");
    xmlHttp.send(data);
}



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
        showgrid: true,
        //range:[Date.now()-1*60*1000, Date.now()],

        type: 'date'
      },
      yaxis: {
        title: 'Temperature',
        showgrid: true
      }
      
    }
    
    Plotly.newPlot(tempHistory,data_update,layout);
  });
}


function refreshTempData() {
  httpGetAsync(baseUrl + "cup/temp/history", function(text) {
    var data = JSON.parse(text);
    var xs = [];
    var ys = [];
    
    
    if(!data.autodip){
      document.getElementById('auto-dip').checked = false;
    }
    
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
    

    if(data.reg != null){
      document.getElementById('infoText').hidden = false;
      var desiredTemp = 68;
      var timeToEnd = Math.log(desiredTemp/data.reg.coeffs[0])/data.reg.coeffs[1];
      
      var teaTime = Math.floor(timeToEnd/60*10)/10;
      var teaTimeText;
      if (teaTime < 0)
        teaTimeText = "Your tea is ready to drink!";
      else
        teaTimeText = "Your tea should be ready in " + teaTime + " minutes."
      document.getElementById('teaTime').innerHTML = teaTimeText;

      document.getElementById('coeffA').innerHTML = data.reg.coeffs[0]
      document.getElementById('coeffB').innerHTML = data.reg.coeffs[1];
    } else {
      document.getElementById('infoText').hidden = true;
    }
    
    var update = {
    
      'xaxis.range': [Date.now()-10*60*1000, Date.now()],   // updates the xaxis 
    };
    Plotly.relayout(tempHistory, update)
    

    Plotly.extendTraces(tempHistory, data_update, [0]);
  });
}

function initSipData(){
  httpGetAsync(baseUrl + "cup/sips/history", function(text) {
    var data = JSON.parse(text);
    var xs = [];
    var ys = [];
    
    var tempHistory = document.getElementById('graph2');
    //console.log(data)
    data.sips.forEach(function(obj) {
      var dateD = new Date(parseInt(obj)) ;
      xs.push(dateD);
      ys.push(1);
    });

    var data_update = [{
      x: xs,
      y: ys,
      type:"bar"
    }];
    
    var layout = {
      title: 'Sips',
      xaxis: {
        title: 'Time',
        showgrid: true
      },
      yaxis: {
        title: 'Sips',
        showgrid: true
      }
      
    }
    
    Plotly.newPlot(tempHistory,data_update,layout);
  });
}

function refreshSipData(){
  httpGetAsync(baseUrl + "cup/sips/history", function(text) {
    var data = JSON.parse(text);
    var xs = [];
    var ys = [];
    
    var tempHistory = document.getElementById('graph2');
    //console.log(data)
    data.sips.forEach(function(obj,i) {
      var dateD = new Date(parseInt(obj)) ;
      if(tempHistory.data[0].x.map(Number).indexOf(+dateD) != -1){
        return;
      }
      xs.push(dateD);
      ys.push(1);
    });

    var data_update = {
      x: [xs],
      y: [ys]
    };
    
    var update = {
    
      'xaxis.range': [Date.now()-10*60*1000, Date.now()],   // updates the xaxis 
    };
    Plotly.relayout(tempHistory, update)
    Plotly.extendTraces(tempHistory, data_update, [0]);
  });
}
