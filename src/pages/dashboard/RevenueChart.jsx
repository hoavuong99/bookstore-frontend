import { Bar } from "react-chartjs-2";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import PropTypes from "prop-types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MONTHS = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
  "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];
const YEARS = Array.from({ length: 101 }, (_, index) => 2000 + index);
const pad = (value) => String(value).padStart(2, "0");
const getDateParts = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return { year, month, day };
};
const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();
const updateDatePart = (value, period, part, nextValue) => {
  const current = getDateParts(value);
  if (period === "year") return `${nextValue}-01-01`;
  if (period === "month") {
    return part === "year" ? `${nextValue}-${pad(current.month)}-01` : `${current.year}-${pad(nextValue)}-01`;
  }
  const nextYear = part === "year" ? nextValue : current.year;
  const nextMonth = part === "month" ? nextValue : current.month;
  const maxDay = getDaysInMonth(nextYear, nextMonth);
  const nextDay = Math.min(current.day, maxDay);
  return `${nextYear}-${pad(nextMonth)}-${pad(part === "day" ? nextValue : nextDay)}`;
};

const LocalizedTimePicker = ({ value, period, onChange }) => {
  const { year, month, day } = getDateParts(value);
  const selectClass = "h-11 rounded-lg border border-gray-300 bg-white px-2 text-sm shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100";
  const years = YEARS;

  if (period === "year") {
    return (
      <select value={year} onChange={(event) => onChange(updateDatePart(value, period, "year", event.target.value))} className={`${selectClass} w-full sm:w-28`}>
        {years.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    );
  }

  return (
    <div className="flex gap-1">
      {period === "day" && (
        <select value={day} onChange={(event) => onChange(updateDatePart(value, period, "day", event.target.value))} className={`${selectClass} w-16`} aria-label="Ngày">
          {Array.from({ length: getDaysInMonth(year, month) }, (_, index) => index + 1).map((item) => <option key={item} value={item}>{pad(item)}</option>)}
        </select>
      )}
      <select value={month} onChange={(event) => onChange(updateDatePart(value, period, "month", event.target.value))} className={`${selectClass} ${period === "day" ? "w-32" : "w-32"}`} aria-label="Tháng">
        {MONTHS.map((item, index) => <option key={item} value={index + 1}>{item}</option>)}
      </select>
      <select value={year} onChange={(event) => onChange(updateDatePart(value, period, "year", event.target.value))} className={`${selectClass} w-24`} aria-label="Năm">
        {years.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </div>
  );
};

LocalizedTimePicker.propTypes = {
  value: PropTypes.string.isRequired,
  period: PropTypes.oneOf(["day", "month", "year"]).isRequired,
  onChange: PropTypes.func.isRequired,
};

const RevenueChart = ({
  totalRevenue = 0,
  revenuePoints = [],
  period = "month",
  from,
  to,
  onPeriodChange,
  onRangeChange,
  onApplyFilters,
}) => {
  const formatSelectedValue = (value) => {
    if (period === "year") return value.slice(0, 4);
    if (period === "month") {
      const [year, month] = value.slice(0, 7).split("-");
      return `${month}/${year}`;
    }
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  };

  const revenueData = revenuePoints.length
    ? revenuePoints.map((point) => Number(point.revenue || 0))
    : [totalRevenue];
  const labels = revenuePoints.length
    ? revenuePoints.map((point) => point.label)
    : ["Đơn hàng hoàn tất"];
  const data = {
    labels,
    datasets: [{
      label: "Doanh thu (VND)",
      data: revenueData,
      backgroundColor: "rgba(34, 197, 94, 0.7)",
      borderColor: "rgba(34, 197, 94, 1)",
      borderWidth: 1,
      borderRadius: 5,
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Doanh thu từ đơn hàng hoàn tất" },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gradient-to-r from-green-50 to-white px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Biểu đồ doanh thu</h2>
            <p className="mt-1 text-sm text-gray-500">Doanh thu từ các đơn hàng đã giao thành công</p>
          </div>
          <div className="rounded-lg bg-green-100 px-3 py-2 text-right">
            <span className="block text-xs font-medium uppercase tracking-wide text-green-700">Tổng doanh thu trong khoảng thời gian đã chọn</span>
            <span className="block text-lg font-bold text-green-800">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalRevenue)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 px-5 py-4">
        <div className="flex flex-wrap items-end gap-4">
          <label className="w-full text-sm font-semibold text-gray-700 sm:w-auto">
            Xem theo
            <select
              value={period}
              onChange={(event) => onPeriodChange(event.target.value)}
              className="mt-1 block h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-normal shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:w-32"
            >
              <option value="day">Ngày</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </label>

          <fieldset className="w-full sm:w-auto">
            <div className="mt-1 flex flex-wrap items-end gap-2">
              <label className="flex-1 text-xs text-gray-500 sm:flex-none">
                Từ
                <div className="mt-1">
                  <LocalizedTimePicker
                    value={from}
                    period={period}
                    onChange={(nextFrom) => onRangeChange({ from: nextFrom, to: nextFrom > to ? nextFrom : to })}
                  />
                </div>
              </label>
              <span className="mb-2 text-gray-400">đến</span>
              <label className="flex-1 text-xs text-gray-500 sm:flex-none">
                Đến
                <div className="mt-1">
                  <LocalizedTimePicker
                    value={to}
                    period={period}
                    onChange={(nextTo) => onRangeChange({ from: nextTo < from ? nextTo : from, to: nextTo })}
                  />
                </div>
              </label>
            </div>
          </fieldset>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
            Bộ lọc hiện tại: <strong className="font-semibold text-gray-700">{formatSelectedValue(from)} đến {formatSelectedValue(to)}</strong>
          </div>
          <button
            type="button"
            onClick={onApplyFilters}
            className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Áp dụng bộ lọc
          </button>
        </div>
      </div>

      <div className="hidden p-5 md:block">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

RevenueChart.propTypes = {
  totalRevenue: PropTypes.number,
  revenuePoints: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    revenue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  })),
  period: PropTypes.oneOf(["day", "month", "year"]),
  from: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  onPeriodChange: PropTypes.func.isRequired,
  onRangeChange: PropTypes.func.isRequired,
  onApplyFilters: PropTypes.func.isRequired,
};

export default RevenueChart;
