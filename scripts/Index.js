var Index = {

    LoadData: function () {
        var osDataUrl = "../json/CITL_Comparison_OS.json";
        var smartvDataUrl = "../json/CITL_Comparison_smarttv.json";
        var officeDataUrl = "../json/CITL_Comparison_microsoftoffice.json";
        var windowsBrowserDataUrl = "../json/CITL_Comparison_browser_Windows.json";
        var osxBrowserDataUrl = "../json/CITL_Comparison_browser_OSX.json";
        var linuxBrowserDataUrl = "../json/CITL_Comparison_browser_Linux.json";

        var viewModel = {
            osDevices: ko.observableArray(),
            smarttvDevices: ko.observableArray(),
            microsoftofficeDevices: ko.observableArray(),
            windowsBrowserDevices: ko.observableArray(),
            osxBrowserDevices: ko.observableArray(),
            linuxBrowserDevices: ko.observableArray()           
        };

        $.getJSON(osDataUrl, function (data) {         
            data.devices.forEach(function (ds, index) {              
                viewModel.osDevices.push({
                    name: ds.nameKey,
                    displayName: ds.displayName,
                    score: ds.score,
                    iconSVG: CITLColors.OS[ds.nameKey].icon,
                    safetyRatingClass: "score-" + Math.round(ds.score * 2) + (index == 0 ? " selected" : ""),
                    colorClass: CITLColors.OS[ds.nameKey].colorClass,
                    chartColor: CITLColors.OS[ds.nameKey].chartColor                                 
                });
            });          
        });

        $.getJSON(smartvDataUrl, function (data) {          
            data.devices.forEach(function (ds, index) {
                viewModel.smarttvDevices.push({
                    name: ds.name,
                    displayName: ds.displayName,
                    score: ds.score,
                    iconSVG: CITLColors.smarttv[ds.nameKey].icon,
                    safetyRatingClass: "score-" + Math.round(ds.score * 2) + (index == 0 ? " selected" : ""),
                    colorClass: CITLColors.smarttv[ds.nameKey].colorClass,
                    chartColor: CITLColors.smarttv[ds.nameKey].chartColor
                });
            });          
        });

        $.getJSON(officeDataUrl, function (data) {        
            data.devices.forEach(function (ds, index) {
                viewModel.microsoftofficeDevices.push({
                    name: ds.name,
                    displayName: ds.displayName,
                    score: ds.score,
                    iconSVG: CITLColors.microsoftoffice[ds.nameKey].icon,
                    safetyRatingClass: "score-" + Math.round(ds.score * 2) + (index == 0 ? " selected" : ""),
                    colorClass: CITLColors.microsoftoffice[ds.nameKey].colorClass,
                    chartColor: CITLColors.microsoftoffice[ds.nameKey].chartColor
                });
            });           

        });     
        
        $.getJSON(windowsBrowserDataUrl, function (data) {
            data.devices.forEach(function (ds, index) {
                viewModel.windowsBrowserDevices.push({
                    name: ds.nameKey,
                    displayName: ds.displayName,
                    score: ds.score,
                    iconSVG: CITLColors.browser[ds.nameKey].icon,
                    safetyRatingClass: "score-" + Math.round(ds.score * 2) + (index == 0 ? " selected" : ""),
                    colorClass: CITLColors.browser[ds.nameKey].colorClass,
                    chartColor: CITLColors.browser[ds.nameKey].chartColor                   
                });
            });
        });


        $.getJSON(osxBrowserDataUrl, function (data) {
            data.devices.forEach(function (ds, index) {
                viewModel.osxBrowserDevices.push({
                    name: ds.nameKey,
                    displayName: ds.displayName,
                    score: ds.score,
                    iconSVG: CITLColors.browser[ds.nameKey].icon,
                    safetyRatingClass: "score-" + Math.round(ds.score * 2) + (index == 0 ? " selected" : ""),
                    colorClass: CITLColors.browser[ds.nameKey].colorClass,
                    chartColor: CITLColors.browser[ds.nameKey].chartColor
                });
            });
        });

        $.getJSON(linuxBrowserDataUrl, function (data) {
            data.devices.forEach(function (ds, index) {
                viewModel.linuxBrowserDevices.push({
                    name: ds.nameKey,
                    displayName: ds.displayName,
                    score: ds.score,
                    iconSVG: CITLColors.browser[ds.nameKey].icon,
                    safetyRatingClass: "score-" + Math.round(ds.score * 2) + (index == 0 ? " selected" : ""),
                    colorClass: CITLColors.browser[ds.nameKey].colorClass,
                    chartColor: CITLColors.browser[ds.nameKey].chartColor
                });
            });
        });

        ko.applyBindings(viewModel);

    }
};

