function buildMetadata(sample) {
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample){

    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");
  
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function ([key, value]) {
      var row = sample_metadata.append("panel-body");
      row.text(`${key}: ${value} \n`);
    });
  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    //lol how about no?
}

function buildCharts(sample) {
// @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {
// @TODO: Build a Bubble Chart using the sample data
    var x_values = data.otu_ids;
    var y_values = data.sample_values;
    var m_size = data.sample_values;
    var m_colors = data.otu_ids; 
    var t_values = data.otu_labels;

    var trace1 = {
      x: x_values,
      y: y_values,
      text: t_values,
      mode: 'markers',
      marker: {
        color: m_colors,
        size: m_size
      } 
    };

var data = [trace1];
console.log("glubglub")
var layout = {
  xaxis: { title: "OTU ID"},
};
Plotly.newPlot('bubble', data, layout);
    // @TODO: Build a Pie Chart
    d3.json(url).then(function(data) {  
      var pie_values = data.sample_values.slice(0,10);
        var pie_labels = data.otu_ids.slice(0,10);
        var pie_hover = data.otu_labels.slice(0,10);
        var data = [{
          values: pie_values,
          labels: pie_labels,
          hovertext: pie_hover,
          type: 'pie'
        }];
  
        Plotly.newPlot('pie', data);
  
      });
    });
}
//I can't figure out what I did, but somehow now for certain subjects, there are no labels.
//Just the number. It's not across the board (482 is just Bacteria, but 839 has a bacteria name and type. I don't know what I did or why it's
// like this, but I think it must be something with the data, not the app, so I will continue. )
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
    console.log("HOW CAN YOU HAVE ANY PUDDING IF YOU DON'T EAT YER BEANS???")
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
