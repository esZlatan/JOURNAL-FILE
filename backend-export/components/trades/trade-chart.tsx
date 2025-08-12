import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

interface TradeChartProps {
  ticker: string
  direction: 'long' | 'short'
}

export function TradeChart({ ticker, direction }: TradeChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  
  useEffect(() => {
    if (!chartRef.current) return
    
    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }
    
    // Generate mock data based on direction
    const isLong = direction === 'long'
    const labels = Array.from({ length: 20 }, (_, i) => i.toString())
    const startPrice = Math.random() * 100 + 100
    
    let currentPrice = startPrice
    const data = labels.map((_, i) => {
      // For long trades, we want a general uptrend, for short trades a downtrend
      const trend = isLong ? 0.1 : -0.1
      const volatility = 0.5
      
      // Random walk with a bias towards the trend
      const change = (Math.random() - 0.5) * volatility + trend
      currentPrice += change
      return currentPrice
    })
    
    // Highlight entry and exit points
    const entryPoint = Math.floor(Math.random() * 5) + 2 // Between 2-7
    const exitPoint = Math.floor(Math.random() * 5) + 12 // Between 12-17
    
    const entryPrice = data[entryPoint]
    const exitPrice = data[exitPoint]
    
    // Create points dataset for entry and exit
    const pointsData = labels.map((_, i) => {
      if (i === entryPoint) return entryPrice
      if (i === exitPoint) return exitPrice
      return null
    })
    
    // Create chart
    const ctx = chartRef.current.getContext('2d')
    
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: ticker,
              data,
              borderColor: '#3498db',
              borderWidth: 2,
              tension: 0.2,
              pointRadius: 0,
              fill: false,
            },
            {
              label: 'Entry/Exit',
              data: pointsData,
              borderColor: 'transparent',
              pointBackgroundColor: (context) => {
                const index = context.dataIndex
                if (index === entryPoint) return '#2ecc71' // Green for entry
                if (index === exitPoint) return '#e74c3c' // Red for exit
                return 'transparent'
              },
              pointRadius: (context) => {
                const index = context.dataIndex
                if (index === entryPoint || index === exitPoint) return 8
                return 0
              },
              pointHoverRadius: (context) => {
                const index = context.dataIndex
                if (index === entryPoint || index === exitPoint) return 10
                return 0
              },
              pointStyle: 'circle',
              pointBorderWidth: 2,
              pointBorderColor: '#ffffff',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const index = context.dataIndex
                  if (index === entryPoint) {
                    return `Entry: $${entryPrice.toFixed(2)}`
                  }
                  if (index === exitPoint) {
                    return `Exit: $${exitPrice.toFixed(2)}`
                  }
                  return `${ticker}: $${context.parsed.y.toFixed(2)}`
                }
              }
            }
          },
          scales: {
            y: {
              display: true,
              title: {
                display: true,
                text: 'Price'
              }
            },
            x: {
              display: true,
              title: {
                display: true,
                text: 'Time'
              }
            }
          }
        }
      })
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [ticker, direction])
  
  return (
    <div className="h-full w-full">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}