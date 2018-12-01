var DonutChart = {
    draw: function (data, colors) {             

        data.forEach(function (ds, index) {
            var dt = mapToDonut(ds);
            DrawDonut(dt, colors[index]);
        });

        function mapToDonut(masterData) {
            var donut = {
                title: "",
                displayName: "",
                totalFunctions: 0,
                totalExternalCalls: 0,
                navigationUrl: "",
                data: {
                    Good: [],
                    Risky: [],
                    VeryRisky: [],
                    ExtremelyRisky: []
                }
            };

            donut.title = masterData.nameKey;
            donut.displayName = masterData.displayName;
            donut.navigationUrl = masterData.navigationUrl;
            donut.totalExternalCalls = Math.floor(masterData.codeHygiene.totalExternalCalls / 1000).toLocaleString() + " k";
            donut.data.Good.push(masterData.codeHygiene.good);
            donut.data.Risky.push(masterData.codeHygiene.risky);
            donut.data.VeryRisky.push(masterData.codeHygiene.veryRisky);
            donut.data.ExtremelyRisky.push(masterData.codeHygiene.extremelyRisky);
            return donut;
        }

        function DrawDonut(d, coloroptions) {
            var chartId = '#chart' + d.title;
            var chartChrome = c3.generate({
                data: {
                    json: d.data,
                    type: 'donut',
                    order: 'null'
                },
                bindto: chartId,
                donut: {
                    width: 30,
                    title: d.title.toUpperCase(),
                    label: { show: false }
                },
                color: {
                    pattern: coloroptions
                },
                legend: {
                    show: false
                },
                oninit: function () {
                    $(chartId).prepend("<div class='chart-title'><h4>" + "<a href='" + d.navigationUrl + "'>" + d.displayName + "</a>" + "</h4><span class='total-functions' style='color:" + coloroptions[0] + "'>" + d.totalExternalCalls + "</span>External Calls</div>");
                }
            });

        }      
    }
};



