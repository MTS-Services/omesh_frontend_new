const TONE_CLS = {
  success: 'bg-green-500 text-white hover:bg-green-600',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  warning: 'bg-amber-400 text-white hover:bg-amber-500',
  default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
};

const DISABLED_CLS = 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300';

const QuickActions = ({ actions, setModalOpen, onAction }) => {
  const handleClick = (key) => {
    if (key === 'add') setModalOpen(true);
    else onAction?.(key);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-base font-bold text-gray-900">Quick Actions</h3>
      <div className="flex flex-col gap-2.5">
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            onClick={() => handleClick(action.key)}
            disabled={action.disabled}
            className={`w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${
              action.disabled
                ? DISABLED_CLS
                : action.cls ?? TONE_CLS[action.tone] ?? TONE_CLS.default
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
