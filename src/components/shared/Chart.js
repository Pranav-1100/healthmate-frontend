import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Chart = ({
  type = 'line',
  data,
  xKey,
  yKey,
  height = 300,
  color = '#0ea5e9',
  showGrid = true,
}) => {
  const ChartComponent = type === 'line' ? LineChart : BarChart;
  const DataComponent = type === 'line' ? Line : Bar;

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ChartComponent data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.375rem',
            }}
          />
          <DataComponent
            type="monotone"
            dataKey={yKey}
            stroke={type === 'line' ? color : undefined}
            fill={type === 'bar' ? color : undefined}
            strokeWidth={type === 'line' ? 2 : undefined}
          />
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;