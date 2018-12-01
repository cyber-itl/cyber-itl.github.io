var BarChart = {

    draw: function (charId, data, colors, osType, horizontal) { 
        
        DrawBarChart(mapToBar(data, osType, horizontal), charId, colors, horizontal);
    }
};

function mapToBar(masterData, osType, horizontal) {
    osType = osType.toUpperCase();
    if (osType.startsWith("WINDOWS"))
        return PopulateWindowData(masterData, horizontal);
    else if (osType.startsWith("MAC") || osType == "OSX")
        return PopulateOSXData(masterData, horizontal);
    else if (osType == "LINUX")
        return PopulateLinuxData(masterData, horizontal);
    else return PopulateAllData(masterData, horizontal);    
}

function DrawBarChart(d, chartId, colorPallet, horizontal) {
    if (horizontal) {
        var chart = c3.generate({
            size: {
                height: 500
            },
            padding: {
                bottom: 40,
                top: 10,
                right: 15
            },
            bindto: chartId,
            data: {
                json: d.data,
                type: 'bar'
            },
            legend: {
                position: 'inset'
            },
            bar: {
                width: {
                    ratio: 0.4 // this makes bar width 50% of length between ticks
                }
            },
            axis: {
                rotated: horizontal,
                x: {
                    type: 'category',
                    categories: d.x
                },
                y: {
                    label: {
                        text: 'Percentage of Binaries',
                        position: 'outer-center'
                    },
                    max: 100,
                    tick: {
                        count: 6
                    },
                    padding: {
                        top: 0,
                        bottom: 0
                    }
                }
            },
            color: {
                pattern: colorPallet
            }
        });

    }
    else {
    var chart = c3.generate({
        size: {
            height: 400
        },
        padding: {
            bottom: 60,
            top: 10,
            right: 100
        },
        bindto: chartId,
        data: {
            json: d.data,
            type: 'bar'
        },
        legend: {
            position: 'inset'
        },
        bar: {
            width: {
                ratio: 0.4 // this makes bar width 50% of length between ticks
            }
        },
        axis: {
            rotated: false,
            x: {
                type: 'category',
                categories: d.x
            },
            y: {
                label: {
                    text: 'Percentage of Binaries',
                    position: 'outer-middle'
                },
                max: 100,
                tick: {
                    count: 6
                },
                padding: {
                    top: 0,
                    bottom: 0
                }
            }
        },
        color: {
            pattern: colorPallet
        }
        });
    }
}

function PopulateWindowData(masterData, horizontal) {
    var bar = {
        x: [],
        data: {}
    };
    if (horizontal) {
        bar.x.push("64 bit");
        bar.x.push("DEP");
        bar.x.push("ASLR");
        bar.x.push("CFI");
        bar.x.push("*Safe SEH");
        bar.x.push("Stack Guards");
    }
    else {
    bar.x.push("64 bit");
    bar.x.push("Data Execution Prevention (DEP)");
    bar.x.push("Address Space Layout Randomization (ASLR)");
    bar.x.push("Control Flow Integrity (CFI)");
    bar.x.push("*Safe SEH");
        bar.x.push("Stack Guards");
    }

    masterData.forEach(function (ds) {
        bar.data[ds.displayName] = [];
        bar.data[ds.displayName].push(ds.safetyFeatures._64bit);
        bar.data[ds.displayName].push(ds.safetyFeatures.DEP);
        bar.data[ds.displayName].push(ds.safetyFeatures.ASLR);
        bar.data[ds.displayName].push(ds.safetyFeatures.CFI);
        if (ds.safetyFeatures.safeSEH) {
            bar.data[ds.displayName].push(ds.safetyFeatures.safeSEH);
        }
        else {
            bar.data[ds.displayName].push(NaN); 
        }
        bar.data[ds.displayName].push(ds.safetyFeatures.stackGuards);
    });

    return bar;
}

