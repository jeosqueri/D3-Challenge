// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Import data
d3.csv("data.csv").then(function(censusData) {

    console.log(censusData);

    //Step 1: Parse data/cast as numbers
    censusData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
    });

    //Step 2: Create scale functions
    var xAxis = d3.scaleLinear()
      .domain(d3.extent(censusData, d => d.poverty))
      .range([0, width]);

    var yAxis = d3.scaleLinear()
      .domain([4, d3.max(censusData, d => d.smokes)])
      .range([height, 0]);

    // Step 3: Create axis functions
    var bottomAxis = d3.axisBottom(xAxis);
    var leftAxis = d3.axisLeft(yAxis);

    // Step 4: Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create cirles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xAxis(d.poverty))
        .attr("cy", d => yAxis(d.smokes))
        .attr("r", "15")
        .attr("fill", "blue")
        .attr("opacity", ".5");
    //Add circle labels
    var circleLabels = chartGroup.selectAll(null).data(censusData).enter().append("text");

    circleLabels
        .attr("x", function(d) {
            return xAxis(d.poverty);
          })
        .attr("y", function(d) {
            return yAxis(d.smokes);
          })
        .text(function(d) {
            return d.abbr;
          })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "white")

    // Create axes labels
    //Y Axis
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smoking (%)");
    //X axis
    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty (%)");

}).catch(function(error) {
    console.log(error);
  });