var LollipopChart = {
    draw: function (chartId, masterdata, colors) {
        var lp_color = d3.scale.ordinal().range(colors)
        var lp_margin = { top: 20, right: 30, bottom: 30, left: 50 },
            lp_width = 450 - lp_margin.left,
            lp_height = 390 - lp_margin.top - lp_margin.bottom,
            radius = 10,
            transitionDuration = 750;

        var data = mapToLollipop(masterdata);

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, lp_width], .1);

        var y = d3.scale.linear()
            .range([lp_height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .ticks(5)
            .orient("left");

        var totalWidth = lp_width + lp_margin.left;
        var totalHeight = lp_height + lp_margin.top + lp_margin.bottom;

        var chart = d3.select(chartId)
            .append("svg")
            .attr("viewBox", "0, 0, " + totalWidth + ", " + totalHeight)
            .append("g")
            .attr("transform", "translate(" + lp_margin.left + "," + lp_margin.top + ")");

        var div = d3.select(chartId).append("div")
            .attr("class", "popover scorelink")
            .style("opacity", 0);

        x.domain(data.map(function (d) { return d.name; }));
        y.domain([0, d3.max(data, function (d) { return d.value; })]);

        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + lp_height + ")")
            .call(xAxis);

        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        chart.append("g").selectAll("line")
            .data(data)
            .enter()
            .append("line")
            .attr("class", "lollipop-line")
            .attr("x1", d => x(d.name) + x.rangeBand() / 2)
            .attr("x2", d => x(d.name) + x.rangeBand() / 2)
            .attr("y1", lp_height)
            .attr("y2", lp_height)
            .transition()
            .duration(transitionDuration)
            .attr("y2", d => y(d.value) + radius);

        chart.selectAll('circle')
            .data(data)
            .enter().append('circle')
            .attr('cx', d => x(d.name) + x.rangeBand() / 2)
            .attr('r', radius)
            .attr("cy", lp_height - radius)
            .attr("fill", function (d, i) {
                return lp_color(i);
            })
            .transition()
            .duration(transitionDuration)
            .attr("cy", d => y(d.value));

        chart.selectAll('circle')
            .on("mouseover", function (d, i) {
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(
                    "<div class='popover-body'><h4>" + d.name + "</h4><span># of Libraries</span><h5 style='color:" + lp_color(i) + ";'>" +
                    d.value.toLocaleString() + "</h5><a href='" + d.navigationUrl + "'>Score Breakdown</a></div>"
                )
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY) + "px");
            })            
            .on("mouseout", function (d) {
                div.transition()
                    .duration(200)
                    .style("opacity", 0);
        });

        d3.select("#libraries-chart .popover")
            .on("mouseover", function () {
                d3.select("#libraries-chart .popover").transition()
                    .duration(200)
                    .style("opacity", .9);
            })
.on("mouseout", function () {
            d3.select("#libraries-chart .popover").transition()
                .duration(200)
                .style("opacity", 0);
        });

        function type(d) {
            d.value = +d.value;
            return d;
        }

        function mapToLollipop(masterData) {

            var lollipop = [];

            masterData.forEach(function (ds) {
                lollipop.push({
                    name: ds.displayName,
                    value: ds.codeComplexity.libraries,
                    navigationUrl: ds.navigationUrl
                });
            });

            return lollipop;
        }
    }
}


