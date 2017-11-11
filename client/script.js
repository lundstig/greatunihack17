tempHistory = document.getElementById('tempchart');
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
