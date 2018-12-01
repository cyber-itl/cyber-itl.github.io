// JavaScript source code
var ComparisonDetail = {

    LoadData: function (comparisonType, device, os) {

        var jsonUrl = `../json/CITL_ComparisonDetail_${comparisonType}_${device}.json`;

        if (comparisonType == "browser") {
            jsonUrl = `../json/CITL_ComparisonDetail_${comparisonType}_${device}_${os}.json`;
        }

        $.getJSON(jsonUrl, function (data) {
            var viewModel = new ViewModel().deviceName(data.deviceName)
                .displayName(data.displayName ? data.displayName : data.deviceName)
                .RatingScore(data.scoreTotal)
                .comparisonType(data.comparisonType)
                .testDate(data.testDate)
                .operatingSystem(data.operatingSystem)
                .deviceVersion(data.deviceVersion)
                .operatingSystem(data.operatingSystem)
                .operatingSystemVersion(data.operatingSystemVersion);


            let ratingClass = Math.round(viewModel.RatingScore() * 2);
            viewModel.RatingScoreClass = "score-" + ratingClass;
            viewModel.colorClass = CITLColors[comparisonType][device].colorClass;
            viewModel.iconSVG = CITLColors[comparisonType][device].icon;

            //Auxiliary to facilitate UI display
            viewModel.showOperatingSystem = ko.observable(comparisonType == "browser");
            viewModel.osMode = ko.observable(GetOSMode(data.operatingSystem));
            viewModel.ShowWindowsSafetyFeature = ko.observable(viewModel.osMode() == "Windows");
            viewModel.ShowOSXSafetyFeature = ko.observable(viewModel.osMode() == "OSX");
            viewModel.ShowLinuxSafetyFeature = ko.observable(viewModel.osMode() == "Linux");

            var scoresKey0 = [], //81-100
                scoresKey1 = [], //61-80
                scoresKey2 = [], //41-60
                scoresKey3 = [], //21-40
                scoresKey4 = []; //0-20

            var scorekey0Percentage,
                scorekey1Percentage,
                scorekey2Percentage,
                scorekey3Percentage,
                scorekey4Percentage;

            data.totalScoreRanges.forEach(function (range) {
                if (range.range == "0-20") {
                    scorekey4Percentage = range.percentage;
                    range.binaries.forEach(function (ds) {
                        scoresKey4.push({
                            binary: ds.binary,
                            filePath: ds.filePath,
                            type: ds.type,
                            codeSize: ds.codeSize.toLocaleString(),
                            totalScore: ds.totalScore
                        });
                    });
                }
                else if (range.range == "21-40") {
                    scorekey3Percentage = range.percentage;
                    range.binaries.forEach(function (ds) {
                        scoresKey3.push({
                            binary: ds.binary,
                            filePath: ds.filePath,
                            type: ds.type,
                            codeSize: ds.codeSize.toLocaleString(),
                            totalScore: ds.totalScore
                        });
                    });
                }
                else if (range.range == "41-60") {
                    scorekey2Percentage = range.percentage;
                    range.binaries.forEach(function (ds) {
                        scoresKey2.push({
                            binary: ds.binary,
                            filePath: ds.filePath,
                            type: ds.type,
                            codeSize: ds.codeSize.toLocaleString(),
                            totalScore: ds.totalScore
                        });
                    });
                }
                else if (range.range == "61-80") {
                    scorekey1Percentage = range.percentage;
                    range.binaries.forEach(function (ds) {
                        scoresKey1.push({
                            binary: ds.binary,
                            filePath: ds.filePath,
                            type: ds.type,
                            codeSize: ds.codeSize.toLocaleString(),
                            totalScore: ds.totalScore
                        });
                    });
                }
                else if (range.range == "81-100") {
                    scorekey0Percentage = range.percentage;
                    range.binaries.forEach(function (ds) {
                        scoresKey0.push({
                            binary: ds.binary,
                            filePath: ds.filePath,
                            type: ds.type,
                            codeSize: ds.codeSize.toLocaleString(),
                            totalScore: ds.totalScore
                        });
                    });
                }
            });

            scoresKey0.sort(function (a, b) { return b.totalScore - a.totalScore });
            scoresKey1.sort(function (a, b) { return a.totalScore - b.totalScore });
            scoresKey2.sort(function (a, b) { return a.totalScore - b.totalScore });
            scoresKey3.sort(function (a, b) { return a.totalScore - b.totalScore });
            scoresKey4.sort(function (a, b) { return a.totalScore - b.totalScore });

            viewModel.totalScoreRanges.push(new RangeModel()
                .key(0)
                .range("81-100")
                .rating(5)
                .ratingClass("score-10")
                .percentage(scorekey0Percentage)
                .isSelected(true)
                .binaries(scoresKey0)
            );
            viewModel.totalScoreRanges.push(new RangeModel()
                .key(1)
                .range("61-80")
                .rating(4)
                .ratingClass("score-8")
                .percentage(scorekey1Percentage)
                .isSelected(false)
                .binaries(scoresKey1)
            );
            viewModel.totalScoreRanges.push(new RangeModel()
                .key(2)
                .range("41-60")
                .rating(3)
                .ratingClass("score-6")
                .percentage(scorekey2Percentage)
                .isSelected(false)
                .binaries(scoresKey2)
            );
            viewModel.totalScoreRanges.push(new RangeModel()
                .key(3)
                .range("21-40")
                .rating(2)
                .ratingClass("score-4")
                .percentage(scorekey3Percentage)
                .isSelected(false)
                .binaries(scoresKey3)
            );
            viewModel.totalScoreRanges.push(new RangeModel()
                .key(4)
                .range("0-20")
                .rating(1)
                .ratingClass("score-2")
                .percentage(scorekey4Percentage)
                .isSelected(false)
                .binaries(scoresKey4)
            );

            viewModel.CurrentSelectedScoreRange = ko.observable(viewModel.totalScoreRanges()[0]);

            viewModel.selectScoreRange = function (rangeCategory) {
                viewModel.reSetSelectedScoreRangeClass();
                rangeCategory.isSelected(true);
                viewModel.CurrentSelectedScoreRange(rangeCategory);

                //Reset the table header sorting direction                
                viewModel.totalScoreRangeTableHeaders.ascBinary(false);
                viewModel.totalScoreRangeTableHeaders.ascFilePath(false);
                viewModel.totalScoreRangeTableHeaders.ascType(false);
                viewModel.totalScoreRangeTableHeaders.ascCodeSize(false);

                $("#scores thead tr th").removeClass("headerSortDown").removeClass("headerSortUp");
                if (rangeCategory.key() == 0) {
                    $("#scores thead tr th:last").addClass("headerSortDown");
                    viewModel.totalScoreRangeTableHeaders.ascScore(true);
                }
                else {
                    $("#scores thead tr th:last").addClass("headerSortUp");
                    viewModel.totalScoreRangeTableHeaders.ascScore(false);
                }
            };

            viewModel.reSetSelectedScoreRangeClass = function () {
                viewModel.totalScoreRanges().forEach(function (ds) {
                    ds.isSelected(false);
                });
            };

            if (viewModel.osMode() == "Windows") {
                data.totalScoreRanges.forEach(function (range) {
                    range.binaries.forEach(function (ds) {
                        viewModel.binariesSafetyFeature.push(
                            {
                                binary: ds.binary,
                                filePath: ds.filePath,
                                _64bit: ds._64bit,
                                DEP: ds.DEP,
                                ASLR: ds.ASLR,
                                CFI: ds.CFI,
                                SafeSEH: ds.SafeSEH,
                                stackGuards: ds.stackGuards
                            });
                    });
                });
            }
            else if (viewModel.osMode() == "OSX") {
                data.totalScoreRanges.forEach(function (range) {
                    range.binaries.forEach(function (ds) {
                        viewModel.binariesSafetyFeature.push(
                            {
                                binary: ds.binary,
                                filePath: ds.filePath,
                                _64bit: ds._64bit,
                                DEP: ds.DEP,
                                ASLR: ds.ASLR,
                                fortification: ds.fortification,
                                stackGuards: ds.stackGuards
                            });
                    });
                });
            }
            else if (viewModel.osMode() == "Linux") {
                data.totalScoreRanges.forEach(function (range) {
                    range.binaries.forEach(function (ds) {
                        viewModel.binariesSafetyFeature.push(
                            {
                                binary: ds.binary,
                                filePath: ds.filePath,
                                _64bit: ds._64bit,
                                DEP: ds.DEP,
                                ASLR: ds.ASLR,
                                fortification: ds.fortification,
                                RELRO: ds.RELRO,
                                stackGuards: ds.stackGuards
                            });
                    });
                });
            }

            data.totalScoreRanges.forEach(function (range) {
                range.binaries.forEach(function (ds) {
                    viewModel.binariesCodeHygiene.push({
                        binary: ds.binary,
                        filePath: ds.filePath,
                        good: ds.good,
                        risky: ds.risky,
                        veryRisky: ds.veryRisky,
                        extremelyRisky: ds.extremelyRisky
                    });
                });
            });

            //Add OS options for browser to facilitate navigation               
            if (comparisonType == "browser") {
                viewModel.OSOptions = ko.observableArray();

                if (viewModel.displayName() == "Edge") {
                    viewModel.OSOptions.push(new OSOptionModel("Windows", "Windows 10", viewModel.displayName()).isSelected(true));
                }
                else if (viewModel.displayName() == "Chrome" || viewModel.displayName() == "Opera" || viewModel.displayName() == "Firefox") {
                    viewModel.OSOptions.push(new OSOptionModel("Windows", "Windows 10", viewModel.displayName())
                        .isSelected(os == "Windows"));
                    viewModel.OSOptions.push(new OSOptionModel("OSX", "Mac OS", viewModel.displayName())
                        .isSelected(os == "OSX"));
                    viewModel.OSOptions.push(new OSOptionModel("Linux", "Linux Ubuntu", viewModel.displayName())
                        .isSelected(os == "Linux"));
                }
                else if (viewModel.displayName() == "Safari") {
                    viewModel.OSOptions.push(new OSOptionModel("OSX", "Mac OS", viewModel.displayName()).isSelected(true));
                }

                viewModel.selectOS = function (os) {
                    window.location.href = os.navigationUrl();
                };
            }

            viewModel.GotoParentComparison = function () {

                if (comparisonType == "browser") {
                    return `../comparisons/comparison.html?comparisonType=browser&operatingSystem=${os}`;
                }
                else {
                    return `../comparisons/comparison.html?comparisonType=${comparisonType}`;
                }
            };

            viewModel.GotoOtherComparison = function () {

                if (comparisonType == "OS") {
                    return `../comparisons/comparison.html?comparisonType=browser&operatingSystem=${device}`;
                }
                else {
                    return `../comparisons/comparison.html?comparisonType=OS`;
                }
            };

            viewModel.rawDownload = function () {


                if (comparisonType == "browser") { 
                    return `../json/CITL_Comparison_browser_${os}_raw.json`;
                }
                else {
    return `../json/CITL_Comparison_${comparisonType}_raw.json`;
}
            };

            ko.applyBindings(viewModel);

            $("#safety").tablesorter();
            $("#hygiene").tablesorter(
                {
                    headers: {
                        0: {
                            sorter: false
                        },
                        1: {
                            sorter: false
                        }
                    }
                }
            );
        });
    }
};


