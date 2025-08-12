import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, DollarSign, TrendingUp, ChevronDown, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  valueClass?: string;
  hideValues?: boolean;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  trend = 'neutral',
  valueClass = '',
  hideValues = false,
}: StatsCardProps) {
  let trendIcon = null;
  
  if (trend === 'up') {
    trendIcon = <ArrowUp className="h-4 w-4 text-emerald-500" />;
  } else if (trend === 'down') {
    trendIcon = <ArrowDown className="h-4 w-4 text-rose-500" />;
  } else if (icon) {
    trendIcon = icon;
  } else {
    trendIcon = <DollarSign className="h-4 w-4 text-muted-foreground" />;
  }

  return (
    <Card>
      <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium">{title}</h3>
        {trendIcon}
      </div>
      <div className="p-6 pt-0">
        <div className={`text-2xl font-bold ${valueClass}`}>
          {hideValues ? "***" : value}
        </div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </Card>
  );
}

interface WidgetControlsProps {
  lastSyncDate: string;
  onSync: () => void;
  onAddWidget: () => void;
}

export function WidgetControls({ lastSyncDate, onSync, onAddWidget }: WidgetControlsProps) {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="text-sm text-gray-500">
        Last sync: {lastSyncDate}
      </div>
      <Button size="sm" variant="outline" onClick={onSync} className="ml-2">
        <RefreshCcw className="h-4 w-4 mr-1" /> Sync
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            Add widget <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Add widgets</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex items-center">
              ✓  Winning Streak
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center">
              {" "} Losing Streak
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center">
              ✓  Profit Factor
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center">
              ✓  Day Win %
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center">
              {" "} Average Drawdown
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center">
              ✓  Maximum Drawdown
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center">
              ✓  Account P&L
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex items-center">
              ✓  Trade Expectancy
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

interface AdditionalStatsCardsProps {
  hideValues?: boolean;
}

export function AdditionalStatsCards({ hideValues = false }: AdditionalStatsCardsProps) {
  return (
    <>
      <StatsCard
        title="Winning Streak"
        value="3 trades"
        trend="up"
        description="Current streak"
        hideValues={hideValues}
      />
      <StatsCard
        title="Profit Factor"
        value="1.62"
        trend="up"
        description="Gross profit / Gross loss"
        hideValues={hideValues}
      />
      <StatsCard
        title="Day Win %"
        value="60%"
        icon={<TrendingUp className="h-4 w-4 text-emerald-500" />}
        description="3/5 winning days"
        hideValues={hideValues}
      />
      <StatsCard
        title="Max Drawdown"
        value="-5.2%"
        trend="down"
        valueClass="text-rose-500"
        description="$-725.00 peak to trough"
        hideValues={hideValues}
      />
    </>
  );
}