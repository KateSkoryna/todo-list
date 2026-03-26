import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Container from '../elements/Container';
import Layout from '../elements/Layout';
import { useTodoListsQuery } from '../../fetchers/api';
import {
  Period,
  CHART_COLORS,
  filterByPeriod,
  computeTimeSeries,
  computeWeekdayData,
  computeStatusData,
  computeCategoryData,
  getDaysTracked,
} from './statsUtils';

const PERIODS: { label: string; value: Period }[] = [
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

function PeriodSelector({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  const activeIndex = PERIODS.findIndex((p) => p.value === value);

  return (
    <div className="relative flex bg-white border border-secondary-bg rounded-lg p-1">
      {/* sliding pill */}
      <span
        className="absolute top-1 bottom-1 rounded-md bg-triadic-blue transition-transform duration-300 ease-in-out"
        style={{
          width: `calc((100% - 8px) / ${PERIODS.length})`,
          transform: `translateX(calc(${activeIndex} * 100%))`,
        }}
      />
      {PERIODS.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`relative z-10 w-16 py-1.5 rounded-md text-sm font-medium text-center transition-colors duration-300 ${
            value === p.value ? 'text-white' : 'text-dark-bg'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <span
        className="text-4xl font-bold leading-none"
        style={{ color: color || '#435058' }}
      >
        {value}
      </span>
      <span className="text-xs text-secondary-dark-bg mt-1 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

const cardClass =
  'bg-white rounded-2xl border border-secondary-bg p-5 shadow-sm';
const chartCardClass =
  'bg-white rounded-2xl border border-secondary-bg pt-5 px-5 pb-5 shadow-sm';

export default function StatisticsPage() {
  const [period, setPeriod] = useState<Period>('month');
  const { data: todoLists = [], isLoading } = useTodoListsQuery();

  const allTodos = useMemo(
    () => todoLists.flatMap((l) => l.todos),
    [todoLists]
  );
  const filteredTodos = useMemo(
    () => filterByPeriod(allTodos, period),
    [allTodos, period]
  );

  const timeSeries = useMemo(
    () => computeTimeSeries(allTodos, period),
    [allTodos, period]
  );
  const weekdayData = useMemo(
    () => computeWeekdayData(filteredTodos),
    [filteredTodos]
  );
  const statusData = useMemo(
    () => computeStatusData(filteredTodos),
    [filteredTodos]
  );
  const categoryData = useMemo(
    () => computeCategoryData(todoLists),
    [todoLists]
  );
  const daysTracked = useMemo(() => getDaysTracked(todoLists), [todoLists]);

  const totalCount = allTodos.length;
  const successfulCount = filteredTodos.filter(
    (t) => t.status === 'successful'
  ).length;
  const failedCount = filteredTodos.filter((t) => t.status === 'failed').length;
  const pendingCount = filteredTodos.filter(
    (t) => t.status === 'pending'
  ).length;
  const filteredTotal = filteredTodos.length;
  const completionRate =
    filteredTotal > 0 ? Math.round((successfulCount / filteredTotal) * 100) : 0;

  if (isLoading) {
    return (
      <Layout>
        <Container>
          <p className="text-dark-bg">Loading statistics…</p>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-dark-bg">Statistics</h2>
          <PeriodSelector value={period} onChange={setPeriod} />
        </div>

        {/* Row 1: Time series + Pie */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Area chart – 2/3 width */}
          <div className={`${chartCardClass} lg:col-span-2`}>
            <p className="text-sm font-semibold text-dark-bg mb-1">
              Number of Todos
            </p>
            <p className="text-xs text-secondary-dark-bg mb-4">
              Total / Done / Failed
            </p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={timeSeries}
                margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS.total}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.total}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="gradDone" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS.successful}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.successful}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="gradFailed" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS.failed}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS.failed}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.grid}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#848C8E' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#848C8E' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #c6c6c6',
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke={CHART_COLORS.total}
                  fill="url(#gradTotal)"
                  strokeWidth={2}
                  name="Total"
                />
                <Area
                  type="monotone"
                  dataKey="successful"
                  stroke={CHART_COLORS.successful}
                  fill="url(#gradDone)"
                  strokeWidth={2}
                  name="Done"
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  stroke={CHART_COLORS.failed}
                  fill="url(#gradFailed)"
                  strokeWidth={2}
                  name="Failed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Pie + summary numbers */}
          <div className={`${cardClass} flex flex-col`}>
            <p className="text-sm font-semibold text-dark-bg mb-1">
              Status Breakdown
            </p>
            <p className="text-xs text-secondary-dark-bg mb-2">
              {completionRate}% completion rate
            </p>
            <div className="flex-1 flex items-center justify-center">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid #c6c6c6',
                        fontSize: 12,
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 12, paddingTop: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-secondary-dark-bg text-sm">No data</p>
              )}
            </div>
            <div className="grid grid-cols-3 divide-x divide-secondary-bg border-t border-secondary-bg mt-2">
              <StatCard
                label="Done"
                value={successfulCount}
                color={CHART_COLORS.successful}
              />
              <StatCard
                label="Pending"
                value={pendingCount}
                color={CHART_COLORS.pending}
              />
              <StatCard
                label="Failed"
                value={failedCount}
                color={CHART_COLORS.failed}
              />
            </div>
          </div>
        </div>

        {/* Row 2: Weekday bar + Summary text + Category */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Bar chart per weekday */}
          <div className={chartCardClass}>
            <p className="text-sm font-semibold text-dark-bg mb-1">
              Todos per Weekday
            </p>
            <p className="text-xs text-secondary-dark-bg mb-4">Total / Done</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={weekdayData}
                margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
                barCategoryGap="25%"
                barGap={2}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_COLORS.grid}
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: '#848C8E' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#848C8E' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #c6c6c6',
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="total"
                  fill={CHART_COLORS.total}
                  radius={[3, 3, 0, 0]}
                  name="Total"
                />
                <Bar
                  dataKey="successful"
                  fill={CHART_COLORS.successful}
                  radius={[3, 3, 0, 0]}
                  name="Done"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Summary text card */}
          <div
            className={`${cardClass} flex flex-col items-center justify-center bg-dark-bg text-accent`}
          >
            <p className="text-xs uppercase tracking-widest text-secondary-dark-bg mb-3">
              Todo List Stats
            </p>
            <p
              className="text-6xl font-black leading-none"
              style={{ color: CHART_COLORS.pending }}
            >
              {totalCount}
            </p>
            <p className="text-sm font-semibold text-secondary-bg mt-1 uppercase tracking-wider">
              Total Todos
            </p>
            <div className="border-t border-secondary-dark-bg w-16 my-4" />
            <p
              className="text-5xl font-black leading-none"
              style={{ color: CHART_COLORS.successful }}
            >
              {daysTracked}
            </p>
            <p className="text-sm font-semibold text-secondary-bg mt-1 uppercase tracking-wider">
              Days Tracked
            </p>
            <div className="border-t border-secondary-dark-bg w-16 my-4" />
            <p
              className="text-4xl font-black leading-none"
              style={{ color: CHART_COLORS.failed }}
            >
              {completionRate}%
            </p>
            <p className="text-sm font-semibold text-secondary-bg mt-1 uppercase tracking-wider">
              Completion
            </p>
          </div>

          {/* Horizontal bar – by category */}
          <div className={chartCardClass}>
            <p className="text-sm font-semibold text-dark-bg mb-1">
              By Category
            </p>
            <p className="text-xs text-secondary-dark-bg mb-4">Total / Done</p>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart
                  layout="vertical"
                  data={categoryData}
                  margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                  barCategoryGap="30%"
                  barGap={2}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_COLORS.grid}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: '#848C8E' }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#848C8E' }}
                    axisLine={false}
                    tickLine={false}
                    width={65}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #c6c6c6',
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill={CHART_COLORS.total}
                    radius={[0, 3, 3, 0]}
                    name="Total"
                  />
                  <Bar
                    dataKey="successful"
                    fill={CHART_COLORS.successful}
                    radius={[0, 3, 3, 0]}
                    name="Done"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-secondary-dark-bg text-sm mt-6">
                No category data yet
              </p>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
}
