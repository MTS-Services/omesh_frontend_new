export const eventTabs = [
  { key: 'all', label: 'All Event' },
  { key: 'approved', label: 'Approved' },
  { key: 'pending', label: 'Pending' },
  { key: 'upcoming', label: 'Upcoming Event' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancel', label: 'Cancel' },
];

export const statusBadgeStyles = {
  approved: 'bg-[#E9F9EF] text-[#1FB356]',
  pending: 'bg-[#FEF5E7] text-[#DF900A]',
  upcoming: 'bg-[#FEF5E7] text-[#DF900A]',
  completed: 'bg-[#E9F9EF] text-[#1FB356]',
  cancel: 'bg-[#FBE9E9] text-[#D70000]',
};

export const statusLabelMap = {
  approved: 'Approved',
  pending: 'Pending',
  upcoming: 'Upcoming',
  completed: 'Complete',
  cancel: 'Cancel',
};

export const organizerPaginationByFilter = {
  all: '1',
  approved: '1',
  pending: '2',
  upcoming: '3',
  completed: '1',
  cancel: '2',
};
