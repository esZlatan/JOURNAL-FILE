import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import html2canvas
import html2canvas from 'html2canvas';

// Type definition for html2canvas to avoid TypeScript errors
declare global {
  interface Window {
    html2canvas: typeof html2canvas;
  }
}
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types for displaying metrics
type MetricOption = {
  id: string;
  label: string;
};

type DayData = {
  day: number;
  pnl?: number;
  pnlPercent?: number;
  winRate?: number;
  ticks?: number;
  pips?: number;
  points?: number;
  numTrades?: number;
  rr?: number;
};

type WeeklySummary = {
  weekNumber: number;
  netPnl: number;
  winRate: number;
  trades: number;
};

type MonthData = {
  days: DayData[];
  month: number;
  year: number;
  weeklySummaries?: WeeklySummary[];
};

// Dummy data for demo - would come from real data in production
const dummyMonthData: MonthData = {
  month: 7, // August (0-indexed)
  year: 2025,
  weeklySummaries: [
    { weekNumber: 1, netPnl: -323.7, winRate: 16.7, trades: 6 },
    { weekNumber: 2, netPnl: 843.2, winRate: 75.0, trades: 8 },
    { weekNumber: 3, netPnl: -123.5, winRate: 40.0, trades: 5 },
    { weekNumber: 4, netPnl: 576.0, winRate: 66.7, trades: 6 },
  ],
  days: [
    { day: 1 },
    { day: 2 },
    { day: 3, pnl: -297, pnlPercent: -2.25, numTrades: 2, winRate: 0, ticks: -35, pips: -29.7, points: -297, rr: -1.5 },
    { day: 4, pnl: -446.7, pnlPercent: -3.2, numTrades: 3, winRate: 0.33, ticks: -45, pips: -44.67, points: -446.7, rr: -2.1 },
    { day: 5 },
    { day: 6, pnl: 512, pnlPercent: 3.72, numTrades: 2, winRate: 1, ticks: 56, pips: 51.2, points: 512, rr: 2.5 },
    { day: 7, pnl: -192, pnlPercent: -1.4, numTrades: 1, winRate: 0, ticks: -20, pips: -19.2, points: -192, rr: -0.95 },
    { day: 8, pnl: -137, pnlPercent: -1.05, numTrades: 2, winRate: 0.5, ticks: -15, pips: -13.7, points: -137, rr: -0.6 },
    { day: 9 },
    { day: 10 },
    { day: 11 },
    { day: 12 },
    { day: 13 },
    { day: 14 },
    { day: 15 },
    { day: 16 },
    { day: 17 },
    { day: 18 },
    { day: 19 },
    { day: 20 },
    { day: 21 },
    { day: 22 },
    { day: 23 },
    { day: 24 },
    { day: 25 },
    { day: 26 },
    { day: 27 },
    { day: 28 },
    { day: 29 },
    { day: 30 },
    { day: 31 },
  ],
};

