import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Log {
  date: string;
  status: boolean;
}

interface CalendarHeatmapProps {
  logs: Log[];
}

export function CalendarHeatmap({ logs }: CalendarHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !logs.length) return;

    const margin = { top: 20, right: 30, bottom: 20, left: 40 };
    const cellSize = 20;
    const width = 800;
    const height = 140;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Process data
    const dateMap = new Map(
      logs.map(log => [log.date, log.status])
    );

    // Create date range
    const today = new Date();
    const startDate = d3.timeMonth.offset(today, -11);
    const endDate = today;
    const dates = d3.timeDay.range(startDate, d3.timeDay.offset(endDate, 1));

    // Create week scale
    const weeks = Math.ceil(dates.length / 7);
    
    // Create color scale
    const colorScale = d3.scaleSequential()
      .domain([0, 1])
      .interpolator(d3.interpolateGreens);

    // Draw cells
    svg.selectAll("rect")
      .data(dates)
      .join("rect")
      .attr("width", cellSize - 2)
      .attr("height", cellSize - 2)
      .attr("x", (d: Date) => {
        const weekOfYear = d3.timeWeek.count(d3.timeYear(d), d);
        return weekOfYear * cellSize;
      })
      .attr("y", (d: Date) => d.getDay() * cellSize)
      .attr("fill", (d: Date) => {
        const dateStr = d.toISOString().split('T')[0];
        return dateMap.has(dateStr) ? (dateMap.get(dateStr) ? colorScale(1) : colorScale(0)) : "#eee";
      })
      .attr("rx", 2)
      .attr("ry", 2)
      .append("title")
      .text((d: Date) => {
        const dateStr = d.toISOString().split('T')[0];
        const status = dateMap.get(dateStr);
        return `${d.toLocaleDateString()}: ${status ? "Completed" : "Not completed"}`;
      });

    // Add month labels
    const months = d3.timeMonth.range(startDate, endDate);
    
    svg.selectAll(".month")
      .data(months)
      .join("text")
      .attr("class", "month")
      .attr("x", (d: Date) => {
        const weekOfYear = d3.timeWeek.count(d3.timeYear(d), d);
        return weekOfYear * cellSize;
      })
      .attr("y", -5)
      .text((d: Date) => d.toLocaleDateString(undefined, { month: 'short' }))
      .attr("font-size", 12);

    // Add day labels
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    svg.selectAll(".day")
      .data(days)
      .join("text")
      .attr("class", "day")
      .attr("x", -5)
      .attr("y", (_: string, i: number) => i * cellSize + cellSize / 1.5)
      .text((d: string) => d[0])
      .attr("text-anchor", "end")
      .attr("font-size", 12);

  }, [logs]);

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="w-full" style={{ minWidth: '900px' }}></svg>
    </div>
  );
}
