// Use D3 to read the JSON file
d3.json("data/samples.json").then((data) => {
    window.data = data;
    console.log(data);

    // Add ID#s to dropdown menu
    var idList = data.names;
    for (var i = 0; i < idList.length; i++) {
        selectBox = d3.select("#selDataset");
        selectBox.append("option").text(idList[i]);
    }

    // Set up default plot
    defaultPlot(0)

    // Function for updating plots   
    function defaultPlot(index) {


        // Set up arrays for horizontal bar chart & gauge chart
        var sampleOTUs = data.samples[index].otu_ids;
        console.log(sampleOTUs);
        var sampleFreq = data.samples[index].sample_values;
        var otuLabels = data.samples[index].otu_labels;

        var washFreq = data.metadata[+index].wfreq;
        console.log(washFreq);


        // Populate Demographic Data card
        var demKeys = Object.keys(data.metadata[index]);
        var demValues = Object.values(data.metadata[index])
        var demData = d3.select('#sample-metadata');

        // clear demographic data
        demData.html("");

        for (var i = 0; i < demKeys.length; i++) {

            demData.append("p").text(`${demKeys[i]}: ${demValues[i]}`);
        };


        // Slice and reverse data for horizontal bar chart
        var topOTUS = sampleOTUs.slice(0, 10).reverse();
        var topFreq = sampleFreq.slice(0, 10).reverse();
        var topToolTips = data.samples[0].otu_labels.slice(0, 10).reverse();
        var topLabels = topOTUS.map((otu => "OTU " + otu));
        var reversedLabels = topLabels.reverse();

        // Set up trace
        var trace1 = {
            x: topFreq,
            y: reversedLabels,
            text: topToolTips,
            name: "",
            type: "bar",
            orientation: "h"
        };

        // data
        var barData = [trace1];

        // Apply  layout
        var layout = {
            title: "Top 10 OTUs",
            margin: {
                l: 75,
                r: 75,
                t: 75,
                b: 50
            }
        };

        // Render the plot to the div tag with id "plot"
        Plotly.newPlot("bar", barData, layout);

        // Set up trace
        trace2 = {
            x: sampleOTUs,
            y: sampleFreq,
            text: otuLabels,
            mode: 'markers',
            marker: {
                color: sampleOTUs,
                opacity: [1, 0.8, 0.6, 0.4],
                size: sampleFreq
            }
        }

        //data
        var bubbleData = [trace2];

        // Apply layout
        var layout = {
            title: 'OTU Frequency',
            showlegend: false,
            height: 600,
            width: 930
        }

        // Render the plot to the div tag with id "bubble-plot"
        Plotly.newPlot("bubble", bubbleData, layout)

        // Gauge chart

        var trace3 = [{
            domain: { x: [0, 1], y: [0, 1] },
            type: "indicator",
            mode: "gauge+number",
            value: washFreq,
            title: { text: "Belly Button Washes Per Week" },
            gauge: {
                axis: { range: [0, 9], tickwidth: 0.5, tickcolor: "black" },
                bar: { color: "b" },
                bgcolor: "white",
                borderwidth: 2,
                bordercolor: "transparent",
                steps: [
                    { range: [0, 1], color: "#fff" },
                    { range: [1, 2], color: "#e6fff5" },
                    { range: [2, 3], color: "ccffeb" },
                    { range: [3, 4], color: "b3ffe0" },
                    { range: [4, 5], color: "#99ffd6" },
                    { range: [5, 6], color: "#80ffcc" },
                    { range: [6, 7], color: "#66ffc2" },
                    { range: [7, 8], color: "#4dffb8" },
                    { range: [8, 9], color: "#33ffad" }

                ],
            }
        }];

        gaugeData = trace3;

        var layout = {
            width: 600,
            height: 500,
            margin: { t: 0, b: 0 }
        };

        Plotly.newPlot("gauge", gaugeData, layout);

    }

    // On button click, call refreshData()
    d3.selectAll("#selDataset").on("change", dropdownData);



    function refreshData() {
        var dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        var personsID = dropdownMenu.property("value");
        console.log(personsID);
        // Initialize an empty array for the person's data
        console.log(data)

        for (var i = 0; i < data.names.length; i++) {
            if (personsID === data.names[i]) {
                defaultPlot(i);
                return
            }
        }
    }

});