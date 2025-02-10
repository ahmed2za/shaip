import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Default chart options shared between all chart types
const baseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

// Line chart specific options
export const defaultLineChartOptions: ChartOptions<'line'> = {
  ...baseChartOptions,
  scales: {
    x: {
      type: 'category' as const,
      display: true,
      grid: {
        display: false,
      },
    },
  },
};

// Bar chart specific options
export const defaultBarChartOptions: ChartOptions<'bar'> = {
  ...baseChartOptions,
  plugins: {
    ...baseChartOptions.plugins,
    title: {
      display: true,
      text: '',
    },
  },
  scales: {
    x: {
      type: 'category' as const,
      display: true,
      grid: {
        display: false,
      },
    },
    y: {
      type: 'linear' as const,
      display: true,
      beginAtZero: true,
    },
  },
};

// Re-export Chart.js types
export type { ChartOptions, ChartData };
