import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { RootState } from '../redux/Store';

const data = [
  { name: 'Category 1', value: 400 },
  { name: 'Category 2', value: 300 },
  { name: 'Category 3', value: 300 },
  { name: 'Category 4', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const MyPieChart: React.FC = () => {
  const products = useSelector((state: RootState) => state.products.products);
  const categoryCounts = products.reduce(
    (acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = Object.keys(categoryCounts).map((category) => ({
    name: category,
    value: categoryCounts[category],
  }));
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx="20%"
        cy="30%"
        labelLine={false}
        label={({ name, value }) => `${name}: ${value}`}
        outerRadius={50}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${entry.name}`}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default MyPieChart;
