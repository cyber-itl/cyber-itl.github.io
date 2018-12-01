var RadarChart = {
    draw: function (id, d, options) {
        var cfg = {
            radius: 5,
            w: 500,
            h: 500,
            factor: 1,
            factorLegend: .85,
            levels: 3,
            maxValue: 0,
            radians: 2 * Math.PI,
            opacityArea: 0.66,
            ToRight: 5,
            TranslateX: 40,
            TranslateY: 40,
            ExtraWidthX: 0,
            ExtraWidthY: 0,
            color: d3.scale.ordinal().range(["#9DE6EB", "#EF6050" , "#90E89D", "#FFD2A8"])
        };

        if ('undefined' !== typeof options) {
            for (var i in options) {
                if ('undefined' !== typeof options[i]) {
                    cfg[i] = options[i];
                }
            }
        }
        cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function (i) { return d3.max(i.map(function (o) { return o.value; })) }));
        var allAxis = (d[0].map(function (i, j) { return i.axis }));
        var total = allAxis.length;
        var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
        var Format = d3.format('');
        d3.select(id).select("svg").remove();
        var totalWidth = cfg.w + cfg.ExtraWidthX;
        var totalHeight = cfg.h + cfg.ExtraWidthY;

        var g = d3.select(id)
            .append("svg")
            .attr("viewBox", "0, 0, " + totalWidth + ", " + totalHeight)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");
        ;

        var tooltip;

        //Circular segments
        for (var j = 0; j < cfg.levels; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
                .data(allAxis)
                .enter()
                .append("svg:line")
                .attr("x1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
                .attr("y1", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
                .attr("x2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total)); })
                .attr("y2", function (d, i) { return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total)); })
                .attr("class", "line")
                .style("stroke", "#4C596B")
                .style("stroke-opacity", "1")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
        }

        //Text indicating at what % each level is
        for (var j = 0; j < cfg.levels; j++) {
            var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
            g.selectAll(".levels")
                .data([1]) //dummy data
                .enter()
                .append("svg:text")
                .attr("x", function (d) { return levelFactor * (1 - cfg.factor * Math.sin(0)); })
                .attr("y", function (d) { return levelFactor * (1 - cfg.factor * Math.cos(0)); })
                .attr("class", "legend")
                .style("font-family", "sans-serif")
                .style("font-size", "10px")
                .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
                .attr("fill", "#737373")
                .text(Format((j + 1) * cfg.maxValue / cfg.levels));
        }

        series = 0;
		timeDelay = 0;
		selectedSeries = 0;

        var axis = g.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", cfg.w / 2)
            .attr("y1", cfg.h / 2)
            .attr("x2", function (d, i) { return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)); })
            .attr("y2", function (d, i) { return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)); })
            .attr("class", "line")
            .style("stroke", "#4C596B")
            .style("stroke-width", "1px");

        axis.append("text")
            .attr("class", "legend")
            .style("font-family", "sans-serif")
            .style("font-size", "14px")
            .attr("dy", "1.5em")
            .attr("y", function (d, i) { return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total); });
		
		  axis.each(function (d, i) {
            if (i === 0) {
				var that = this;
				 d3.select(that).append('path')
				.attr('d', 'M23.25,6a2.361,2.361,0,0,0-.375-1.266,2.451,2.451,0,0,0-1.031-.8l-9-3.75a2.109,2.109,0,0,0-1.688,0l-9,3.75a1.99,1.99,0,0,0-1.031.8A2.018,2.018,0,0,0,.75,6a21.275,21.275,0,0,0,1.594,8.3,17.664,17.664,0,0,0,3.89,6.047,13.741,13.741,0,0,0,4.922,3.469,1.8,1.8,0,0,0,1.688,0,13.929,13.929,0,0,0,4.5-3.047,20.288,20.288,0,0,0,4.125-5.907A21.823,21.823,0,0,0,23.25,6ZM12,20.906V3.047l8.25,3.469a18.164,18.164,0,0,1-2.531,9.047A13.581,13.581,0,0,1,12,20.906Z')
				.attr("transform", function () { 
					 var transX = cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total) -11 ;
					 var transY = cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total) -20;
					 return "translate("+transX+", "+transY+")" })
		.attr('fill','#CAD5D9');
				var str = d.split(" ")
				d3.select(that).select("text")
				  .attr("text-anchor", "start")
				            .attr("transform", function (d, i) { return "translate(25, -30)" })
							.append("tspan")
            .text(function (d) { 
			return str[0]
		})
				 .attr("x", function () { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); });
					d3.select(that).select("text")
							.append("tspan")
            .text(function (d) { 
			return str[1]
		})
				 .attr("x", function () { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); })
				.attr("dy","15");
			}

              //Commenting out until Crash Testing is available
		//	   else if (i === 1) {
		//		var that = this;
		//		 d3.select(that).append('path')
		//		.attr('d', 'M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12c2.5,0,4.9-0.8,6.9-2.2c3.2-2.2,5.1-5.9,5.1-9.8 C24,5.4,18.6,0,12,0z M2,12C2,6.5,6.5,2,12,2v10h10c0,5.5-4.5,10-10,10V12H2z')
		//		.attr("transform", function () { 
		//			 var transX = cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total) -11 ;
		//			 var transY = cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total) -10;
		//			 return "translate("+transX+", "+transY+")" })
		//.attr('fill','#CAD5D9');
		//		 var str = d.split(" ")
		//		d3.select(that).select("text")
		//		     .attr("text-anchor", "middle")
		//		            .attr("transform", function (d, i) { return "translate(0, 25)" })
		//					.append("tspan")
  //          .text(function (d) { 
		//	return str[0]
		//})
		//		 .attr("x", function () { 
		//			return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); });
		//			d3.select(that).select("text")
		//					.append("tspan")
  //          .text(function (d) { 
		//	return str[1]
		//})
		//		 .attr("x", function () { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); })
		//		.attr("dy","15");
		//	}
			     else if (i === 1) {
				var that = this;
				 d3.select(that).append('path')
				.attr('d', 'M18,6.75c0,0.81-0.23,1.55-0.7,2.2s-1.08,1.11-1.83,1.36c-0.03,1.31-0.38,2.38-1.03,3.19 c-0.59,0.72-1.44,1.23-2.53,1.55c-0.66,0.19-1.66,0.34-3,0.47H8.86c-0.78,0.09-1.34,0.16-1.69,0.19c-0.59,0.13-1.05,0.27-1.36,0.42 s-0.55,0.36-0.7,0.61c0.72,0.28,1.3,0.74,1.73,1.38s0.66,1.35,0.66,2.13c0,1.03-0.37,1.91-1.1,2.65S4.78,24,3.75,24 s-1.91-0.37-2.65-1.1S0,21.28,0,20.25c0-0.84,0.24-1.59,0.73-2.25s1.12-1.09,1.9-1.31V7.31C1.84,7.09,1.21,6.66,0.73,6 S0,4.59,0,3.75C0,2.72,0.37,1.84,1.1,1.1S2.72,0,3.75,0S5.66,0.37,6.4,1.1s1.1,1.62,1.1,2.65C7.5,4.59,7.26,5.34,6.77,6 s-1.12,1.09-1.9,1.31v6.75c0.5-0.22,1.11-0.39,1.83-0.52c0.44-0.09,1.09-0.19,1.97-0.28c1.13-0.09,1.92-0.19,2.39-0.28 c0.75-0.19,1.29-0.48,1.62-0.89s0.51-0.98,0.54-1.73c-0.81-0.25-1.47-0.7-1.97-1.36S10.5,7.59,10.5,6.75c0-1.03,0.37-1.91,1.1-2.65 S13.22,3,14.25,3s1.91,0.37,2.65,1.1S18,5.72,18,6.75z M3.75,2.75c-0.29,0-0.53,0.09-0.72,0.28S2.75,3.46,2.75,3.75 s0.09,0.53,0.28,0.72s0.43,0.28,0.72,0.28s0.53-0.09,0.72-0.28s0.28-0.43,0.28-0.72S4.66,3.22,4.47,3.03S4.04,2.75,3.75,2.75z M3.75,21.25c0.29,0,0.53-0.09,0.72-0.28s0.28-0.43,0.28-0.72s-0.09-0.53-0.28-0.72s-0.43-0.28-0.72-0.28s-0.53,0.09-0.72,0.28 s-0.28,0.43-0.28,0.72s0.09,0.53,0.28,0.72S3.46,21.25,3.75,21.25z M14.25,5.75c-0.29,0-0.53,0.09-0.72,0.28s-0.28,0.43-0.28,0.72 s0.09,0.53,0.28,0.72s0.43,0.28,0.72,0.28s0.53-0.09,0.72-0.28s0.28-0.43,0.28-0.72s-0.09-0.53-0.28-0.72S14.54,5.75,14.25,5.75z')
				.attr("transform", function () { 
					 var transX = cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total) -11 ;
					 var transY = cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total) -10;
					 return "translate("+transX+", "+transY+")" })
		.attr('fill','#CAD5D9');
					 
					 				var str = d.split(" ")
				d3.select(that).select("text")
					 .attr("text-anchor", "middle")
				            .attr("transform", function (d, i) { return "translate(0, 25)" })
							.append("tspan")
            .text(function (d) { 
			return str[0]
		})
				 .attr("x", function () { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); })
					d3.select(that).select("text")
							.append("tspan")
            .text(function (d) { 
			return str[1]
		})
				 .attr("x", function () { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); })
				.attr("dy","15");
			}
			  			    else if (i === 2) {
				var that = this;
				 d3.select(that).append('g')
					.attr("transform", function () { 
					 var transX = cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total) -11 ;
					 var transY = cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total) -10;
					 return "translate("+transX+", "+transY+")" })
					.append('path')
				.attr('d', 'M11.4,5.2V0.8H7.9v4.3c-4.4,0.8-7.7,4.6-7.7,9.2v2.5c0,0.5,0.4,0.9,0.9,0.9h16.8c0.5,0,0.9-0.4,0.9-0.9v-2.5C18.8,9.8,15.6,6,11.4,5.2z M16.1,15H2.9v-0.6c0-3.6,2.9-6.6,6.6-6.6c3.6,0,6.6,2.9,6.6,6.6V15z')
		.attr('fill','#CAD5D9');
								d3.select(that).select("g")
								.append('rect')
								.attr("width","1.8")
								.attr("height","8.2")
								.attr("x","2")
								.attr("y","21.8")
								.attr('fill','#CAD5D9');
								d3.select(that).select("g")
								.append('rect')
								.attr("width","1.8")
								.attr("height","8.2")
								.attr("x","8.6")
								.attr("y","21.8")
								.attr('fill','#CAD5D9');
								d3.select(that).select("g")
								.append('rect')
								.attr("width","1.8")
								.attr("height","8.2")
								.attr("x","15.2")
								.attr("y","21.8")
								.attr('fill','#CAD5D9');
					
				var str = d.split(" ")
				d3.select(that).select("text")
								.attr("text-anchor", "middle")
				            .attr("transform", function (d, i) { return "translate(0, 25)" })
							.append("tspan")
            .text(function (d) { 
			return str[0]
		})
				 .attr("x", function () { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); })
					d3.select(that).select("text")
							.append("tspan")
            .text(function (d) { 
			return str[1]
		})
				 .attr("x", function () { return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total); })
				.attr("dy","15");
			}
			  
		  });
		


        d.forEach(function (y, x) {
            dataValues = [];
			holdOpacity= ".1";
			highlight = "";
			if(series==0){
				holdOpacity=".66";
				highlight = " highlight";
			}
            g.selectAll(".nodes")
                .data(y, function (j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                });
            dataValues.push(dataValues[0]);
            g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie" + series+highlight)
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series))
                .attr("points", function (d) {
                    var str = "";
                    for (var pti = 0; pti < d.length; pti++) {
						str = str + 250 + "," + 250 + " ";
						
                    }
                    return str;
                })
                .style("fill", function (j, i) { return cfg.color(series) })
                .style("fill-opacity", holdOpacity)
				.transition(433)
				.delay(timeDelay)
				.ease("easeExp")
				.attr("points", function (d) {
                    var str = "";
                    for (var pti = 0; pti < d.length; pti++) {
                        str = str + d[pti][0] + "," + d[pti][1] + " ";
						
                    }
                    return str;
                })
            series++;
			timeDelay = timeDelay + 100;
        });
        series = 0;
		
