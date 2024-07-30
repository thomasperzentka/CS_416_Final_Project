const margin = {top:20, right:30, bottom:50, left:100}, 
width = 800 - margin.left - margin.right,
height = 600 - margin.top - margin.bottom;
const svg2 = d3.select("#lineChart").append("g").attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("data/Tourismdata.csv").then(data => {
    const countries = [...new Set(data.map(d => d['Country Name']))].sort();
    const selector = d3.select("#countrySelector");
    countries.forEach(country => {
        selector.append("option").text(country).attr("value", country);
    });
    updateChart(countries[0]);
    selector.on("change", function () {
        updateChart(this.value);
    });
    function updateChart(country) {
        const filteredData = data.filter(d => d['Country Name'] === country);
        const x = d3.scaleTime().domain(d3.extent(filteredData, d => new Date(d.Year, 0, 1))).range([0, width]);
        const y = d3.scaleLinear().domain([0, d3.max(filteredData, d => +d.Tourists)]).range([height, 0]);

        svg2.selectAll("*").remove();
        svg2.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x).ticks(5));
        svg2.append("g").call(d3.axisLeft(y));
        svg2.append("path").datum(filteredData).attr("fill", "none").attr("stroke", "blue").attr("stroke-width", 1.5).attr("d", d3.line().x(d => x(new Date(d.Year, 0, 1))).y(d => y(+d.Tourists))
            );
        svg2.append("text").attr("class", "x label").attr("text-anchor", "end").attr("x", width -300).attr("y", height + 50).text("Year");
        svg2.append("text").attr("class", "y label").attr("text-anchor", "end").attr("y", -80).attr("x", -160).attr("dy", ".75em").attr("transform", "rotate(-90)").text("Number of Tourists");
    }
});
