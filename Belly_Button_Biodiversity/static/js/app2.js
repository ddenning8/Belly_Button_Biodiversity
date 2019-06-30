function buildMetadata(sample) {

  var metadataURL = `/metadata/${sample}`;
    d3.json(metadataURL).then(function(sample) {
      var sampleData = d3.select("#sample-metadata");
      sampleData.html("");

      Object.entries(sample).forEach(function([key,value]) {
        var row = sampleData.append("h6");
        row.text(`${key}:${value}`);
      });

    });
};

function buildCharts(sample) {
  //pie chart
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {
    console.log(data);

    var values = data.sample_values.slice(0,10);
    var labels = data.otu_ids.slice(0,10);
    var hovertext = data.otu_labels.slice(0,10);

    var pie_chart = [{
      values: values,
      labels:labels,
      hovertext: hovertext,
      type: "pie"
    }];

    Plotly.newPlot("pie", pie_chart);
  })
  
  //Bubble chart

  d3.json(url).then(function(data) {

      var xaxis = data.otu_ids;
      var yaxis = data.sample_values;
      var bubble_size = data.sample_values;
      var bubble_color = data.otu_ids;
      var text_values = data.otu_labels;

      var bubble = {
        x: xaxis,
        y: yaxis,
        text: text_values,
        mode: 'markers',
        marker: {
          color: bubble_color,
          size: bubble_size
        }
      };

      var data = [bubble];

      var layout = {
        title: "Belly Button Bacteria",
        xaxis: { title: "OTU ID" },
      };

      Plotly.newPlot("bubble", data, layout);
    
  });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
