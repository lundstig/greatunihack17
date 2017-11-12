var baseUrl = "http://10.42.0.150:3000/";

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

refreshData();
setInterval(function() {
  refreshData();
}, 5 * 1000);

tempHistory = document.getElementById('graph2');
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

tempHistory = document.getElementById('graph3');
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


function refreshData() {
  httpGetAsync(baseUrl + "cup/temp/history", function(text) {
    var data = JSON.parse(text);
    var xs = [];
    var ys = [];
    Object.keys(data.temps).forEach(function(time) {
      xs.push(time);
      ys.push(data.temps[time]);
    });

    tempHistory = document.getElementById('graph1');
    Plotly.purge(tempHistory);
    Plotly.plot(tempHistory,
      [{
        x: xs,
        y: ys,
        line: {shape: 'spline'}
      }],
      {
        line: {shape: 'spline'}
      }
    );
  });
}
