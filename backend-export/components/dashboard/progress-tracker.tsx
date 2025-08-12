import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProgressTrackerProps {
  hideValues?: boolean;
}

export function ProgressTracker({ hideValues = false }: ProgressTrackerProps) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jul", "Aug"];

  // Generate grid of activity
  const generateActivityGrid = () => {
    const activityLevels = ["less", "low", "medium", "high", "more"];
    const grid = Array.from({ length: days.length }, () => 
      Array.from({ length: 5 }, () => {
        // Random activity level
        const level = Math.floor(Math.random() * 5);
        return activityLevels[level];
      })
    );

    // Special case for one specific high activity
    grid[2][4] = "more"; // Wednesday, latest week

    return grid;
  };

  const activityGrid = generateActivityGrid();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          Progress tracker
          <a href="#" className="text-xs text-blue-500 hover:underline">View more</a>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex">
          <div className="flex flex-col justify-around pr-4">
            {days.map((day) => (
              <div key={day} className="text-xs text-gray-500">{day}</div>
            ))}
          </div>
          <div className="flex-grow">
            <div className="grid grid-cols-5 gap-1 mb-1">
              {months.map((month, i) => (
                <div key={month} className="text-xs text-gray-500">
                  {month}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-1">
              {activityGrid.map((row, rowIdx) => (
                <React.Fragment key={rowIdx}>
                  {row.map((level, colIdx) => (
                    <div 
                      key={`${rowIdx}-${colIdx}`}
                      className={`w-5 h-5 rounded-sm ${
                        level === "less" ? "bg-gray-100" : 
                        level === "low" ? "bg-blue-100" : 
                        level === "medium" ? "bg-blue-200" : 
                        level === "high" ? "bg-blue-300" : 
                        "bg-blue-500"
                      }`}
                    ></div>
                  ))}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-end mt-2 text-xs text-gray-500">
              <div className="flex items-center">
                Less
                <div className="flex mx-1">
                  <div className="w-3 h-3 bg-gray-100 mr-1"></div>
                  <div className="w-3 h-3 bg-blue-100 mr-1"></div>
                  <div className="w-3 h-3 bg-blue-200 mr-1"></div>
                  <div className="w-3 h-3 bg-blue-300 mr-1"></div>
                  <div className="w-3 h-3 bg-blue-500"></div>
                </div>
                More
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="text-sm font-medium">Today's score</div>
          <div className="flex items-center mt-1">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 rounded-full h-2" style={{ width: '60%' }}></div>
            </div>
            <span className="text-sm ml-2">3/5</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}