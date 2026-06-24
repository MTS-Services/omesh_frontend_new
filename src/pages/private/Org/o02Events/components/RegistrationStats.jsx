import { Ticket } from 'lucide-react';

const RegistrationStats = ({ stats }) => (
  <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
    <h3 className="mb-4 text-base font-bold text-gray-900">Registration Stats</h3>

    <div className="mb-2 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="rounded-md bg-green-50 p-1.5">
          <Ticket size={15} className="text-[#1FB356]" />
        </span>
        <span className="text-sm text-gray-600">Tickets Sold</span>
      </div>
      <span className="text-sm font-bold text-gray-900">{stats.sold}</span>
    </div>

    <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
      <div className="h-full rounded-full bg-[#22C55E]" style={{ width: stats.progressWidth }} />
    </div>

    <div className="mt-4 grid grid-cols-2 gap-2">
      <div className="rounded-xl bg-green-50 px-4 py-3">
        <p className="text-xs font-bold tracking-wide text-green-600 uppercase">Revenue</p>
        <p className="mt-1 text-lg font-bold text-green-800">$ {stats.revenue}</p>
      </div>
      <div className="rounded-xl bg-amber-50 px-4 py-3">
        <p className="text-xs font-bold tracking-wide text-amber-500 uppercase">Remaining</p>
        <p className="mt-1 text-lg font-bold text-amber-700">{stats.remaining}</p>
      </div>
    </div>
  </div>
);

export default RegistrationStats;
