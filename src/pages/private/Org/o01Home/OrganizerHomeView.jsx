import React, { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Users, Clock, UserCheck, TrendingUp } from 'lucide-react';
import {
  useOrganizerSalesCount,
  useOrganizerStats,
  useOrganizerTopEvent,
} from '../../../../features/organizer/stats/hooks';
import Skeleton from '../../../../components/common/Skeleton';

const PIE_COLORS = ['#22c55e', '#a855f7', '#ef4444', '#38bdf8', '#f97316'];

const formatYAxis = (value) => {
  if (value >= 1000) return `${value / 1000}k`;
  return value === 0 ? '0' : `${value}`;
};

// Rounds a raw step size to a "nice" number: 1, 2, 2.5, 5, or 10 x 10^n
const getNiceStep = (roughStep) => {
  const exponent = Math.floor(Math.log10(roughStep));
  const fraction = roughStep / 10 ** exponent;

  let niceFraction;
  if (fraction <= 1) niceFraction = 1;
  else if (fraction <= 2) niceFraction = 2;
  else if (fraction <= 2.5) niceFraction = 2.5;
  else if (fraction <= 5) niceFraction = 5;
  else niceFraction = 10;

  return niceFraction * 10 ** exponent;
};

// Given the max value in the dataset, returns a nice rounded max and
// evenly spaced round-number ticks (e.g. 0, 2k, 4k, 6k, 8k) instead of
// odd values like 5.17654k that depend directly on the raw data.
const getNiceYAxisConfig = (dataMax, tickCount = 5) => {
  const safeMax = dataMax > 0 ? dataMax : 1;
  const roughStep = safeMax / (tickCount - 1);
  const step = getNiceStep(roughStep);
  const niceMax = step * (tickCount - 1);
  const ticks = Array.from({ length: tickCount }, (_, i) => Math.round(i * step));
  return { max: niceMax, ticks };
};

const formatNumber = (value) => new Intl.NumberFormat('en-US').format(Number(value || 0));

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

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

const StatCard = ({ icon, iconBg, label, value, isLoading = false }) => {
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
        {isLoading ? (
          <Skeleton className="h-10 w-28 rounded-lg md:h-12 md:w-32" />
        ) : (
          <p className="text-2xl font-black text-gray-900 md:text-3xl">{value}</p>
        )}
      </div>
    </div>
  );
};

const OrganizerHomeView = () => {
  const [salesPeriod, setSalesPeriod] = useState('Week');
  const [eventPeriod, setEventPeriod] = useState('Week');
  const { stats, loading, error } = useOrganizerStats();

  const periodToRange = {
    Week: 'week',
    Month: 'month',
    Year: 'year',
    'Last Month': 'month',
  };

  const salesRange = periodToRange[salesPeriod] || 'week';
  const eventRange = periodToRange[eventPeriod] || 'week';

  const {
    salesData: salesApiData,
    loading: salesLoading,
    error: salesError,
  } = useOrganizerSalesCount(salesRange);
  const {
    topEventData: topEventApiData,
    loading: topEventLoading,
    error: topEventError,
  } = useOrganizerTopEvent(eventRange);

  const periodOptions = [
    { label: 'Week', value: 'Week' },
    { label: 'Month', value: 'Month' },
    { label: 'Year', value: 'Year' },
    { label: 'Last Month', value: 'Last Month' },
  ];

  const statCards = useMemo(
    () => [
      {
        icon: Users,
        iconBg: 'bg-green-50',
        label: 'Total Events',
        value: formatNumber(stats.totalEvents),
      },
      {
        icon: Clock,
        iconBg: 'bg-green-50',
        label: 'Pending Approval',
        value: formatNumber(stats.pendingApproval),
      },
      {
        icon: UserCheck,
        iconBg: 'bg-green-50',
        label: 'Monthly Participants',
        value: formatNumber(stats.monthlyParticipants),
      },
      {
        icon: TrendingUp,
        iconBg: 'bg-green-50',
        label: 'Total Revenue',
        value: `${formatCurrency(stats.totalRevenue)} USD`,
      },
    ],
    [stats.monthlyParticipants, stats.pendingApproval, stats.totalEvents, stats.totalRevenue]
  );

  const salesChartData = useMemo(() => salesApiData || [], [salesApiData]);
  const topEventChartData = useMemo(() => topEventApiData || [], [topEventApiData]);

  // Nice, rounded Y-axis max + ticks derived from the actual sales data
  // so the axis always shows clean values like 2k, 4k, 6k.
  const salesYAxisConfig = useMemo(() => {
    const maxValue = salesChartData.reduce((max, item) => Math.max(max, item.value || 0), 0);
    return getNiceYAxisConfig(maxValue, 5);
  }, [salesChartData]);

  // console.log("================================",topEventChartData);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
          Welcome to Your Organizer Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Create events, manage training plans, and track your participants—all in one place.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard
            key={card.label}
            icon={card.icon}
            iconBg={card.iconBg}
            label={card.label}
            value={card.value}
            isLoading={loading}
          />
        ))}
      </div>

      {error ? (
        <p className="mb-6 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          Failed to load organizer stats: {error}
        </p>
      ) : null}

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Sales Performance */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900">Sales Performance</h2>
            <div className="relative">
              <select
                value={salesPeriod}
                onChange={(e) => setSalesPeriod(e.target.value)}
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
          {salesLoading ? (
            <div className="flex h-65 flex-col gap-3 rounded-xl bg-white">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-55 w-full rounded-2xl" />
            </div>
          ) : !salesChartData.length ? (
            <div className="flex h-65 items-center justify-center text-sm text-gray-500">
              No sales data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={salesChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="orgSalesGradient" x1="0" y1="0" x2="0" y2="1">
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
                  domain={[0, salesYAxisConfig.max]}
                  ticks={salesYAxisConfig.ticks}
                />
                <Tooltip
                  content={(props) => <CustomTooltip {...props} period={salesPeriod} />}
                  cursor={{ stroke: '#d1d5db', strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#22c55e"
                  strokeWidth={2.5}
                  fill="url(#orgSalesGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {salesError ? <p className="mt-3 text-xs text-red-500">{salesError}</p> : null}
        </div>

        {/* Top Event */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900">Top Event</h2>
            <div className="relative">
              <select
                value={eventPeriod}
                onChange={(e) => setEventPeriod(e.target.value)}
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

          {topEventLoading ? (
            <div className="flex h-55 flex-col gap-3 rounded-xl bg-white">
              <Skeleton className="h-4 w-28 rounded-md" />
              <div className="flex items-center gap-6 sm:flex-row">
                <Skeleton className="h-45 w-45 rounded-full" />
                <div className="flex flex-1 flex-col gap-3">
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                </div>
              </div>
            </div>
          ) : topEventChartData.length ? (
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              {/* Donut chart */}
              <div className="shrink-0">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={topEventChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {topEventChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend (show label and value from API response) */}
              <div className="flex flex-col gap-2">
                {topEventChartData.map((entry, index) => (
                  <div
                    key={entry.label || entry.name || index}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                      />
                      <span className="text-sm text-gray-600">{entry.label ?? entry.name}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formatNumber(entry.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-55 items-center justify-center text-sm text-gray-500">
              No top event data available
            </div>
          )}

          {topEventError ? <p className="mt-3 text-xs text-red-500">{topEventError}</p> : null}
        </div>
      </div>
    </div>
  );
};

export default OrganizerHomeView;