function OSOptionModel(osKey, osDispalyName, browser) {
    this.name = ko.observable(osDispalyName);
    this.isSelected = ko.observable(true);
    this.navigationUrl = ko.computed(function () {
        return `ComparisonDetail.html?comparisonType=browser&device=${browser}&operatingSystem=${osKey}`;
    });
}

function GetOSMode(str) {
    if (str.startsWith("Windows"))
        return "Windows";
    else if (str.startsWith("OS") || str.startsWith("Mac"))
        return "OSX";
    else if (str.startsWith("Linux"))
        return "Linux";
}

function RangeModel() {
    this.key = ko.observable();
    this.range = ko.observable();
    this.rating = ko.observable();
    this.ratingClass = ko.observable();
    this.percentage = ko.observable();
    this.isSelected = ko.observable();
    this.binaries = ko.observableArray();
}

function ViewModel() {
    this.deviceName = ko.observable();
    this.displayName = ko.observable();
    this.RatingScore = ko.observable();
    this.comparisonType = ko.observable();
    this.testDate = ko.observable();
    this.operatingSystem = ko.observable();
    this.deviceVersion = ko.observable();
    this.operatingSystemVersion = ko.observable();
    this.isSortedBy = ko.observable(false);
    this.sortDirection = ko.observable(false);
    this.sortClass = ko.computed(function () {
        if (this.isSortedBy) {
            if (this.sortDirection) {
                return "sort asc";
            }
            else {
                return "sort desc";
            }
        }
        else {
            return "nothing";
        }
    }, this);

    this.totalScoreRanges = ko.observableArray();
    this.binariesSafetyFeature = ko.observableArray();
    this.binariesCodeHygiene = ko.observableArray();


    this.totalScoreRangeTableHeaders = {
        "ascBinary": ko.observable(false),
        "ascFilePath": ko.observable(false),
        "ascType": ko.observable(false),
        "ascCodeSize": ko.observable(false),
        "ascScore": ko.observable(true)
    }
}

