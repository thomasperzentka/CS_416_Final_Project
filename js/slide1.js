const margin = { top: 20, right: 500, bottom: 50, left: 90 },
    width = 1100 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

const svg = d3.select("#barChart")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

d3.csv("data/Tourismdata.csv").then(data => {
    const years = [...new Set(data.map(d => +d.Year))].sort((a, b) => a - b);
    let year = years[0];
    updateChart(year);

    function updateChart(year) {
        const filteredData = data.filter(d => +d.Year === year).sort((a, b) => +b.Tourists - +a.Tourists).slice(0, 10);
        const x = d3.scaleLinear().domain([0, d3.max(filteredData, d => +d.Tourists)]).range([0, width]);
        const y = d3.scaleBand().domain(filteredData.map(d => d['Country Name'])).range([0, height]).padding(0.1);

        svg.selectAll("*").remove(); 
        svg.selectAll("rect").data(filteredData).join("rect").attr("x", x(0)).attr("y", d => y(d['Country Name'])).attr("width", d => x(+d.Tourists)).attr("height", y.bandwidth()).attr("fill", d => colorScale(d.Region));
        svg.selectAll("text").data(filteredData).join("text").attr("x", d => x(+d.Tourists) + 5).attr("y", d => y(d['Country Name']) + y.bandwidth() / 2).attr("dy", ".35em").text(d => d.Tourists);
        svg.append("g").call(d3.axisLeft(y));
        svg.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(5));
        addLabels(svg, width, height, "Number of Tourists", "Country Name");

        const regions = [...new Set(filteredData.map(d => d.Region))];
        addLegend(svg, colorScale, regions, width, height);
    }

    d3.select("#yearSlider").attr("min", years[0]).attr("max", years[years.length - 1]).on("input", function () {
            updateChart(+this.value);
        });
    d3.select("#yearLabelStart").text(years[0]);
    d3.select("#yearLabelEnd").text(years[years.length - 1]);
})

function addLabels(svg, width, height, xlabel, ylabel) {
    svg.append("text").attr("class", "x label").attr("text-anchor", "end").attr("x", width - 200).attr("y", height + 50).text(xlabel);
    svg.append("text").attr("class", "y label").attr("text-anchor", "end").attr("y", -90).attr("x", -160).attr("dy", ".75em").attr("transform", "rotate(-90)").text(ylabel);
}

function addLegend(svg, colorScale, regions, width, height) {
    const legend = svg.append("g").attr("transform", `translate(${width + 150}, 0)`); 
    regions.forEach((region, i) => {
        const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 20})`);

        legendRow.append("rect").attr("width", 10).attr("height", 10).attr("fill", colorScale(region));
        legendRow.append("text").attr("x", 20).attr("y", 10).attr("text-anchor", "start").style("text-transform", "capitalize").text(region);
    });
}
