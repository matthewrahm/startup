import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { fetchCoinMarketChart } from '../services/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PriceChart = ({ coinId }) => {
  const [chartData, setChartData] = useState(null);
  const [timeRange, setTimeRange] = useState(7); // Default to 7 days
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        console.log(`PriceChart: Fetching chart data for ${coinId} over ${timeRange} days`);
        const data = await fetchCoinMarketChart(coinId, timeRange);
        console.log(`PriceChart: Received ${data.prices.length} data points for ${coinId}`);
        setChartData(data);
        setError(null);
      } catch (err) {
        console.error(`Error fetching chart data for ${coinId}:`, err);
        setError(`Failed to load chart data for ${coinId}`);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [coinId, timeRange]);

  const handleTimeRangeChange = (days) => {
    setTimeRange(days);
  };

  // Format date based on time range
  const formatDate = (date) => {
    if (timeRange <= 1) {
      // For 1 day, show hours
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange <= 30) {
      // For 7-30 days, show day and month
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      // For longer periods, show month and year
      return date.toLocaleDateString([], { month: 'short', year: 'numeric' });
    }
  };

  // Prepare chart options and data
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
          },
          title: function(context) {
            return formatDate(new Date(context[0].label));
          }
        },
        backgroundColor: 'rgba(26, 26, 26, 0.9)',
        titleColor: '#E0E0E0',
        bodyColor: '#E0E0E0',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
          color: 'rgba(224, 224, 224, 0.6)',
          callback: function(value, index, values) {
            const date = new Date(this.getLabelForValue(value));
            return formatDate(date);
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(224, 224, 224, 0.6)',
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 5,
      },
      line: {
        tension: 0.4,
      }
    }
  };

  // Prepare chart data
  const data = chartData ? {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Price',
        data: chartData.prices,
        borderColor: '#14F195',
        backgroundColor: 'rgba(20, 241, 149, 0.1)',
        fill: true,
        borderWidth: 2,
        pointBackgroundColor: '#14F195',
        pointBorderColor: '#14F195',
        pointHoverBackgroundColor: '#14F195',
        pointHoverBorderColor: '#FFFFFF',
      }
    ]
  } : null;

  return (
    <div className="price-chart">
      <div className="time-range-selector">
        <button 
          className={`time-range-btn ${timeRange === 1 ? 'active' : ''}`} 
          onClick={() => handleTimeRangeChange(1)}
        >
          24h
        </button>
        <button 
          className={`time-range-btn ${timeRange === 7 ? 'active' : ''}`} 
          onClick={() => handleTimeRangeChange(7)}
        >
          7d
        </button>
        <button 
          className={`time-range-btn ${timeRange === 30 ? 'active' : ''}`} 
          onClick={() => handleTimeRangeChange(30)}
        >
          30d
        </button>
        <button 
          className={`time-range-btn ${timeRange === 90 ? 'active' : ''}`} 
          onClick={() => handleTimeRangeChange(90)}
        >
          90d
        </button>
      </div>
      
      <div className="chart-container">
        {loading ? (
          <div className="chart-loading">Loading chart data...</div>
        ) : error ? (
          <div className="chart-error">{error}</div>
        ) : chartData ? (
          <Line options={options} data={data} height={300} />
        ) : (
          <div className="chart-no-data">No chart data available</div>
        )}
      </div>
    </div>
  );
};

export default PriceChart;