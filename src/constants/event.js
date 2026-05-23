export const TABS = [
  { key: 'all', label: 'All Event' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'UPCOMING', label: 'Upcoming event' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancel' },
];

export const STATUS_STYLES = {
  draft: 'bg-slate-500 text-white',
  approved: 'bg-green-500 text-white',
  pending: 'bg-amber-400 text-white',
  upcoming: 'bg-teal-500 text-white',
  ongoing: 'bg-blue-500 text-white',
  completed: 'bg-emerald-600 text-white',
  rejected: 'bg-rose-500 text-white',
  suspended: 'bg-orange-500 text-white',
  cancelled: 'bg-red-500 text-white',
  canceled: 'bg-red-500 text-white',
};

export const STATUS_LABELS = {
  draft: 'Draft',
  approved: 'Approved',
  pending: 'Pending',
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  completed: 'Complete',
  rejected: 'Rejected',
  suspended: 'Suspended',
  cancelled: 'Cancelled',
  canceled: 'Cancelled',
};
