import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import html2canvas from 'html2canvas';

// Enum for impact levels
enum ImpactLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Type for calendar event
interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  impact: ImpactLevel;
  currency: string;
  forecast?: string;
  previous?: string;
}

const ImpactColors = {
  [ImpactLevel.LOW]: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800"
  },
  [ImpactLevel.MEDIUM]: {
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-600 dark:text-amber-400", 
    border: "border-amber-200 dark:border-amber-800"
  },
  [ImpactLevel.HIGH]: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-200 dark:border-red-800"
  }
};

interface CalendarViewProps {
  className?: string;
}

const CalendarView: React.FC<CalendarViewProps> = ({ className = "" }) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilters, setActiveFilters] = useState<ImpactLevel[]>([
    ImpactLevel.LOW, ImpactLevel.MEDIUM, ImpactLevel.HIGH
  ]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Fetch calendar events from forexfactory
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // In a real implementation, you would fetch from forexfactory.com/calendar#upnext
        // This is a mock implementation
        const mockEvents: CalendarEvent[] = [
          {
            id: '1',
            title: 'Non-Farm Payrolls',
            date: '2025-08-10',
            time: '12:30',
            impact: ImpactLevel.HIGH,
            currency: 'USD',
            forecast: '175K',
            previous: '187K'
          },
          {
            id: '2',
            title: 'Unemployment Rate',
            date: '2025-08-10',
            time: '12:30',
            impact: ImpactLevel.MEDIUM,
            currency: 'USD',
            forecast: '3.9%',
            previous: '3.8%'
          },
          {
            id: '3',
            title: 'Retail Sales m/m',
            date: '2025-08-11',
            time: '12:30',
            impact: ImpactLevel.LOW,
            currency: 'USD',
            forecast: '0.3%',
            previous: '0.4%'
          },
        ];
        
        setEvents(mockEvents);
      } catch (error) {
        console.error('Failed to fetch calendar events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [currentDate]); // Refetch when current date changes
  
  const toggleFilter = (impact: ImpactLevel) => {
    setActiveFilters(prev => {
      if (prev.includes(impact)) {
        return prev.filter(i => i !== impact);
      } else {
        return [...prev, impact];
      }
    });
  };
  
  const filteredEvents = events.filter(event => activeFilters.includes(event.impact));
  
  const handlePreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDate(prevDay);
  };
  
  const handleNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
  };
  
  const handleCapture = async () => {
    if (!calendarRef.current) return;
    
    try {
      const canvas = await html2canvas(calendarRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: getComputedStyle(document.body).backgroundColor || '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `forex-calendar-${currentDate.toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error capturing calendar:', error);
    }
  };
  
  return (
    <Card className={`h-full ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Forex Calendar
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviousDay}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
              {currentDate.toLocaleDateString('en-US', {
                weekday: 'short', 
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextDay}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCapture}
            className="h-8 w-8"
            title="Save Calendar Snapshot"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Impact filter chips */}
        <div className="flex gap-2 mt-2">
          <Badge
            variant={activeFilters.includes(ImpactLevel.LOW) ? "default" : "outline"}
            className={`cursor-pointer ${activeFilters.includes(ImpactLevel.LOW) ? ImpactColors[ImpactLevel.LOW].bg : ""} ${ImpactColors[ImpactLevel.LOW].text} ${ImpactColors[ImpactLevel.LOW].border}`}
            onClick={() => toggleFilter(ImpactLevel.LOW)}
          >
            Low
          </Badge>
          <Badge
            variant={activeFilters.includes(ImpactLevel.MEDIUM) ? "default" : "outline"}
            className={`cursor-pointer ${activeFilters.includes(ImpactLevel.MEDIUM) ? ImpactColors[ImpactLevel.MEDIUM].bg : ""} ${ImpactColors[ImpactLevel.MEDIUM].text} ${ImpactColors[ImpactLevel.MEDIUM].border}`}
            onClick={() => toggleFilter(ImpactLevel.MEDIUM)}
          >
            Medium
          </Badge>
          <Badge
            variant={activeFilters.includes(ImpactLevel.HIGH) ? "default" : "outline"}
            className={`cursor-pointer ${activeFilters.includes(ImpactLevel.HIGH) ? ImpactColors[ImpactLevel.HIGH].bg : ""} ${ImpactColors[ImpactLevel.HIGH].text} ${ImpactColors[ImpactLevel.HIGH].border}`}
            onClick={() => toggleFilter(ImpactLevel.HIGH)}
          >
            High
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent ref={calendarRef} className="calendar-container">
        {loading ? (
          <div className="flex flex-col space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex flex-col space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div id="calendar-replace-target">
            <img 
              src="/assets/screenshots/Screenshot 2025-08-10 140308.jpg"
              alt="Forex Calendar"
              className="w-full h-auto rounded-md"
            />
            
            <div className="mt-4 space-y-4">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className={`p-3 rounded-md border ${ImpactColors[event.impact].border} ${ImpactColors[event.impact].bg}`}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{event.title}</span>
                    <Badge variant="outline" className={ImpactColors[event.impact].text}>
                      {event.currency}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {event.time} - {event.date}
                  </div>
                  {(event.forecast || event.previous) && (
                    <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                      {event.forecast && (
                        <div>
                          <span className="text-muted-foreground">Forecast:</span>{" "}
                          <span>{event.forecast}</span>
                        </div>
                      )}
                      {event.previous && (
                        <div>
                          <span className="text-muted-foreground">Previous:</span>{" "}
                          <span>{event.previous}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarView;