var w = 500,
    h = 500;

var colorscale =  d3.scale.ordinal().range(["#9DE6EB", "#EF6050" , "#90E89D", "#FFD2A8"])
//Legend titles
var LegendOptions = ['Windows 10', 'OSX El Capitan', 'Linux Ubuntu'];

var introcfg = {
    w: w,
    h: h,
    maxValue: 100,
    levels: 5,
   ExtraWidthX: 80,
	color: d3.scale.ordinal().range(["#BFDB7E", "#EF6050"])
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
//RadarChart.draw("#chart", OS, mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

var svg = d3.select('#body')
    .selectAll('svg')
    .append('svg')
    .attr("width", w + 300)
    .attr("height", h)

//Create the title for the legend
var text = svg.append("text")
    .attr("class", "title")
    .attr('transform', 'translate(90,0)')
    .attr("x", w - 70)//shiafun
    //.attr("x", 0)//shiafun
    .attr("y", 15)
    .attr("font-size", "20px")
    .attr("fill", "#404040")
    .text("Major Operating Systems");

//Initiate Legend	
var legend = svg.append("g")
    .attr("class", "legend")
    .attr("height", 100)
    .attr("width", 200)
    .attr('transform', 'translate(90,20)')
    ;
//Create colour squares
legend.selectAll('rect')
    .data(LegendOptions)
    .enter()
    .append("rect")
    .attr("x", w - 65)
    .attr("y", function (d, i) { return i * 20; })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function (d, i) { return colorscale(i); })
    ;
//Create text next to squares
legend.selectAll('text')
    .data(LegendOptions)
    .enter()
    .append("text")
    .attr("x", w - 52)
    .attr("y", function (d, i) { return i * 20 + 9; })
    .attr("font-size", "14px")
    .attr("fill", "#737373")
    .text(function (d) { return d; })
    ;	

//d3.selection.prototype.bringElementAsTopLayer = function() {
//       return this.each(function(){
//           var nextSibling = d3.select("rect.radar-chart-serie0").node();  
//     this.parentNode.insertBefore(this, nextSibling);
//   });
//};