ko.bindingHandlers.sort = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        element.style.cursor = 'pointer';
    },

    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var value = valueAccessor();
        var prop = value.prop;
        var data = value.arr;
        var asc = value.asc;

        element.onclick = function () {
            asc = !asc;
            $("#scores thead tr th").removeClass("headerSortUp").removeClass('headerSortDown');

            if (asc) {
                $(element).addClass('headerSortDown');
            }
            else {
                $(element).addClass('headerSortUp');
            }

            data.sort(function (left, right) {
                var rec1 = left;
                var rec2 = right;

                if (!asc) {
                    rec1 = right;
                    rec2 = left;
                }

                var props = prop.split('.');
                for (var i in props) {
                    var propName = props[i];
                    var parenIndex = propName.indexOf('()');
                    if (parenIndex > 0) {
                        propName = propName.substring(0, parenIndex);
                        rec1 = rec1[propName]();
                        rec2 = rec2[propName]();
                    } else {
                        rec1 = rec1[propName];
                        rec2 = rec2[propName];
                    }
                }

                //We could have more generic function to determine if this is number string with comma.
                //For now, this will be sufficent.                
                if (propName == "codeSize") {
                    rec1 = parseFloat(rec1.replace(/,/g, ''));
                    rec2 = parseFloat(rec2.replace(/,/g, ''));
                }

                if (propName == "binary") {
                    rec1 = rec1.toLowerCase();
                    rec2 = rec2.toLowerCase();
                }

                return rec1 == rec2 ? 0 : rec1 < rec2 ? -1 : 1;
            });
        };
    }
};