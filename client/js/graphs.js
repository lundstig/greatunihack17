tempHistory = document.getElementById('graph1');
Plotly.plot(tempHistory,
  [{
    x: [1, 3, 11, 26, 27],
    y: [1, 2, 4, 8, 16],
    line: {shape: 'spline'}
  }],
  {
    line: {shape: 'spline'}
  }
);

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
