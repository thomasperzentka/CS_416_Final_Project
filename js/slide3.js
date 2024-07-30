const margin = { top: 20, right: 50, bottom: 50, left: 90 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

const svg3 = d3.select("#barChartIncome")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const validIncomeGroups = ["Low income", "Lower middle income", "Upper middle income", "High income"];

d3.csv("data/Tourismdata.csv").then(data => {
    const groupedData = d3.rollups(data, v => d3.mean(v, d => +d.Tourists), d => d.IncomeGroup).map(d => ({ IncomeGroup: d[0], Tourists: d[1] })).filter(d => validIncomeGroups.includes(d.IncomeGroup)).sort((a, b) => d3.ascending(a.Tourists, b.Tourists));

    const x = d3.scaleBand().domain(groupedData.map(d => d.IncomeGroup)).range([0, width]).padding(0.1);
    const y = d3.scaleLinear().domain([0, d3.max(groupedData, d => d.Tourists)]).range([height, 0]);

    svg3.selectAll("rect").data(groupedData).join("rect").attr("x", d => x(d.IncomeGroup)).attr("y", d => y(d.Tourists)).attr("width", x.bandwidth()).attr("height", d => height - y(d.Tourists)).attr("fill", "blue");

    svg3.append("g").call(d3.axisLeft(y));

    svg3.append("g").attr("transform", `translate(0,${height})`).call(d3.axisBottom(x));

    addLabels(svg3, width, height, "Income Level", "Average Number of Tourists");
})
function addLabels(svg, width, height, xlabel, ylabel) {
    svg.append("text").attr("class", "x label").attr("text-anchor", "end").attr("x", width - 300).attr("y", height + 50).text(xlabel);
    svg.append("text").attr("class", "y label").attr("text-anchor", "end").attr("y", -80).attr("x", -160).attr("dy", ".75em").attr("transform", "rotate(-90)").text(ylabel);
}
