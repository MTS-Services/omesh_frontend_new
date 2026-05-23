import { useState } from 'react';
import Modal from '../../../../../components/common/Modal';

const AddPlanModal = ({ onClose, onSave }) => {
  const [plan, setPlan] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    if (!plan.trim() || !description.trim()) return;
    const ok = await onSave({ plan: plan.trim(), description: description.trim() });
    if (ok) onClose();
  };

  return (
    <Modal open={true} onClose={onClose} title="Training Plans" size="md">
      <div className="flex flex-col gap-4">
        {/* Plan */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Plan</label>
          <input
            type="text"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            placeholder="5k"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Improve your fitness, boost energy..."
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
        </div>

        <button
          onClick={handleSave}
          className="rounded-lg bg-green-500 px-5 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default AddPlanModal;
