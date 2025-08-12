import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Camera, 
  Download,
  ChevronDown 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SnapshotData = {
  date: string;
  totalPnL: number;
  winRate: number;
  tradingDays: number;
  accountBalance: number;
  totalTrades: number;
  comments: string;
};

interface SnapshotWidgetProps {
  hideValues?: boolean;
}

export function SnapshotWidget({ hideValues = false }: SnapshotWidgetProps) {
  const [snapshots, setSnapshots] = useState<SnapshotData[]>([
    {
      date: '2025-08-01',
      totalPnL: 3214.50,
      winRate: 62.5,
      tradingDays: 18,
      accountBalance: 14825.75,
      totalTrades: 56,
      comments: 'Monthly start. Focus on ES and YM.'
    },
    {
      date: '2025-07-01',
      totalPnL: 2680.25,
      winRate: 58.7,
      tradingDays: 21,
      accountBalance: 11611.25,
      totalTrades: 63,
      comments: 'First month trading micros. Scaling in/out worked well.'
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);

  const takeSnapshot = () => {
    // This would connect to backend API in real implementation
    const newSnapshot: SnapshotData = {
      date: new Date().toISOString().split('T')[0],
      totalPnL: 4123.75,
      winRate: 64.2,
      tradingDays: 6,
      accountBalance: 18949.50,
      totalTrades: 14,
      comments: newComment,
    };

    setSnapshots([newSnapshot, ...snapshots]);
    setNewComment('');
    setShowCommentInput(false);
  };

  const formatCurrency = (value: number) => {
    if (hideValues) return "***";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md">Account Snapshots</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            className="h-8 px-2"
            onClick={() => setShowCommentInput(true)}
          >
            <Camera className="h-4 w-4 mr-1" />
            Take Snapshot
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" /> Export Snapshots
              </DropdownMenuItem>
              <DropdownMenuItem>
                Compare Snapshots
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {showCommentInput && (
          <div className="mb-4 p-3 border rounded-md bg-muted/50">
            <div className="text-sm mb-2">Add comment for this snapshot:</div>
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 text-sm rounded-md border mb-2"
              rows={2}
              placeholder="Optional notes about current market conditions, strategies, etc."
            />
            <div className="flex justify-end space-x-2">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setShowCommentInput(false)}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={takeSnapshot}
              >
                Capture
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {snapshots.map((snapshot, index) => (
            <div 
              key={`${snapshot.date}-${index}`} 
              className="border rounded-md p-3 hover:bg-accent/5"
            >
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium">{snapshot.date}</div>
                <div className={`text-sm font-medium ${snapshot.totalPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {formatCurrency(snapshot.totalPnL)}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div>
                  <div className="text-xs text-muted-foreground">Win Rate</div>
                  <div className="text-sm">
                    {hideValues ? "***" : `${snapshot.winRate}%`}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Account</div>
                  <div className="text-sm">
                    {formatCurrency(snapshot.accountBalance)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Trades</div>
                  <div className="text-sm">
                    {hideValues ? "***" : snapshot.totalTrades}
                  </div>
                </div>
              </div>
              
              {snapshot.comments && (
                <div className="mt-2 text-xs text-muted-foreground border-t pt-2">
                  {snapshot.comments}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}