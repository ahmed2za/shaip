import React from 'react';
import { Bar } from 'react-chartjs-2';
import { defaultBarChartOptions, ChartOptions, ChartData } from '@/utils/chartConfig';

interface StatsChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  title?: string;
}

export const StatsChart: React.FC<StatsChartProps> = ({ data, title }) => {
  const chartData: ChartData<'bar'> = {
    labels: data.labels,
    datasets: [
      {
        label: 'الزوار',
        data: data.values,
        backgroundColor: 'rgba(45, 108, 223, 0.7)',
        borderColor: 'rgba(45, 108, 223, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    ...defaultBarChartOptions,
    plugins: {
      ...defaultBarChartOptions.plugins,
      title: {
        ...defaultBarChartOptions.plugins?.title,
        display: !!title,
        text: title || '',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default StatsChart;