function PopulateOSXData(masterData, horizontal) {
    var bar = {
        x: [],
        data: {}
    };
    if (horizontal) {
        bar.x.push("64 bit");
        bar.x.push("DEP");
        bar.x.push("ASLR");
        bar.x.push("Fortification");
        bar.x.push("Stack Guards");
        bar.x.push("Heap Protection");
    }
    else {

        bar.x.push("64 bit");
        bar.x.push("Data Execution Prevention (DEP)");
        bar.x.push("Address Space Layout Randomization (ASLR)");
        bar.x.push("Fortification");
        bar.x.push("Stack Guards");
        bar.x.push("Heap Protection");
    }

    masterData.forEach(function (ds) {
        bar.data[ds.displayName] = [];
        bar.data[ds.displayName].push(ds.safetyFeatures._64bit);
        bar.data[ds.displayName].push(ds.safetyFeatures.DEP);
        bar.data[ds.displayName].push(ds.safetyFeatures.ASLR);
        bar.data[ds.displayName].push(ds.safetyFeatures.fortification);       
        bar.data[ds.displayName].push(ds.safetyFeatures.stackGuards);
        bar.data[ds.displayName].push(ds.safetyFeatures.HEAP_PROT);
    });

    return bar;
}

function PopulateLinuxData(masterData, horizontal) {
    var bar = {
        x: [],
        data: {}
    };

    if (horizontal) {
        bar.x.push("64 bit");
        bar.x.push("DEP");
        bar.x.push("ASLR");
        bar.x.push("Fortification");
        bar.x.push("RELRO");
        bar.x.push("Stack Guards");
    }
    else {
        bar.x.push("64 bit");
        bar.x.push("Data Execution Prevention (DEP)");
        bar.x.push("Address Space Layout Randomization (ASLR)");
        bar.x.push("Fortification");
        bar.x.push("RELRO");
        bar.x.push("Stack Guards");
    }

    masterData.forEach(function (ds) {
        bar.data[ds.displayName] = [];
        bar.data[ds.displayName].push(ds.safetyFeatures._64bit);
        bar.data[ds.displayName].push(ds.safetyFeatures.DEP);
        bar.data[ds.displayName].push(ds.safetyFeatures.ASLR);
        bar.data[ds.displayName].push(ds.safetyFeatures.fortification);
        bar.data[ds.displayName].push(ds.safetyFeatures.RELRO);
        bar.data[ds.displayName].push(ds.safetyFeatures.stackGuards);
    });

    return bar;
}

function PopulateAllData(masterData, horizontal) {
    var bar = {
        x: [],
        data: {}
    };

    if (horizontal) {
        bar.x.push("64 bit");
        bar.x.push("DEP");
        bar.x.push("ASLR");
        bar.x.push("DFI");
        bar.x.push("*Safe SEH");
        bar.x.push("Fortification");
        bar.x.push("RELRO");
        bar.x.push("Stack Guards");
        bar.x.push("Heap Protection");
    }
    else {
        bar.x.push("64 bit");
        bar.x.push("Data Execution Prevention (DEP)");
        bar.x.push("Address Space Layout Randomization (ASLR)");
        bar.x.push("Control Flow Integrity (CFI)");
        bar.x.push("*Safe SEH");
        bar.x.push("Fortification");
        bar.x.push("RELRO");
        bar.x.push("Stack Guards");
        bar.x.push("Heap Protection");
    }

    masterData.forEach(function (ds) {
        bar.data[ds.displayName] = [];
        bar.data[ds.displayName].push(ds.safetyFeatures._64bit);
        bar.data[ds.displayName].push(ds.safetyFeatures.DEP);
        bar.data[ds.displayName].push(ds.safetyFeatures.ASLR);

        if (ds.safetyFeatures.CFI)
            bar.data[ds.displayName].push(ds.safetyFeatures.CFI);
        else
            bar.data[ds.displayName].push(NaN);

        if (ds.safetyFeatures.safeSEH)
            bar.data[ds.displayName].push(ds.safetyFeatures.safeSEH);            
        else
            bar.data[ds.displayName].push(NaN);            

        if (ds.safetyFeatures.fortification)
            bar.data[ds.displayName].push(ds.safetyFeatures.fortification);
        else
            bar.data[ds.displayName].push(NaN);

        if (ds.safetyFeatures.RELRO)
            bar.data[ds.displayName].push(ds.safetyFeatures.RELRO);        
        else
            bar.data[ds.displayName].push(NaN); 

        bar.data[ds.displayName].push(ds.safetyFeatures.stackGuards);        
    
        
        if(ds.safetyFeatures.HEAP_PROT)    
            bar.data[ds.displayName].push(ds.safetyFeatures.HEAP_PROT);        
        else
            bar.data[ds.displayName].push(NaN);    
        
    });

    return bar;
}


