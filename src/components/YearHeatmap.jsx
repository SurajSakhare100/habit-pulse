// YearHeatmap.jsx
import React from "react";
import { eachDayOfInterval, startOfYear, endOfYear, format, getDay } from "date-fns";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

const generateYearData = (year = new Date().getFullYear()) => {
  const start = startOfYear(new Date(year, 0, 1));
  const end = endOfYear(start);
  return eachDayOfInterval({ start, end }).map(date => ({
    date,
    value: Math.floor(Math.random() * 5), // Replace with real data
  }));
};

const getColor = (value) => {
  const colors = ["bg-gray-200", "bg-green-200", "bg-green-400", "bg-green-600", "bg-green-800"];
  return colors[value] || colors[0];
};

export default function YearHeatmap({ year = new Date().getFullYear() }) {
  const data = generateYearData(year);

  // Group days by weeks
  const weeks = [];
  let week = [];
  const offset = getDay(data[0].date); // Fill first week start
  for (let i = 0; i < offset; i++) {
    week.push(null);
  }

  data.forEach((day) => {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) weeks.push(week); // Push last partial week

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 font-bold">Year Heatmap - {year}</h2>
      <div className="grid grid-cols-[auto_1fr] gap-2">
        <div className="flex flex-col gap-1">
          {daysOfWeek.map((d, idx) => (
            <div key={idx} className="text-xs text-center text-gray-500">{d}</div>
          ))}
        </div>

        <div className="flex gap-[2px] overflow-x-auto">
          {weeks.map((week, i) => (
            <div key={i} className="flex flex-col gap-[2.5px]">
              {week.map((day, j) =>
                day ? (
                  <div
                    key={j}
                    className={`w-4 h-4 rounded ${getColor(day.value)}`}
                    title={`${format(day.date, "yyyy-MM-dd")}: ${day.value}`}
                  />
                ) : (
                  <div key={j} className="w-4 h-4" />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
