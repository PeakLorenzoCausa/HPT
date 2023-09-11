
function readFile(){
    const fileCSV = document.getElementById('fileCSV');
    const reader = new FileReader();
    const fileSelector = document.getElementById('file-selector');
    fileSelector.addEventListener('change', (event) => {
        const fileList = event.target.files;
        const file = event.target.files[0];
        console.log(fileList);
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            fileCSV.src = event.target.result;
            getData();
        });
        reader.readAsText(file);

    });
}
// getData function

async function getData() {


    // initialize variables
    let rawData = fileCSV.src;
    console.log(rawData);
    if ((typeof rawData == 'undefined')){
        return;
    }

    let arrayOne = rawData.split("\r\n");
    console.log(arrayOne);
    let header = arrayOne[0].split(",");
    let noOfRow = arrayOne.length;
    let noOfCol = header.length;
    let jsonData = [];
    let i = 0;
    let j = 0;

    // for loop (rows)
    for (i = 1; i < noOfRow - 1; i++) {
        let obj = {};
        let myNewLine = arrayOne[i].split(",");
        // nested for loop (columns)
        for (j = 0; j < noOfCol; j++) {
            obj[header[j]] = myNewLine[j];
        };
        // generate JSON
        jsonData.push(obj);
    };

    // developer info
    //console.log(jsonData);
    //console.table(jsonData);
    //console.log("jsonData type: " + typeof jsonData);

    // initialize variables
    let children = jsonData;
    let table = document.createElement("table");

    // function to generate table header row
    function addHeaders(table, keys) {
        let row = table.insertRow();
        for (i = 0; i < keys.length; i++) {
            let cell = row.insertCell();
            cell.appendChild(document.createTextNode(keys[i]));
        }
    }

    // generate table
    for (i = 0; i < children.length; i++) {
        let child = children[i];
        // generate header row
        if (i === 0) {
            addHeaders(table, Object.keys(child));
        }
        // generate data rows
        let row = table.insertRow();
        Object.keys(child).forEach(function (k) {
            let cell = row.insertCell();
            cell.appendChild(document.createTextNode(child[k]));
        })
    }

    // publish table
    //document.getElementById("container").appendChild(table);

    // developer info
    //console.log("HTML table type: " + typeof table);

    // generate array for x-axis (time)

    let time = [];

    for (i in jsonData) {
        let item = jsonData[i];
        time.push(item.Time);
    }
    console.log(time);

    // generate arrays for y-axis
    let pressure = [];

    for (i in jsonData) {
        let item = jsonData[i];
        pressure.push(item[" Current pressure"]);
    }

    let target = [];

    for (i in jsonData) {
        let item = jsonData[i];
        target.push(item[" Target pressure"]);
    }

    // newPlot() arguments
    let p = document.getElementById("myPlot");

    let plotData = [
           {x: time, y: pressure, mode:"lines",name:"Pressure"},
           {x: time, y: target, mode:"lines",name:"Target"},
    ];

    let layout = {
        title: "Pressure test",
        xaxis: { title: "Time [s]" },
        yaxis: { title: "Pressure [mbar]" },
        showlegend: true,
    };

    // generate plot
    Plotly.newPlot(p, plotData, layout, {displaylogo: false});

}

