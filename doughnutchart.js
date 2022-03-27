var xValues = ["PM2.5", "PM10", "Temperature", "Pressure"];
var yValues = [3, 3, 3, 3];
var barColors = [
  "#b91d47",
  "#00aba9",
  "#2b5797",
  "#e8c3b9"
  // "#1e7145"
];

new Chart("doughnutChart", {
  type: "doughnut",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    title: {
      display: true,
      text: "Title"
    }
  }
});