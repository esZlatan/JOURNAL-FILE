import React from 'react';

type Impact = 'high' | 'medium' | 'low';

interface ImpactFilterBadgesProps {
  selectedImpacts: Impact[];
  toggleImpact: (impact: Impact) => void;
}

export function ImpactFilterBadges({ selectedImpacts, toggleImpact }: ImpactFilterBadgesProps) {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <div 
        className={`flex items-center cursor-pointer px-2 py-1 rounded-md ${selectedImpacts.includes('high') ? 'bg-gray-100' : ''}`}
        onClick={() => toggleImpact('high')}
      >
        <div className="h-3 w-3 rounded-full bg-red-500 mr-1"></div>
        <span>High Impact</span>
      </div>
      <div 
        className={`flex items-center cursor-pointer px-2 py-1 rounded-md ${selectedImpacts.includes('medium') ? 'bg-gray-100' : ''}`}
        onClick={() => toggleImpact('medium')}
      >
        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-1"></div>
        <span>Medium Impact</span>
      </div>
      <div 
        className={`flex items-center cursor-pointer px-2 py-1 rounded-md ${selectedImpacts.includes('low') ? 'bg-gray-100' : ''}`}
        onClick={() => toggleImpact('low')}
      >
        <div className="h-3 w-3 rounded-full bg-blue-500 mr-1"></div>
        <span>Low Impact</span>
      </div>
    </div>
  );
}