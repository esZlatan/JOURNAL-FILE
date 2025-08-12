import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ScatterChart, Scatter, ZAxis } from "recharts"
import { Button } from "@/components/ui/button"

// Sample data for performance charts
const cumulativePnLData = [
  { date: "07/15/25", pnl: 0 },
  { date: "07/20/25", pnl: -500 },
  { date: "07/25/25", pnl: -1500 },
  { date: "07/30/25", pnl: -1200 },
  { date: "08/04/25", pnl: -200 },
  { date: "08/08/25", pnl: -600 },
]

const monthlyCalendarData = [
  { day: 1, value: null },
  { day: 2, value: null },
  { day: 3, value: -297, percent: "-2.25%" },
  { day: 4, value: -446.7, percent: "-3.20%" },
  { day: 5, value: null },
  { day: 6, value: 512, percent: "3.72%" },
  { day: 7, value: -192, percent: "-1.40%" },
  { day: 8, value: -137, percent: "-1.05%" },
  { day: 9, value: null },
  { day: 10, value: null },
  { day: 11, value: null },
  { day: 12, value: null },
  { day: 13, value: null },
  { day: 14, value: null },
  { day: 15, value: null },
  { day: 16, value: null },
  { day: 17, value: null },
  { day: 18, value: null },
  { day: 19, value: null },
  { day: 20, value: null },
  { day: 21, value: null },
  { day: 22, value: null },
  { day: 23, value: null },
  { day: 24, value: null },
  { day: 25, value: null },
  { day: 26, value: null },
  { day: 27, value: null },
  { day: 28, value: null },
  { day: 29, value: null },
  { day: 30, value: null },
  { day: 31, value: null },
]

const timePerformanceData = [
  { time: "09:30", pnl: 25 },
  { time: "10:00", pnl: -45 },
  { time: "10:30", pnl: 30 },
  { time: "11:15", pnl: 80 },
  { time: "13:45", pnl: -30 },
  { time: "14:30", pnl: -60 },
  { time: "15:15", pnl: 120 },
  { time: "15:45", pnl: -15 },
]

const durationPerformanceData = [
  { duration: "2m", pnl: 25 },
  { duration: "5m", pnl: -45 },
  { duration: "7m", pnl: 30 },
  { duration: "12m", pnl: 80 },
  { duration: "15m", pnl: -30 },
  { duration: "22m", pnl: -60 },
  { duration: "25m", pnl: 120 },
  { duration: "35m", pnl: -15 },
  { duration: "45m", pnl: 50 },
  { duration: "1h", pnl: -75 },
  { duration: "1.5h", pnl: 95 },
]

const dayOfWeekData = [
  { day: "Mon", pnl: -120 },
  { day: "Tue", pnl: 245 },
  { day: "Wed", pnl: 310 },
  { day: "Thu", pnl: -75 },
  { day: "Fri", pnl: 180 },
]

interface PnLData {
  pnl: number;
}

