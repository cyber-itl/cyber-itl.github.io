const ComparisonTypes = {
    OS: 1,
    browserWindow: 2,
    browserOSX: 3,
    browserLinux: 4,
    smarttv: 5,
    microsoftoffice: 6,
    propertyies: {
        1: { name: "OS", dataUrl: "json/CITL_Comparison_OS.json"},
        2: { name: "browserWindow", dataUrl: "json/CITL_Comparison_browser_Windows.json" },
        3: { name: "browserOSX", dataUrl: "json/CITL_Comparison_browser_OSX.json" },
        4: { name: "browserLinux", dataUrl: "json/CITL_Comparison_browser_Linux.json" },
        5: { name: "smarttv", dataUrl: "json/CITL_Comparison_smarttv.json" },
        6: { name: "microsoftoffice", dataUrl: "json/CITL_Comparison_microsoftoffice.json" },
    }
};

var CITL_RadarChart = { 
    draw: function (comparisonType, chartId, currentChartId, subTabId) {
     
        let url = ComparisonTypes.propertyies[comparisonType].dataUrl;
       
        d3.json(url, function (error, rawdata) {
            if (!!error) {
                console.log(error);
                return;
            }

            let data = [];
            let chartColors = [];
            rawdata.devices.forEach(function (ds) {
                let deviceData = [];
                deviceData.push({
                    axis: "Safety Features",
                    value: ds.safetyFeatures.scoreTotal
                });
                deviceData.push({
                    axis: "Code Complexity",
                    value: ds.codeComplexity.scoreTotal
                });
                deviceData.push({
                    axis: "Code Hygiene",
                    value: ds.codeHygiene.scoreTotal
                });
                data.push(deviceData);
                if (comparisonType == ComparisonTypes.browserWindow ||
                    comparisonType == ComparisonTypes.browserOSX ||
                    comparisonType == ComparisonTypes.browserLinux) {
                    chartColors.push(CITLColors.browser[ds.nameKey].chartColor);
                }
                else {
                    chartColors.push(CITLColors[ComparisonTypes.propertyies[comparisonType].name][ds.nameKey].chartColor);
                }
            });

            let radarChartConfig = {
                w: 500,
                h: 500,
                maxValue: 5,
                levels: 5,
                ExtraWidthX: 80,
                color: d3.scale.ordinal().range(chartColors)
            }         

            RadarChart.draw(chartId, data, radarChartConfig);            
        
            if (comparisonType == ComparisonTypes.browserWindow ||
                comparisonType == ComparisonTypes.browserOSX ||
                comparisonType == ComparisonTypes.browserLinux) {
                HighLightCurrentGraphArea(chartId, currentChartId, subTabId);
            }
            else {
                HighLightCurrentGraphArea(chartId, currentChartId);
            }
           
        });
    }
};

function HighLightCurrentGraphArea(chartId, currentChartId, subTabId) {
    let buttonlist = `${currentChartId} .score-list button`;   
    var chartSelector = chartId;

    if (subTabId){
        buttonlist = `${currentChartId} ${subTabId} .score-list button`;   
    }
    
    d3.selectAll(buttonlist).each(function (d, i) {       
        d3.select(this).on("click", function () {  
            $(buttonlist).removeClass("selected");                 
            d3.select(this).classed("selected", true);
            d3.select(chartSelector + " polygon.highlight")
                .classed("highlight", false)
                .transition(200)
                .style("fill-opacity", .1);
            d3.select(chartSelector + " polygon.radar-chart-serie" + i)
                .bringElementAsTopLayer(chartSelector)
                .classed("highlight", true)
                .transition(200)
                .style("fill-opacity", .66);
            d3.selectAll(chartSelector + " rect.highlight")
                .classed("highlight", false)
                .transition(200)
                .style("opacity", 0);
            d3.selectAll(chartSelector + " text.highlight")
                .classed("highlight", false)
                .transition(200)
                .style("opacity", 0);
            d3.selectAll(chartSelector + " circle.highlight")
                .classed("highlight", false)
                .transition(200)
                .style("opacity", 0);
            d3.selectAll(chartSelector + " rect.radar-chart-serie" + i)
                .classed("highlight", true)
                .transition(200)
                .style("opacity", 1);
            d3.selectAll(chartSelector + " text.radar-chart-serie" + i)
                .classed("highlight", true)
                .transition(200)
                .style("opacity", 1);
            d3.selectAll(chartSelector + " circle.radar-chart-serie" + i)
                .classed("highlight", true)
                .transition(200)
                .style("opacity", 1);
        })
    });

    d3.selection.prototype.bringElementAsTopLayer = function (chartSelector) {
        return this.each(function () {
            var nextSibling = d3.select(chartSelector + " rect.radar-chart-serie0").node();
            this.parentNode.insertBefore(this, nextSibling);
        });
    };
}

