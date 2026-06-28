import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users, Clock, DollarSign } from 'lucide-react';
import { useAdminDashboard } from '../../../../features/admin/dashboard/hooks';

const salesData = {
  Week: [
    { label: 'Mon', value: 4200 },
    { label: 'Tue', value: 3800 },
    { label: 'Wed', value: 5200 },
    { label: 'Thu', value: 4900 },
    { label: 'Fri', value: 6100 },
    { label: 'Sat', value: 5400 },
    { label: 'Sun', value: 4800 },
  ],
  Month: [
    { label: 'Week 1', value: 28000 },
    { label: 'Week 2', value: 32000 },
    { label: 'Week 3', value: 29500 },
    { label: 'Week 4', value: 35000 },
  ],
  Year: [
    { label: 'Jan', value: 42000 },
    { label: 'Feb', value: 36000 },
    { label: 'Mar', value: 30000 },
    { label: 'Apr', value: 33000 },
    { label: 'May', value: 28000 },
    { label: 'Jun', value: 21500 },
    { label: 'Jul', value: 26000 },
    { label: 'Aug', value: 30000 },
    { label: 'Sep', value: 27000 },
    { label: 'Oct', value: 29000 },
    { label: 'Nov', value: 25000 },
    { label: 'Dec', value: 28000 },
  ],
  'Last Year': [
    { label: 'Jan', value: 35000 },
    { label: 'Feb', value: 30000 },
    { label: 'Mar', value: 25000 },
    { label: 'Apr', value: 28000 },
    { label: 'May', value: 22000 },
    { label: 'Jun', value: 18000 },
    { label: 'Jul', value: 21000 },
    { label: 'Aug', value: 25000 },
    { label: 'Sep', value: 23000 },
    { label: 'Oct', value: 24000 },
    { label: 'Nov', value: 20000 },
    { label: 'Dec', value: 23000 },
  ],
};

const formatYAxis = (value) => {
  if (value >= 1000) return `${value / 1000}k`;
  return value === 0 ? '0' : `${value}`;
};

const CustomTooltip = ({ active, payload, label, period }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-[#22c55e] px-4 py-2 shadow-lg">
        <p className="text-sm font-semibold text-white">{`${label} · ${period}`}</p>
        <p className="text-base font-bold text-white">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ icon, iconBg, label, value }) => {
  const IconComponent = icon;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`rounded-sm p-2 ${iconBg}`}>
            {React.createElement(IconComponent, {
              size: 20,
              className: 'text-[#22c55e]',
            })}
          </div>
          <p className="text-lg text-gray-500">{label}</p>
        </div>
      </div>
      <div>
        <p className="text-4xl font-black text-gray-900 md:text-5xl">{value}</p>
      </div>
    </div>
  );
};

const periodOptions = [
  { label: 'Week', value: 'Week' },
  { label: 'Month', value: 'Month' },
  { label: 'Year', value: 'Year' },
  { label: 'Last Year', value: 'Last Year' },
];

const periodToRangeMap = {
  Week: 'week',
  Month: 'month',
  Year: 'year',
  'Last Year': 'last-year',
};

const extractSalesItems = (salesPayload) => {
  const responseData = salesPayload?.data ?? salesPayload;

  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.items)) return responseData.items;
  if (Array.isArray(responseData?.counts)) return responseData.counts;
  if (Array.isArray(responseData?.data)) return responseData.data;

  return [];
};

const mapSalesItemsToChart = (items) => {
  return items.map((item, index) => {
    const label =
      item?.label ?? item?.name ?? item?.month ?? item?.week ?? item?.date ?? `Item ${index + 1}`;

    const rawValue =
      item?.value ?? item?.count ?? item?.totalSales ?? item?.sales ?? item?.amount ?? 0;
    const value = Number(rawValue);

    return {
      label,
      value: Number.isFinite(value) ? value : 0,
    };
  });
};

const HomeView = () => {
  const [period, setPeriod] = useState('Week');
  const selectedRange = periodToRangeMap[period] || 'month';
  const { stats, loading, error, salesCount, salesLoading, salesError } =
    useAdminDashboard(selectedRange);
  const apiSalesChartData = mapSalesItemsToChart(extractSalesItems(salesCount));
  const chartData = apiSalesChartData.length > 0 ? apiSalesChartData : salesData[period];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
          Welcome to Your Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create events, manage training plans, and track your participants—all in one place.
        </p>
      </div>

      {/* Stat Cards */}
      {(error || salesError) && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error || salesError}
        </div>
      )}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Users}
          iconBg="bg-green-50"
          label="Total Events"
          value={loading ? '...' : (stats?.data?.totalEvents ?? '—')}
        />
        <StatCard
          icon={DollarSign}
          iconBg="bg-green-50"
          label="Total Earnings"
          value={loading ? '...' : (stats?.data?.totalEarnings ?? '—')}
        />
        <StatCard
          icon={Clock}
          iconBg="bg-green-50"
          label="Total Organizer"
          value={loading ? '...' : (stats?.data?.totalOrganizers ?? '—')}
        />
      </div>

      {/* Sales Performance Chart */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900">Sales Performance</h2>
          <div className="relative">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pr-8 pl-3 text-sm text-gray-700 focus:ring-2 focus:ring-green-300 focus:outline-none"
            >
              {periodOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-gray-400">
              ▾
            </span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={260} className="sm:h-80!">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
            />
            <YAxis
              tickFormatter={formatYAxis}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              domain={[0, 'dataMax + 5000']}
            />
            <Tooltip
              content={(props) => <CustomTooltip {...props} period={period} />}
              cursor={{ stroke: '#d1d5db', strokeDasharray: '4 4' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#22c55e"
              strokeWidth={2.5}
              fill="url(#salesGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
        {salesLoading && <p className="mt-3 text-xs text-gray-400">Updating chart data...</p>}
      </div>
    </div>
  );
};

export default HomeView;
