import { useMemo } from "react";
import {
  useGetMonthStatsQuery,
  useGetTodayStatsQuery,
  useGetWeekStatsQuery,
  useGetYearStatsQuery,
} from "../redux/api/adminApi";



const PERIODS = [
  {
    key: "today",
    label: "Today",
    sublabel: "Last 24 hours",
    accentColor: "border-l-orange-500",
    iconBg: "bg-orange-50",
    iconText: "text-orange-600",
  },
  {
    key: "week",
    label: "This Week",
    sublabel: "Past 7 days",
    accentColor: "border-l-emerald-500",
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
  },
  {
    key: "month",
    label: "This Month",
    sublabel: "Past 30 days",
    accentColor: "border-l-violet-500",
    iconBg: "bg-violet-50",
    iconText: "text-violet-600",
  },
  {
    key: "year",
    label: "This Year",
    sublabel: "Past 12 months",
    accentColor: "border-l-amber-500",
    iconBg: "bg-amber-50",
    iconText: "text-amber-600",
  },
];



const formatCurrency = (value = 0) => {
  // Use NPR since location is Kathmandu, Nepal
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "NPR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value = 0) => {
  return Number(value || 0).toLocaleString("en-IN");
};

const getTrendIndicator = (current = 0, previous = 0) => {
  if (!previous || !current) return { direction: "neutral", percent: 0 };
  const change = ((current - previous) / previous) * 100;
  return {
    direction: change > 0 ? "up" : change < 0 ? "down" : "neutral",
    percent: Math.abs(change).toFixed(1),
  };
};

const Icon = {
  receipt: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" />
      <path d="M9 7h6M9 11h6M9 15h4" />
    </svg>
  ),
  wallet: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M17 14h2" />
    </svg>
  ),
  trending: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  trendingDown: (p) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  ),
};


const StatSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
    <div className="mb-4 flex items-start justify-between">
      <div className="space-y-2">
        <div className="h-5 w-24 rounded bg-gray-100" />
        <div className="h-3 w-32 rounded bg-gray-100" />
      </div>
      <div className="h-10 w-10 rounded-lg bg-gray-100" />
    </div>
    <div className="space-y-4">
      <div>
        <div className="mb-1 h-3 w-16 rounded bg-gray-100" />
        <div className="h-7 w-32 rounded bg-gray-100" />
      </div>
      <div>
        <div className="mb-1 h-3 w-16 rounded bg-gray-100" />
        <div className="h-7 w-40 rounded bg-gray-100" />
      </div>
    </div>
  </div>
);

const TrendBadge = ({ direction, percent }) => {
  if (direction === "neutral") return null;

  const isUp = direction === "up";
  const colors = isUp
    ? "bg-emerald-50 text-emerald-700"
    : "bg-rose-50 text-rose-700";
  const icon = isUp ? "↑" : "↓";

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${colors}`}>
      {icon}
      {percent}%
    </span>
  );
};

const StatCard = ({ period, data, loading }) => {
  const trend = getTrendIndicator(data?.revenue, data?.prevRevenue);

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-gray-200 hover:shadow-md sm:p-6 ${period.accentColor} border-l-4`}
    >
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-gray-900 sm:text-lg">{period.label}</h3>
          <p className="text-xs text-gray-500">{period.sublabel}</p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${period.iconBg} ${period.iconText}`}>
          {period.key === "today" && <Icon.receipt className="h-5 w-5" />}
          {period.key === "week" && <Icon.wallet className="h-5 w-5" />}
          {period.key === "month" && <Icon.trending className="h-5 w-5" />}
          {period.key === "year" && <Icon.trendingDown className="h-5 w-5" />}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div>
            <div className="mb-2 h-3 w-20 rounded bg-gray-100" />
            <div className="h-8 w-32 rounded bg-gray-100" />
          </div>
          <div>
            <div className="mb-2 h-3 w-20 rounded bg-gray-100" />
            <div className="h-8 w-40 rounded bg-gray-100" />
          </div>
        </div>
      ) : (
        <div className="space-y-5 border-t border-gray-100 pt-5">
          {/* Total Orders */}
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 sm:text-3xl">
                {formatNumber(data?.totalOrders ?? 0)}
              </p>
            </div>
            {data?.prevOrders && (
              <span className="text-xs text-gray-500">
                was {formatNumber(data.prevOrders)}
              </span>
            )}
          </div>

          {/* Revenue */}
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Revenue</p>
              <p className="text-2xl font-bold text-orange-600 sm:text-3xl">
                {formatCurrency(data?.revenue ?? 0)}
              </p>
            </div>
            <TrendBadge direction={trend.direction} percent={trend.percent} />
          </div>

          {/* Additional metric if available */}
          {(data?.activeOrders || data?.completedOrders) && (
            <div className="flex items-end justify-between border-t border-gray-100 pt-4">
              <div className="flex gap-4">
                {data?.activeOrders !== undefined && (
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Active</p>
                    <p className="text-lg font-semibold text-gray-700">{formatNumber(data.activeOrders)}</p>
                  </div>
                )}
                {data?.completedOrders !== undefined && (
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-400">Completed</p>
                    <p className="text-lg font-semibold text-emerald-600">{formatNumber(data.completedOrders)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hover accent */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-gray-50/0 to-gray-50/0 transition group-hover:from-gray-50/40 group-hover:to-gray-50/20" />
    </div>
  );
};


const DashboardStats = () => {
  const { data: todayStats, isLoading: tLoading } = useGetTodayStatsQuery();
  const { data: weekStats, isLoading: wLoading } = useGetWeekStatsQuery();
  const { data: monthStats, isLoading: mLoading } = useGetMonthStatsQuery();
  const { data: yearStats, isLoading: yLoading } = useGetYearStatsQuery();

  const statsData = useMemo(
    () => [
      {
        period: PERIODS[0],
        data: todayStats,
        loading: tLoading,
      },
      {
        period: PERIODS[1],
        data: weekStats,
        loading: wLoading,
      },
      {
        period: PERIODS[2],
        data: monthStats,
        loading: mLoading,
      },
      {
        period: PERIODS[3],
        data: yearStats,
        loading: yLoading,
      },
    ],
    [todayStats, tLoading, weekStats, wLoading, monthStats, mLoading, yearStats, yLoading]
  );

  const allLoading = [tLoading, wLoading, mLoading, yLoading].every((l) => l);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Performance Overview</h2>
        <p className="mt-1 text-sm text-gray-500">
          Track your sales performance across different time periods at a glance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid auto-rows-max gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((item) => (
          <StatCard
            key={item.period.key}
            period={item.period}
            data={item.data}
            loading={item.loading}
          />
        ))}
      </div>

      {/* Empty state during loading */}
      {allLoading && (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 animate-spin rounded-full border-2 border-gray-200 border-t-gray-900" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-600">Fetching your latest stats…</p>
          <p className="mt-1 text-xs text-gray-500">This usually takes a moment</p>
        </div>
      )}
    </div>
  );
};

export default DashboardStats;