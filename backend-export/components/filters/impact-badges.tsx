import React, { useState } from "react";

type Impact = "High" | "Medium" | "Low" | "All";
type ImpactColors = {
  [key in Exclude<Impact, "All">]: {
    bg: string;
    dot: string;
    hover: string;
    active: string;
  }
};

interface ImpactBadgesProps {
  onFilterChange?: (impact: Impact) => void;
  className?: string;
}

export function ImpactBadges({ onFilterChange, className = "" }: ImpactBadgesProps) {
  const [selectedImpact, setSelectedImpact] = useState<Impact>("All");

  const impactColors: ImpactColors = {
    "High": { 
      bg: "bg-gray-100", 
      dot: "bg-red-500", 
      hover: "hover:bg-gray-200",
      active: "bg-gray-200"
    },
    "Medium": { 
      bg: "bg-gray-100", 
      dot: "bg-yellow-500", 
      hover: "hover:bg-gray-200",
      active: "bg-gray-200"
    },
    "Low": { 
      bg: "bg-gray-100", 
      dot: "bg-blue-500", 
      hover: "hover:bg-gray-200",
      active: "bg-gray-200"
    }
  };

  const handleImpactClick = (impact: Impact) => {
    const newImpact = impact === selectedImpact ? "All" : impact;
    setSelectedImpact(newImpact);
    if (onFilterChange) {
      onFilterChange(newImpact);
    }
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      {Object.keys(impactColors).map((impact) => {
        const impactKey = impact as Exclude<Impact, "All">;
        const isSelected = selectedImpact === impactKey;
        const colors = impactColors[impactKey];

        return (
          <div
            key={impact}
            className={`flex items-center cursor-pointer px-2 py-1 rounded-md ${colors.bg} ${colors.hover} ${isSelected ? colors.active : ''}`}
            onClick={() => handleImpactClick(impactKey)}
          >
            <div className={`h-3 w-3 rounded-full ${colors.dot} mr-1`}></div>
            <span>{impact} Impact</span>
          </div>
        );
      })}
    </div>
  );
}