export function CumulativePnLChart({ hideValues = false }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily net cumulative P&L</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={cumulativePnLData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} tickFormatter={(value) => hideValues ? '***' : `$${value}`} />
            <Tooltip 
              formatter={(value) => [hideValues ? '***' : `$${value}`, 'P/L']}
            />
            <Line 
              type="monotone" 
              dataKey="pnl" 
              stroke="#ff7875" 
              fill="#ff7875" 
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function TradeTimePerformance({ hideValues = false }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade time performance</CardTitle>
        <CardDescription>P/L by time of day</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" name="Time" />
            <YAxis 
              dataKey="pnl" 
              name="P/L" 
              tickFormatter={(value) => hideValues ? '***' : `$${value}`} 
            />
            <ZAxis range={[50, 50]} />
            <Tooltip 
              formatter={(value) => [hideValues ? '***' : `$${value}`, 'P/L']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Scatter 
              name="P/L by time" 
              data={timePerformanceData} 
              fill="#4ade80"
              shape={(props: any) => {
                const { cx, cy, fill } = props;
                const dataPoint = props.payload;
                const fillColor = dataPoint.pnl >= 0 ? "#4ade80" : "#f43f5e";
                
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={6} 
                    fill={fillColor} 
                  />
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function TradeDurationPerformance({ hideValues = false }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade duration performance</CardTitle>
        <CardDescription>P/L by trade duration</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="duration" name="Duration" />
            <YAxis 
              dataKey="pnl" 
              name="P/L" 
              tickFormatter={(value) => hideValues ? '***' : `$${value}`} 
            />
            <ZAxis range={[50, 50]} />
            <Tooltip 
              formatter={(value) => [hideValues ? '***' : `$${value}`, 'P/L']}
              labelFormatter={(label) => `Duration: ${label}`}
            />
            <Scatter 
              name="P/L by duration" 
              data={durationPerformanceData} 
              fill="#4ade80"
              shape={(props: any) => {
                const { cx, cy, fill } = props;
                const dataPoint = props.payload;
                const fillColor = dataPoint.pnl >= 0 ? "#4ade80" : "#f43f5e";
                
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={6} 
                    fill={fillColor} 
                  />
                );
              }}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function MonthlyCalendar({ month = "August", year = "2025", hideValues = false }) {
  // Create days of week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Define color based on value
  const getCellColor = (value: number | null) => {
    if (value === null) return "bg-transparent";
    return value >= 0 ? "bg-green-50" : "bg-red-50";
  };
  
  const getTextColor = (value: number | null) => {
    if (value === null) return "text-gray-400";
    return value >= 0 ? "text-green-500" : "text-rose-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Monthly stats: {month} {year}</span>
          <div className="flex items-center text-sm space-x-2">
            <Button variant="outline" size="sm" className="h-6 px-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
            </Button>
            <Button variant="outline" size="sm" className="h-6 px-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center font-medium text-sm py-1">
              {day}
            </div>
          ))}
          
          {/* Calendar days - this is simplified and doesn't account for actual start day */}
          {monthlyCalendarData.map((day, index) => {
            // Placeholder - In real implementation, you would calculate this properly
            const dayOffset = 2; // Start on Wednesday (0-indexed: 0=Sun, 1=Mon, 2=Tue)
            const dayPosition = (index + dayOffset) % 7;
            
            // Add empty cells for days before the 1st
            const emptyBefore = index === 0 ? 
              Array.from({ length: dayOffset }).map((_, i) => (
                <div key={`empty-before-${i}`} className="aspect-square p-1"></div>
              )) : [];
              
            return [
              ...(index === 0 ? emptyBefore : []),
              <div 
                key={`day-${day.day}`} 
                className={`aspect-square p-1 ${getCellColor(day.value)}`}
              >
                <div className="h-full border rounded flex flex-col">
                  <div className="text-xs p-1">{day.day}</div>
                  {day.value !== null && (
                    <div className={`text-center flex-1 flex items-center justify-center flex-col ${getTextColor(day.value)}`}>
                      <div className="text-xs font-semibold">{hideValues ? '***' : `$${day.value}`}</div>
                      <div className="text-xs">{hideValues ? '***' : day.percent}</div>
                    </div>
                  )}
                </div>
              </div>
            ];
          }).flat()}
        </div>
      </CardContent>
    </Card>
  )
}

export function DrawdownChart({ hideValues = false }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Drawdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={cumulativePnLData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['auto', 'auto']} tickFormatter={(value) => hideValues ? '***' : `$${value}`} />
            <Tooltip 
              formatter={(value) => [hideValues ? '***' : `$${value}`, 'Drawdown']}
            />
            <Line 
              type="monotone" 
              dataKey="pnl" 
              stroke="#ff7875" 
              fill="#ff7875" 
              strokeWidth={2}
              dot={{ strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export function DayOfWeekPerformance({ hideValues = false }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Day of Week Performance</CardTitle>
        <CardDescription>Average P/L by day of week</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dayOfWeekData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis tickFormatter={(value) => hideValues ? '***' : `$${value}`} />
            <Tooltip 
              formatter={(value) => [hideValues ? '***' : `$${value}`, 'P/L']}
            />
            <Bar 
              dataKey="pnl" 
              fill="#4ade80"
              shape={(props: any) => {
                const { x, y, width, height, fill } = props;
                const dataPoint = props.payload;
                const fillColor = dataPoint.pnl >= 0 ? "#4ade80" : "#f43f5e";
                
                return (
                  <rect 
                    x={x} 
                    y={y} 
                    width={width} 
                    height={height} 
                    fill={fillColor} 
                    rx={4}
                    ry={4}
                  />
                );
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}