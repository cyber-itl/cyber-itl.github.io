var Comparison = {

    LoadData: function (url, comparisonType, os) {               
     
        var comparisonDetailPath = `comparisonDetail.html?comparisonType=${comparisonType}&device=`;       

        $.getJSON(url, function (data) {

            var viewModel = ko.mapping.fromJS(data);
           
            viewModel.hideSecuritySandboxing = false;
            viewModel.hideSecurityOpenSource = false;
            viewModel.hasPartialCheck = false;
            viewModel.devices().forEach(function (ds) {
                if (comparisonType == "browser")                    
                    ds.navigationUrl = comparisonDetailPath + ds.nameKey() + "&operatingSystem=" + os;
                else
                    ds.navigationUrl = comparisonDetailPath + ds.nameKey();    
          
                let ratingClass = Math.round( ds.score() * 2);                          
                ds.safetyRatingClass = "score-" + ratingClass;
                ds.colorClass = CITLColors[comparisonType][ds.nameKey()].colorClass;
                ds.chartColor = CITLColors[comparisonType][ds.nameKey()].chartColor;
                ds.iconSVG = CITLColors[comparisonType][ds.nameKey()].icon;

                if(ds.securityAids.sandboxing() == null)
                    viewModel.hideSecuritySandboxing = true;
                if(ds.securityAids.openSource() == null)
                    viewModel.hideSecurityOpenSource = true;
                if(ds.securityAids.openSource() == "PARTIAL")
                    viewModel.hasPartialCheck = true;
            });

            if(!viewModel.hideSecurityOpenSource && viewModel.hasPartialCheck)
                viewModel.hasPartialCheck = true;

            viewModel.showOperatingSystem = ko.observable(comparisonType == "browser");
            viewModel.comparisonTypeOS = (comparisonType == "OS");
            viewModel.comparisonTypeBrowser = (comparisonType == "browser");
            viewModel.comparisonTypeSmartTv = (comparisonType == "smarttv");
            viewModel.comparisonTypeMSOffice = (comparisonType == "microsoftoffice");  
            
            viewModel.osMac = (os == "OSX");
            viewModel.osWindows = (os == "Windows");
            viewModel.osLinux = (os == "Linux");

            viewModel.hasSafeSEH = (os == "Windows" || comparisonType == "OS");
           
            ko.applyBindings(viewModel);

            var colors = [];
            var donutChartColors = [];
            viewModel.devices().forEach(function (ds) {
                colors.push(ds.chartColor);
                let donutChartColor = [];
                donutChartColor.push(ds.chartColor, '#A4ACB7', '#57667D', '#071E41' );
                donutChartColors.push(donutChartColor);
            });

            data.devices.forEach(function (ds) {
                if (comparisonType == "browser") {
                    ds.navigationUrl = comparisonDetailPath + ds.nameKey + "&operatingSystem=" + os;                 
                }
                else {
                    ds.navigationUrl = comparisonDetailPath + ds.nameKey;
                }
            })         
            
            DonutChart.draw(data.devices, donutChartColors);
                              
            var waffleChartSqurarValue = 50000;
            if( comparisonType == "browser") 
                waffleChartSqurarValue = 1000000;                
            else if( comparisonType == "OS" )
                waffleChartSqurarValue = 50000000;
            else if(comparisonType == "microsoftoffice")
                waffleChartSqurarValue = 5000000;
            else if(comparisonType == "smarttv")
                waffleChartSqurarValue = 5000000;
            WaffleChart.draw("#waffle", data.devices, colors, waffleChartSqurarValue); 
                    
            LollipopChart.draw("#libraries-chart", data.devices, colors);            
               
            //Check the OS again before we pass the data to barchart, in case this is not we assume.
            if(data.operatingSystem && os != data.operatingSystem)
                os = data.operatingSystem;   

            var browserWidth = $(window).width();

            if (browserWidth > 991) {
                BarChart.draw("#safety-features-chart", data.devices, colors, os, false); 
            }
            else {
                BarChart.draw("#safety-features-chart", data.devices, colors, os, true); 
            }
           
        });
    }
};