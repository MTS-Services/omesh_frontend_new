import React from 'react';
import { Plus, X } from 'lucide-react';

const PlanTabs = ({ plans, activePlan, onPlanChange, onAddPlan, onDeletePlan }) => {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      {plans.map((plan) => (
        <div
          key={plan}
          className={`flex items-center gap-1 rounded-full pr-3 pl-3 text-sm font-medium transition-colors ${
            activePlan === plan
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <button onClick={() => onPlanChange(plan)} className="py-1.5">
            {plan}
          </button>
          {/* {onDeletePlan && (
            <button
              onClick={() => onDeletePlan(plan)}
              className={`rounded-full p-1 transition-colors ${
                activePlan === plan
                  ? 'text-gray-300 hover:bg-white/10 hover:text-white'
                  : 'text-gray-500 hover:bg-gray-300/60 hover:text-gray-700'
              }`}
              title="Delete plan"
            >
              <X size={12} />
            </button>
          )} */}
        </div>
      ))}
      <button
        onClick={onAddPlan}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default PlanTabs;
