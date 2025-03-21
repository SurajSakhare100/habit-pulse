import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  date: string;
  completion: number;
}

interface LineChartProps {
  data: DataPoint[];
  color: string;
}

export function LineChart({ data, color }: LineChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Setup dimensions
    const svg = d3.select(svgRef.current);
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const margin = { top: 10, right: 10, bottom: 20, left: 10 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Parse dates
    const parsedData = data.map(d => ({
      ...d,
      date: new Date(d.date)
    }));

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(parsedData, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0]);

    // Create line generator
    const line = d3.line<any>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.completion))
      .curve(d3.curveMonotoneX);

    // Create the chart group
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add the line path
    g.append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add dots
    g.selectAll("circle")
      .data(parsedData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.date))
      .attr("cy", d => yScale(d.completion))
      .attr("r", 3)
      .attr("fill", color);

  }, [data, color]);

  return (
    <svg 
      ref={svgRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        overflow: 'visible'
      }}
    />
  );
}
