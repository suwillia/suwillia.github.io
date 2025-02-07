let url="https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// function to get metadata and populate the demographics

function demographic(sample) {
    d3.json(url).then(data => {
        let metadata = data.metadata;

        //filer to the value that was selected
        let result = metadata.filter(sampleresult => sampleresult.id == sample)[0];

        let panel = d3.select("#sample-metadata");
        panel.html("");
        Object.entries(result).forEach(([key, value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
       
        });
    });
}
// Function to build the graphs
//build bar charts
function barChart(sample)
{
    d3.json(url).then(data => {
        let sampleData = data.samples;
        //filer to the value that was selected
        let result = sampleData.filter(sampleresult => sampleresult.id == sample)[0];
        //console.log(result);

        //get the values
        let otu_ids = result.otu_ids;
        let otu_labels= result.otu_labels;
        let sample_values = result.sample_values;
        //console.log(otu_ids);
        //console.log(otu_labels);
        //console.log(sample_values);
        // building barcharts data
        let yticks = otu_ids.slice(0,10).map(id =>`OTU ${id}`);
        let xValues = sample_values.slice(0,10);
        let textLabels = otu_labels.slice(0, 10);

        //draw the barchart
        let barchart = {
            y: yticks.reverse(),
            x: xValues.reverse(),
            text: textLabels.reverse(),
            type: "bar",
            orientation: "h"
        };
        let layout ={
            title: "Top 10 Bacteria Cultures Found",
            width: 800, 
            height: 600,
            xaxis:{title:"Number of Bacteria"}
        };
        Plotly.newPlot("bar",[barchart], layout);

});
}
//bubble chart function
function bubblechart(sample)
{
    d3.json(url).then(data => {
        let sampleData = data.samples;
        //filer to the value that was selected
        let result = sampleData.filter(sampleresult => sampleresult.id == sample)[0];
        //console.log(result);

        //get the values
        let otu_ids = result.otu_ids;
        let otu_labels= result.otu_labels;
        let sample_values = result.sample_values;
        //console.log(otu_ids);
        //console.log(otu_labels);
        //console.log(sample_values);
       
        //draw the bubblechart
        let desired_maximum_marker_size = 60;
        let bubblechart = {
            y: sample_values,
            x: otu_ids,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale:"Earth",
                sizeref: 1.0 * Math.max(...sample_values) / (desired_maximum_marker_size**2),
                sizemode:'area'
            }
        }
        let layout ={
            title: "Bacteria cultures per Sample",
            hovermode:"closest",
            xaxis:{title:"OTU ID"},
            //width: 1200, 
            //height: 800
        };
        Plotly.newPlot("bubble",[bubblechart], layout);

});
}

function init(){

    d3.json(url).then(data=>
        
    {              
        console.log(data);

        // get names key
        let sampleNames = data.names;

        //show in console to verify data
        console.log(sampleNames);

        // use d3 to populate drop down using #selDataset from index.
        let selector = d3.select("#selDataset");

        // populate dropdpwn with data from the json url
        for(var i=0; i< sampleNames.length; i++)
        {
            selector.append("option").text(sampleNames[i]).property("value", sampleNames[i]);
        }
        //pass in the first sample as default
        let sample1 = sampleNames[0];
        //call the demo function
        demographic(sample1);
        //call bar chart function
        barChart(sample1);
        //call bubble chart function
        bubblechart(sample1);
    });
  
}
    
  

// function to update dashboard on change in name 
function optionChanged(selectedname){
    demographic(selectedname);
    barChart(selectedname);
    bubblechart(selectedname);
}
init();