export function TradingCalendar({ hideValues = false }) {
  const [currentMonth, setCurrentMonth] = useState<MonthData>(dummyMonthData);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["pnl", "pnlPercent"]);
  const [showWeeklySummary, setShowWeeklySummary] = useState<boolean>(true);
  const [showWeeklyCalculation, setShowWeeklyCalculation] = useState<boolean>(true);
  const [hideValuesPrivacy, setHideValuesPrivacy] = useState<boolean>(hideValues);
  const [weeklyView, setWeeklyView] = useState<boolean>(true); // Default to weekly view
  
  // Listen for privacy toggle events
  React.useEffect(() => {
    const handlePrivacyToggle = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail && customEvent.detail.isPrivate !== undefined) {
        setHideValuesPrivacy(customEvent.detail.isPrivate);
      } else {
        setHideValuesPrivacy(prev => !prev);
      }
    };
    
    window.addEventListener('toggle-dashboard-privacy', handlePrivacyToggle);
    return () => {
      window.removeEventListener('toggle-dashboard-privacy', handlePrivacyToggle);
    };
  }, []);
  
  const metricOptions: MetricOption[] = [
    { id: "pnl", label: "P&L" },
    { id: "pnlPercent", label: "P&L %" },
    { id: "rr", label: "RR" },
    { id: "ticks", label: "Ticks" },
    { id: "pips", label: "Pips" },
    { id: "points", label: "Points" },
    { id: "numTrades", label: "Number of trades" },
    { id: "winRate", label: "Win rate" },
  ];

  const prevMonth = () => {
    // In a real app, fetch the previous month's data
    setCurrentMonth({
      ...currentMonth,
      month: currentMonth.month === 0 ? 11 : currentMonth.month - 1,
      year: currentMonth.month === 0 ? currentMonth.year - 1 : currentMonth.year,
    });
  };

  const nextMonth = () => {
    // In a real app, fetch the next month's data
    setCurrentMonth({
      ...currentMonth,
      month: currentMonth.month === 11 ? 0 : currentMonth.month + 1,
      year: currentMonth.month === 11 ? currentMonth.year + 1 : currentMonth.year,
    });
  };

  const getMonthName = (month: number): string => {
    const months = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    return months[month];
  };

  const getDayBackgroundColor = (day: DayData) => {
    if (!day.pnl) return "bg-transparent";
    return day.pnl > 0 ? "bg-green-50" : day.pnl < 0 ? "bg-red-50" : "bg-transparent";
  };

  const getMetricDisplay = (day: DayData) => {
    if (!day.pnl) return null;
    
    return (
      <div className="text-center flex-1 flex items-center justify-center flex-col">
        {selectedMetrics.includes("pnl") && (
          <div className={`text-xs font-semibold financial-value ${day.pnl > 0 ? "text-green-500" : "text-rose-500"} ${hideValuesPrivacy ? "blur-financial" : ""}`}>
            ${day.pnl.toFixed(day.pnl % 1 === 0 ? 0 : 2)}
          </div>
        )}
        {selectedMetrics.includes("pnlPercent") && (
          <div className={`text-xs financial-value ${day.pnl > 0 ? "text-green-500" : "text-rose-500"} ${hideValuesPrivacy ? "blur-financial" : ""}`}>
            {day.pnlPercent}%
          </div>
        )}
        {selectedMetrics.includes("rr") && day.rr && (
          <div className={`text-xs financial-value ${day.rr > 0 ? "text-green-500" : "text-rose-500"} ${hideValuesPrivacy ? "blur-financial" : ""}`}>
            RR: {day.rr.toFixed(2)}
          </div>
        )}
        {selectedMetrics.includes("ticks") && day.ticks && (
          <div className={`text-xs financial-value ${day.ticks > 0 ? "text-green-500" : "text-rose-500"} ${hideValuesPrivacy ? "blur-financial" : ""}`}>
            Ticks: {day.ticks}
          </div>
        )}
        {selectedMetrics.includes("pips") && day.pips && (
          <div className={`text-xs financial-value ${day.pips > 0 ? "text-green-500" : "text-rose-500"} ${hideValuesPrivacy ? "blur-financial" : ""}`}>
            Pips: {day.pips.toFixed(1)}
          </div>
        )}
        {selectedMetrics.includes("points") && day.points && (
          <div className={`text-xs financial-value ${day.points > 0 ? "text-green-500" : "text-rose-500"} ${hideValuesPrivacy ? "blur-financial" : ""}`}>
            Pts: {day.points}
          </div>
        )}
        {selectedMetrics.includes("numTrades") && day.numTrades && (
          <div className={`text-xs text-gray-600 financial-value ${hideValuesPrivacy ? "blur-financial" : ""}`}>
            Trades: {day.numTrades}
          </div>
        )}
        {selectedMetrics.includes("winRate") && day.winRate !== undefined && (
          <div className={`text-xs text-gray-600 financial-value ${hideValuesPrivacy ? "blur-financial" : ""}`}>
            Win: {(day.winRate * 100).toFixed(0)}%
          </div>
        )}
      </div>
    );
  };

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(m => m !== metricId)
        : [...prev, metricId]
    );
  };

  return (
    <Card>
      <div className="space-y-1.5 p-6 flex flex-row items-center">
        <div className="flex flex-1">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            {weeklyView ? 'Weekly' : 'Monthly'} stats: {getMonthName(currentMonth.month)} {currentMonth.year}
          </h3>
        </div>
        <div className="flex items-center text-sm space-x-2">
          <div className="flex border rounded-md overflow-hidden">
            <button
              onClick={() => setWeeklyView(true)}
              className={`px-2 py-1 text-xs ${weeklyView ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setWeeklyView(false)}
              className={`px-2 py-1 text-xs ${!weeklyView ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            >
              Monthly
            </button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-6 px-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Display Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {metricOptions.map((metric) => (
                <DropdownMenuCheckboxItem
                  key={metric.id}
                  checked={selectedMetrics.includes(metric.id)}
                  onCheckedChange={() => toggleMetric(metric.id)}
                >
                  {metric.label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold">Display Options</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={showWeeklySummary}
                onCheckedChange={() => setShowWeeklySummary(!showWeeklySummary)}
              >
                Show Weekly Summary
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showWeeklyCalculation}
                onCheckedChange={() => setShowWeeklyCalculation(!showWeeklyCalculation)}
              >
                Sum Weekly Results
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="h-6 px-2" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-6 px-2" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-6 px-2"
            onClick={() => {
              // Logic to set current month
              const today = new Date();
              const month = today.getMonth();
              const year = today.getFullYear();
              // In a real app, you would fetch the current month's data
              setCurrentMonth({
                ...dummyMonthData,
                month: month,
                year: year
              });
            }}
            title="Show current month"
          >
            This Month
          </Button>
          {/* Hide Values button removed as requested */}
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 px-2"
              onClick={() => {
                const dropdown = document.getElementById('shareDropdown');
                if (dropdown) {
                  dropdown.classList.toggle('hidden');
                }
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <div id="shareDropdown" className="absolute right-0 mt-2 w-56 p-2 rounded-md border bg-background shadow-md z-10 hidden">
              <div className="flex flex-col space-y-1">
                <button className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                  Share Link
                </button>
                <button 
                  className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent"
                  onClick={() => {
                    // Function to download calendar as image
                    const downloadCalendarImage = () => {
                      // Create a reference to the calendar element
                      const calendarElement = document.querySelector('.calendar-container') || document.querySelector('.card');
                      
                      if (calendarElement) {
                        // Use browser's file download dialog
                        html2canvas(calendarElement as HTMLElement).then(canvas => {
                          const link = document.createElement('a');
                          link.download = `trading-calendar-${getMonthName(currentMonth.month)}-${currentMonth.year}.png`;
                          link.href = canvas.toDataURL('image/png');
                          link.click();
                        });
                      }
                    };
                    
                    // Include html2canvas script if it doesn't exist
                    if (!window.html2canvas) {
                      const script = document.createElement('script');
                      script.src = 'https://html2canvas.hertzen.com/dist/html2canvas.min.js';
                      script.onload = downloadCalendarImage;
                      document.head.appendChild(script);
                    } else {
                      downloadCalendarImage();
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  Share as Image
                </button>
                <button className="flex items-center px-2 py-1.5 text-sm rounded-md hover:bg-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                  Copy to Clipboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-6 pt-0">
        {weeklyView ? (
          <div className="space-y-4">
            {/* Weekly View - Enhanced Version */}
            {(() => {
              // Calculate weeks based on the month data
              const daysInMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();
              const firstDayOfMonth = new Date(currentMonth.year, currentMonth.month, 1).getDay();
              const weeks = [];
              
              // Calculate how many weeks we need to display
              const totalDays = firstDayOfMonth + daysInMonth;
              const totalWeeks = Math.ceil(totalDays / 7);
              
              // Create weekly summaries if they don't exist or if we want to calculate them
              const calculatedWeeklySummaries = [];
              
              for (let weekIndex = 0; weekIndex < totalWeeks; weekIndex++) {
                // Calculate days for this week
                const weekStartDay = weekIndex * 7 - firstDayOfMonth + 1;
                const weekEndDay = Math.min(daysInMonth, weekStartDay + 6);
                
                // Get the days that belong to this week
                const weekDays = [];
                for (let day = Math.max(1, weekStartDay); day <= weekEndDay; day++) {
                  // Find this day in the currentMonth.days array
                  const dayData = currentMonth.days.find(d => d.day === day) || { day };
                  weekDays.push(dayData);
                }
                
                // Calculate summary statistics for this week
                const daysThatHaveData = weekDays.filter(day => day.pnl !== undefined);
                const totalPnl = daysThatHaveData.reduce((sum, day) => sum + (day.pnl || 0), 0);
                const totalTrades = daysThatHaveData.reduce((sum, day) => sum + (day.numTrades || 0), 0);
                const winningTrades = daysThatHaveData.reduce((sum, day) => 
                  sum + ((day.winRate || 0) * (day.numTrades || 0)), 0);
                const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
                
                // Use precalculated summaries if available and showWeeklyCalculation is false
                let weekSummary;
                if (!showWeeklyCalculation && currentMonth.weeklySummaries && currentMonth.weeklySummaries[weekIndex]) {
                  weekSummary = currentMonth.weeklySummaries[weekIndex];
                } else {
                  weekSummary = {
                    weekNumber: weekIndex + 1,
                    netPnl: totalPnl,
                    winRate: winRate,
                    trades: totalTrades
                  };
                }
                calculatedWeeklySummaries.push(weekSummary);
                
                // Create week representation
                const weekStartDate = new Date(currentMonth.year, currentMonth.month, Math.max(1, weekStartDay));
                const weekEndDate = new Date(currentMonth.year, currentMonth.month, weekEndDay);
                const formattedStartDate = weekStartDate.getDate();
                const formattedEndDate = weekEndDate.getDate();
                
                weeks.push(
                  <div key={`week-${weekIndex+1}`} className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-muted p-3 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Week {weekIndex + 1}</h3>
                        <span className="text-xs text-muted-foreground">
                          {formattedStartDate} - {formattedEndDate} {getMonthName(currentMonth.month)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          {weekSummary.trades} trades
                        </div>
                        <div className={`font-bold ${weekSummary.netPnl >= 0 ? 'text-green-500' : 'text-rose-500'} ${hideValuesPrivacy ? 'blur-financial' : ''}`}>
                          ${weekSummary.netPnl.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 space-y-4">
                      {/* Weekly statistics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-2 rounded-md bg-gray-50 text-center">
                          <div className="text-xs text-muted-foreground">Win Rate</div>
                          <div className={`text-lg font-semibold ${hideValuesPrivacy ? 'blur-financial' : ''}`}>
                            {calculatedWeeklySummaries.reduce((total, week) => total + (week.winRate || 0), 0).toFixed(1)}%
                          </div>
                        </div>
                        <div className="p-2 rounded-md bg-gray-50 text-center">
                          <div className="text-xs text-muted-foreground">Avg P/L</div>
                          <div className={`text-lg font-semibold ${weekSummary.netPnl >= 0 ? 'text-green-500' : 'text-rose-500'} ${hideValuesPrivacy ? 'blur-financial' : ''}`}>
                            ${(weekSummary.trades > 0 ? weekSummary.netPnl / weekSummary.trades : 0).toFixed(2)}
                          </div>
                        </div>
                        <div className="p-2 rounded-md bg-gray-50 text-center">
                          <div className="text-xs text-muted-foreground">Total Trades</div>
                          <div className={`text-lg font-semibold ${hideValuesPrivacy ? 'blur-financial' : ''}`}>
                            {calculatedWeeklySummaries.reduce((total, week) => total + (week.trades || 0), 0)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Daily breakdown */}
                      <div>
                        <div className="text-xs uppercase font-medium text-muted-foreground mb-2">Daily Breakdown</div>
                        <div className="grid grid-cols-7 gap-1">
                          <div className="text-center font-medium text-xs py-1 text-muted-foreground">Sun</div>
                          <div className="text-center font-medium text-xs py-1 text-muted-foreground">Mon</div>
                          <div className="text-center font-medium text-xs py-1 text-muted-foreground">Tue</div>
                          <div className="text-center font-medium text-xs py-1 text-muted-foreground">Wed</div>
                          <div className="text-center font-medium text-xs py-1 text-muted-foreground">Thu</div>
                          <div className="text-center font-medium text-xs py-1 text-muted-foreground">Fri</div>
                          <div className="text-center font-medium text-xs py-1 text-muted-foreground">Sat</div>
                          
                          {/* Empty cells before month starts */}
                          {weekIndex === 0 && Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-start-${i}`} className="aspect-square p-1">
                              <div className="h-full border border-dashed rounded bg-gray-50"></div>
                            </div>
                          ))}
                          
                          {/* Days in this week */}
                          {weekDays.map(day => (
                            <div 
                              key={`day-${day.day}`} 
                              className={`aspect-square p-1 ${getDayBackgroundColor(day)}`}
                            >
                              <div className="h-full border rounded flex flex-col hover:border-primary transition-colors cursor-pointer">
                                <div className="text-xs p-1 font-bold flex justify-between">
                                  <span>{day.day}</span>
                                  {day.pnl !== undefined && (
                                    <span className={`text-xs ${day.pnl >= 0 ? 'text-green-500' : 'text-rose-500'} ${hideValuesPrivacy ? 'blur-financial' : ''}`}>
                                      {day.pnl >= 0 ? '+' : ''}${Math.abs(day.pnl).toFixed(0)}
                                    </span>
                                  )}
                                </div>
                                {getMetricDisplay(day)}
                              </div>
                            </div>
                          ))}
                          
                          {/* Empty cells after month ends */}
                          {weekIndex === totalWeeks - 1 && (() => {
                            const lastDayOfWeek = new Date(currentMonth.year, currentMonth.month, weekEndDay).getDay();
                            const emptyCells = 6 - lastDayOfWeek; // 6 is Saturday (0-indexed)
                            return Array.from({ length: emptyCells }).map((_, i) => (
                              <div key={`empty-end-${i}`} className="aspect-square p-1">
                                <div className="h-full border border-dashed rounded bg-gray-50"></div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              
              return weeks;
            })()}
          </div>
        ) : (
          <div className="grid grid-cols-8 gap-1">
            <div className="text-center font-medium text-sm py-1">Sun</div>
            <div className="text-center font-medium text-sm py-1">Mon</div>
            <div className="text-center font-medium text-sm py-1">Tue</div>
            <div className="text-center font-medium text-sm py-1">Wed</div>
            <div className="text-center font-medium text-sm py-1">Thu</div>
            <div className="text-center font-medium text-sm py-1">Fri</div>
            <div className="text-center font-medium text-sm py-1">Sat</div>
            {showWeeklySummary && <div className="text-center p-1 text-base font-bold">Week 1</div>}

            {/* First week empty cells */}
            {Array.from({ length: new Date(currentMonth.year, currentMonth.month, 1).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square p-1"></div>
            ))}
            
            {/* Calendar days with weekly summaries */}
            {(() => {
              const cells = [];
              let dayIndex = 0;
              let currentWeek = 1;
              let dayCounts = 0;
              
              // First, add the empty cells from beginning of the month
              const firstDayOfMonth = new Date(currentMonth.year, currentMonth.month, 1).getDay();
              dayCounts = firstDayOfMonth;
              
              // Then go through each day
              for (let i = 0; i < currentMonth.days.length; i++) {
                const day = currentMonth.days[i];
                
                // Add the day cell
                cells.push(
                  <div key={`day-${day.day}`} className={`aspect-square p-1 ${getDayBackgroundColor(day)}`}>
                    <div className="h-full border rounded flex flex-col">
                      <div className="text-sm p-1 font-bold">{day.day}</div>
                      {getMetricDisplay(day)}
                    </div>
                  </div>
                );
                
                dayIndex++;
                dayCounts++;
                
                // Check if we're at the end of a week (Saturday)
                if (dayCounts % 7 === 0) {
                  // Add weekly summary if enabled
                  if (showWeeklySummary) {
                    let summary;
                    
                    if (showWeeklyCalculation) {
                      // Calculate summary from actual days in the week
                      const weekDays = currentMonth.days.slice(Math.max(0, i - 6), i + 1)
                        .filter(day => day.pnl !== undefined);
                      
                      // Get total PnL, trades, and calculate win rate
                      const totalPnl = weekDays.reduce((sum, day) => sum + (day.pnl || 0), 0);
                      const totalTrades = weekDays.reduce((sum, day) => sum + (day.numTrades || 0), 0);
                      const winningTrades = weekDays.reduce((sum, day) => 
                        sum + ((day.winRate || 0) * (day.numTrades || 0)), 0);
                      const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
                      
                      summary = {
                        weekNumber: currentWeek,
                        netPnl: totalPnl,
                        winRate: winRate,
                        trades: totalTrades
                      };
                    } else {
                      // Use the predefined summary data
                      summary = currentMonth.weeklySummaries && currentWeek <= currentMonth.weeklySummaries.length 
                        ? currentMonth.weeklySummaries[currentWeek - 1] 
                        : { weekNumber: currentWeek, netPnl: 0, winRate: 0, trades: 0 };
                    }
                    
                    cells.push(
                      <div key={`week-${currentWeek}`} className="aspect-square p-1 row-span-1">
                        <div className="h-full border rounded flex flex-col bg-gray-50">
                          <div className="text-center p-1 text-base font-bold">Week</div>
                          <div className="flex-1 flex flex-col items-center justify-center text-xs">
                            <div className={`font-medium financial-value ${summary.netPnl >= 0 ? 'text-green-500' : 'text-rose-500'} ${hideValuesPrivacy ? 'blur-financial' : ''}`}>
                              ${summary.netPnl.toFixed(1)}
                            </div>
                            <div className={`text-gray-600 financial-value ${hideValuesPrivacy ? 'blur-financial' : ''}`}>
                              {summary.winRate.toFixed(1)}%
                            </div>
                            <div className={`text-gray-500 financial-value ${hideValuesPrivacy ? 'blur-financial' : ''}`}>
                              {summary.trades} trades
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                    currentWeek++;
                  }
                }
              }
              
              // Fill in the remaining empty cells for the last row
              const lastDayOfMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDay();
              const remainingCells = 6 - lastDayOfMonth; // 6 is Saturday (0-indexed)
              
              for (let i = 0; i < remainingCells; i++) {
                cells.push(<div key={`empty-end-${i}`} className="aspect-square p-1"></div>);
                dayCounts++;
              }
              
              // Add the final week summary if we have one
              if (showWeeklySummary) {
                let summary;
                
                if (showWeeklyCalculation) {
                  // Get the remaining days in the last incomplete week
                  const lastWeekDayIndex = currentMonth.days.length - 1;
                  const daysInLastWeek = (7 - lastDayOfMonth - 1) % 7; // Days from the last week
                  const weekDays = currentMonth.days.slice(lastWeekDayIndex - daysInLastWeek, lastWeekDayIndex + 1)
                    .filter(day => day.pnl !== undefined);
                  
                  // Get total PnL, trades, and calculate win rate
                  const totalPnl = weekDays.reduce((sum, day) => sum + (day.pnl || 0), 0);
                  const totalTrades = weekDays.reduce((sum, day) => sum + (day.numTrades || 0), 0);
                  const winningTrades = weekDays.reduce((sum, day) => 
                    sum + ((day.winRate || 0) * (day.numTrades || 0)), 0);
                  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
                  
                  summary = {
                    weekNumber: currentWeek,
                    netPnl: totalPnl,
                    winRate: winRate,
                    trades: totalTrades
                  };
                } else {
                  // Use the predefined summary data
                  summary = currentMonth.weeklySummaries && currentWeek <= currentMonth.weeklySummaries.length 
                    ? currentMonth.weeklySummaries[currentWeek - 1] 
                    : { weekNumber: currentWeek, netPnl: 0, winRate: 0, trades: 0 };
                }
                
                cells.push(
                  <div key={`week-${currentWeek}`} className="aspect-square p-1 row-span-1">
                    <div className="h-full border rounded flex flex-col bg-gray-50">
                      <div className="text-center p-1 text-base font-bold">Week {currentWeek}</div>
                      <div className="flex-1 flex flex-col items-center justify-center text-xs">
                        <div className={`font-medium financial-value ${summary.netPnl >= 0 ? 'text-green-500' : 'text-rose-500'} ${hideValuesPrivacy ? 'blur-financial' : ''}`}>
                          ${summary.netPnl.toFixed(1)}
                        </div>
                        <div className={`text-gray-600 financial-value ${hideValuesPrivacy ? 'blur-financial' : ''}`}>
                          {summary.winRate.toFixed(1)}%
                        </div>
                        <div className={`text-gray-500 financial-value ${hideValuesPrivacy ? 'blur-financial' : ''}`}>
                          {summary.trades} trades
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              
              return cells;
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}