import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { WeeklyStats as WeeklyStatsType } from "@/services/stats";

interface WeeklyStatsProps {
  stats: WeeklyStatsType | null;
  loading?: boolean;
}

export const WeeklyStats: React.FC<WeeklyStatsProps> = ({ stats, loading = false }) => {
  // Style for breakeven week
  const cardStyle = useMemo(() => {
    if (loading) return {};
    if (!stats) return {};
    
    return stats.isBreakeven
      ? { borderColor: "#3b82f6", borderWidth: "2px" } // Blue style for breakeven days
      : {};
  }, [stats, loading]);

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">WEEK</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-muted rounded w-1/4"></div>
              <div className="h-6 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">WEEK</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full" style={cardStyle}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">WEEK</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium">{stats.displayWeek}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1">
              <Trophy className={`h-4 w-4 ${stats.winRate >= 50 ? "text-green-500" : "text-muted"}`} />
              <span className="font-semibold">{stats.winRate}%</span>
              <span className="text-muted-foreground text-sm">Win Rate</span>
            </div>
            <Badge variant={stats.isBreakeven ? "outline" : "secondary"} className="ml-auto">
              {stats.totalTrades} Trade{stats.totalTrades !== 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyStats;