var WaffleChart = {
    draw: function (chartId, masterdata, colors, chartSquareValue) {     
        var
            margin = { top: 20, right: 30, bottom: 30, left: 40 },
            width = 450,
            height = 330 - margin.top - margin.bottom,
            chartWidth,
            chartHeight,
            widthSquares = 4, //number of columns per row
            heightSquares = 0,
            squareSize = 20,
            squareValue = +chartSquareValue,
            gap = 2;
              
        var color = d3.scale.ordinal().range(colors);

        var data = mapToWaffel(masterdata);

        var maxCodeSize = d3.max(data, function (d) { return d.codeSize; });
        var maxUnits = Math.floor(maxCodeSize / squareValue);
        var maxRows = Math.ceil(maxUnits / widthSquares);

        squareSize = Math.floor(height / maxRows);
        chartWidth = Math.floor(width / data.length);

        var chart = d3.select(chartId)
            .attr("width", width)
            .attr("height", height + margin.top + margin.bottom)
            .append("g");

        var div = d3.select(chartId).append("div")
            .attr("class", "popover scorelink")
            .style("opacity", 0);

        data.forEach(function (d, i) {
            var theData = [];           

            d.codeSize = +d.codeSize;
            d.units = Math.floor(d.codeSize / squareValue);
            Array(d.units + 1).join(1).split('').map(function () {
                theData.push({
                    squareValue: squareValue,
                    units: d.units,
                    codeSize: d.codeSize,
                    groupIndex: i
                });
            });
           
            drawSingleWaffle(theData, chart, div, d.Name, d.navigationUrl, d.codeSize, color(i));         
        });

        var svgLegend = d3.select("#waffle-legend")
            .append("svg")
            .attr("viewBox", "0, 0, " + width + ", " + 100)

        var legend = svgLegend
            .append('g')
            .selectAll("div")
            .data(data)
            .enter()
            .append("g")
            .attr('transform', function (d, i) { return "translate(" + i * chartWidth + ", 0)"; })

        legend.append("text")
            .attr("x", 0)
            .attr("y", 13)
            .text(function (d) { return d.Name; });

        var legend2 = svgLegend
            .append('g')
            .attr('transform', function (d) { return "translate( " + (Math.floor(width / 2) - margin.left) + ", 40)"; });

        legend2.append("rect")
            .attr("width", 14)
            .attr("height", 14)
            .style("fill", function () { return "#CAD5D9"; });

        legend2.append("text")
            .attr("x", 25)
            .attr("y", 13)
            .text((chartSquareValue / 1000).toLocaleString() +  " kilobytes");

        function drawSingleWaffle(singleData, chart, div, deviceName, navigationUrl, codeSize, chartColor) {         
            heightSquares = Math.ceil(singleData.length / widthSquares);           
            chartHeight = (squareSize * heightSquares) + heightSquares * gap + 25;
            var waffle = chart.append("svg")
                .attr("viewBox", "0, 0, " + chartWidth + ", " + chartHeight)
                .append("g")
                .selectAll("div")
                .data(singleData)
                .enter()
                .append("rect")
                .attr("width", squareSize)
                .attr("height", squareSize)
                .attr("fill", function (d) {
                    return color(d.groupIndex);
                })
                .attr("x", function (d, i) {
                    var col = i % widthSquares;
                    return (col * squareSize) + (col * gap);
                })
                .attr("y", function (d, i) {
                    var row = Math.floor(i / widthSquares);
                    return heightSquares * (squareSize + gap) - row * (squareSize + gap);
                });

                waffle.on("mouseover", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(
                        "<div class='popover-body'><h4>" + deviceName + "</h4><span>Code Size</span><h5 style='color:" + chartColor + ";'>" +
                        Math.floor(codeSize / 1000).toLocaleString() + " KB</h5><a href='" + navigationUrl + "'>Score Breakdown</a></div>"
                    )
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY) + "px");
                })
.on("mouseout", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", 0);
                });

            d3.select("#waffle .popover")
                .on("mouseover", function () {
                    d3.select("#waffle .popover").transition()
                        .duration(200)
                        .style("opacity", .9);
                })
                .on("mouseout", function () {
                    d3.select("#waffle .popover").transition()
                        .duration(200)
                        .style("opacity", 0);
                });
        }

        function mapToWaffel(masterRawData) {
            var waffel = [];
            masterRawData.forEach(function (ds) {
                waffel.push({
                    Name: ds.displayName,
                    codeSize: ds.codeComplexity.size,
                    navigationUrl: ds.navigationUrl
                });
            });
            return waffel;
        }
    }
};






