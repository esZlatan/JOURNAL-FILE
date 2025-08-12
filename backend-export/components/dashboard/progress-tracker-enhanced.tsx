import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ProgressRule {
  id: string;
  title: string;
  completed: boolean;
}

interface ProgressTrackerEnhancedProps {
  hideValues?: boolean;
}

// Mock data for the heatmap
const mockData = {
  days: Array.from({ length: 30 }, (_, i) => ({
    intensity: Math.floor(Math.random() * 5), // 0-4 intensity
    date: new Date(2025, 6, i + 1), // July 2025
  })),
  rules: [
    { id: "rule1", title: "Review market conditions before trading", completed: true },
    { id: "rule2", title: "Wait for confirmed setup", completed: true },
    { id: "rule3", title: "Use proper position sizing", completed: false },
    { id: "rule4", title: "Set stop loss for every trade", completed: true },
    { id: "rule5", title: "Follow trading plan", completed: false },
  ],
};

export function ProgressTrackerEnhanced({ hideValues = false }: ProgressTrackerEnhancedProps) {
  const [dailyChecklist, setDailyChecklist] = useState<boolean>(false);
  const [rules, setRules] = useState<ProgressRule[]>(mockData.rules);

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, completed: !rule.completed } : rule
    ));
  };

  const scoreToday = rules.filter(r => r.completed).length;
  const totalRules = rules.length;
  const scorePercentage = (scoreToday / totalRules) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          Progress tracker
          <a href="#" className="text-xs text-blue-500 hover:underline">View more</a>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex">
          <div className="flex flex-col justify-around pr-4">
            <div className="text-xs text-gray-500">Mon</div>
            <div className="text-xs text-gray-500">Tue</div>
            <div className="text-xs text-gray-500">Wed</div>
            <div className="text-xs text-gray-500">Thu</div>
            <div className="text-xs text-gray-500">Fri</div>
            <div className="text-xs text-gray-500">Sat</div>
          </div>
          <div className="flex-grow">
            <div className="grid grid-cols-5 gap-1 mb-1">
              <div className="text-xs text-gray-500">Jul</div>
              <div className="text-xs text-gray-500">Aug</div>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {mockData.days.map((day, i) => {
                const bgClass = day.intensity === 0 
                  ? "bg-gray-100" 
                  : `bg-blue-${day.intensity * 100 > 500 ? 500 : day.intensity * 100}`;
                
                return (
                  <div key={i} className={`w-5 h-5 rounded-sm ${bgClass}`}></div>
                );
              })}
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
              <div 
                className="bg-blue-500 rounded-full h-2" 
                style={{ width: `${scorePercentage}%` }}
              ></div>
            </div>
            <span className="text-sm ml-2">{scoreToday}/{totalRules}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3 w-full"
            onClick={() => setDailyChecklist(true)}
          >
            Daily checklist
          </Button>
        </div>

        <Dialog open={dailyChecklist} onOpenChange={setDailyChecklist}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Daily Trading Rules Checklist</DialogTitle>
              <DialogDescription>
                Mark the rules you've followed today to track your trading discipline.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {rules.map((rule) => (
                <div key={rule.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={rule.id} 
                    checked={rule.completed}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                  <Label 
                    htmlFor={rule.id}
                    className={rule.completed ? "text-green-600 font-medium" : ""}
                  >
                    {rule.title}
                  </Label>
                </div>
              ))}
            </div>
            <Button className="mt-4 w-full" onClick={() => setDailyChecklist(false)}>
              Save
            </Button>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}