import * as d3 from 'd3';

interface Point {
    x: number;
    y: number;
}

const TRANSITION_DURATION = 300;

const generateRandomLineChartData = (n: number = 100, max: number = 10): Point[] => {
    const data: Point[] = [{ x: 0, y: 0 }];
    let y = 0;

    for (let x = 0; x < n; x++) {
        const rand = Math.floor(Math.random() * max);

        if (Math.random() < 0.5) {
            if (y - rand < 0) {
                y += rand;
            } else {
                y -= rand
            }
        } else {
            y += rand;
        }

        data.push({ x: x * 12.07, y });
    }

    return data;
};

// Chart size and margin
const margin = { top: 80, right: 80, bottom: 80, left: 80 };
const width = 750 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Initialize chart
const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

// Initialize axes
const xScale = d3.scaleLinear()
    //.domain([0, xMax])
    .range([0, width])
    .nice();

const yScale = d3.scaleLinear()
    //.domain([0, yMax])
    .range([height, 0])
    .nice();

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'x-axis');

svg.append('g')
    .attr('class', 'y-axis');

svg.select('.x-axis').call(xAxis);
svg.select('.y-axis').call(yAxis);

// Add axis labels
svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom / 2)
    .text('x axis');

svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', 0 - height / 2)
    .attr('y', 0 - margin.left / 2)
    .text('y axis');


const updateChart = (data: Point[]): void => {
    const xMax = d3.max(data, (d) => d.x) as number;
    const yMax = d3.max(data, (d) => d.y) as number;

    xScale.domain([0, xMax]);
    yScale.domain([0, yMax]);

    svg.select('.x-axis')
        .transition()
        .duration(TRANSITION_DURATION)
        .call(xAxis);

    svg.select('.y-axis')
        .transition()
        .duration(TRANSITION_DURATION)
        .call(yAxis);

    // Draw line
    const line = svg.selectAll('.line')
        .data([data], (d) => d.x);

    // Updata the line
    line
        .enter()
        .append('path')
        .attr('class', 'line')
        .merge(line)
        .transition()
        .duration(TRANSITION_DURATION)
        .attr('d', d3.line()
            .x((d) => xScale(d.x))
            .y((d) => yScale(d.y))
        )
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 1.5);
};

setInterval(() => {
    const data = generateRandomLineChartData(1024, 50);
    updateChart(data);
}, TRANSITION_DURATION * 2);
