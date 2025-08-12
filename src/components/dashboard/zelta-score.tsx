import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"

interface ZeltaScoreProps {
  score?: number;
  hideValues?: boolean;
}

export function ZeltaScore({ score = 33, hideValues = false }: ZeltaScoreProps) {
  // Sample data for radar chart
  const radarData = [
    { subject: "Win %", value: 0.6 },
    { subject: "Consistency", value: 0.4 },
    { subject: "Profit factor", value: 0.75 },
    { subject: "Avg win/loss", value: 0.65 },
    { subject: "Max drawdown", value: 0.3 },
    { subject: "Recovery factor", value: 0.5 },
  ];

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart cx="50%" cy="50%" outerRadius={80} data={radarData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
          <PolarRadiusAxis domain={[0, 1]} tick={false} axisLine={false} />
          <Radar
            name="Performance"
            dataKey="value"
            stroke="#818cf8"
            fill="#818cf8"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-4">
        <div className="text-sm font-medium">Your Zlatan Score</div>
        <div className="flex items-center">
          <div className="text-3xl font-bold mr-2">{hideValues ? "**" : score}</div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${score}%` }}></div>
          </div>
          <div className="text-xs text-gray-500 ml-2">100</div>
        </div>
      </div>
    </div>
  );
}