//		 d.forEach(function (y, x) {
//			
//			 g.selectAll("polygon")
//			 .on('mouseover', function (d) {
//                    z = "polygon." + d3.select(this).attr("class");
//                    g.selectAll("polygon")
//                        .transition(200)
//                        .style("fill-opacity", 0.1);
//                    g.selectAll(z)
//                        .transition(200)
//                        .style("fill-opacity", .7);
//                })
//                .on('mouseout', function () {
//					 g.selectAll("polygon")
//                        .transition(200)
//                        .style("fill-opacity", 0.1);
//                });
//		 });
		


        d.forEach(function (y, x) {
			holdOpacity= "0";
			highlight = "";
			if(series==0){
				holdOpacity="1";
				highlight = " highlight";
			}
			 g.selectAll(".nodes")
                .data(y).enter()
                .append("rect")
                .attr("class", "radar-chart-serie" + series+highlight)
                .attr('rx', 10)
				.attr("width", 50)
    			.attr("height", 20)
                .attr("alt", function (j) { return Math.max(j.value, 0) })
                .attr("x", function (j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                    return (cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total))) - 10;
                })
                .attr("y", function (j, i) {
                    return (cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))) - 10;
                })
                .attr("data-id", function (j) { return j.axis })
				.attr("stroke-width", 1)
				 .attr("stroke", cfg.color(series))
                .style("fill", "#071E41").style("opacity", holdOpacity);
			
            g.selectAll(".nodes")
                .data(y).enter()
                .append("svg:circle")
                .attr("class", "radar-chart-serie" + series+highlight)
                .attr('r', cfg.radius)
                .attr("alt", function (j) { return Math.max(j.value, 0) })
                .attr("cx", function (j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                    return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
                })
                .attr("cy", function (j, i) {
                    return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
                })
                .attr("data-id", function (j) { return j.axis })
                .style("fill", cfg.color(series)).style("opacity", holdOpacity);

			 g.selectAll(".nodes")
                .data(y).enter()
				.append("text")
				.attr("class", "radar-chart-serie" + series+highlight)
				.attr("width", 25)
			 	.attr('x', function (j, i) {
                    dataValues.push([
                        cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
                        cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
                    ]);
                    return (cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total))) + 10;
                })
                .attr('y', function (j, i) {
                    return (cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))) + 5;
                })
				.text(function (d) { return Format(d.value) })
			.style("fill", cfg.color(series)).style("opacity", holdOpacity);
			 	series++;
			});
//             .on('mouseover', function (d) {
//                 newX = parseFloat(d3.select(this).attr('cx')) - 10;
//                    newY = parseFloat(d3.select(this).attr('cy')) - 5;
//
//                    tooltip
//                        .attr('x', newX)
//                        .attr('y', newY)
//                        //.text(Format(d.value))//Shiafun
//                        .text(d.value)
//                        .transition(200)
//                        .style('opacity', 1);
//
//                    z = "polygon." + d3.select(this).attr("class");
//                    g.selectAll("polygon")
//                        .transition(200)
//                        .style("fill-opacity", 0.1);
//                    g.selectAll(z)
//                        .transition(200)
//                        .style("fill-opacity", .7);
//                })
//                .on('mouseout', function () {
//                    tooltip
//                        .transition(200)
//                        .style('opacity', 0);
//                    g.selectAll("polygon")
//                        .transition(200)
//                        .style("fill-opacity", cfg.opacityArea);
//                })
////                .append("svg:title")
////                .text(function (j) { return Math.max(j.value, 0) });
//
//       series++;
//    });
//    //Tooltip
//        tooltip = g.append('text')
//            .style('opacity', 0)
//            .style('font-family', 'sans-serif')
//            .style('font-size', '13px');
    }
};