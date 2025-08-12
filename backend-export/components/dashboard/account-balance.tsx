import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface AccountBalanceProps {
  hideValues?: boolean;
}

// Sample data for account balance
const accountBalanceData = [
  { date: "08/01/25", balance: 10000, deposits: 10000 },
  { date: "08/02/25", balance: 9800, deposits: 10000 },
  { date: "08/03/25", balance: 9500, deposits: 10000 },
  { date: "08/04/25", balance: 9900, deposits: 10000 },
  { date: "08/05/25", balance: 10300, deposits: 10000 },
  { date: "08/06/25", balance: 9800, deposits: 10000 },
  { date: "08/07/25", balance: 9600, deposits: 10000 },
  { date: "08/08/25", balance: 9500, deposits: 10000 },
];

export function AccountBalance({ hideValues = false }: AccountBalanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Account balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">Account Balance</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Deposits / Withdrawals</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={accountBalanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              domain={[8000, 11000]} 
              tickFormatter={(value) => hideValues ? "***" : `$${value.toLocaleString()}`}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [
                hideValues ? "***" : `$${value.toLocaleString()}`, 
                name === "balance" ? "Balance" : "Deposits"
              ]}
            />
            <Line 
              type="monotone" 
              dataKey="balance" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="deposits" 
              stroke="#ef4444" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}