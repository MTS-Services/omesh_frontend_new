import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../../../../../components/common/Modal';
import { toast } from 'react-toastify';

const AddStructureModal = ({ onClose, onSave, plans, initialData }) => {
  console.log('Initial data for AddStructureModal:', initialData);

  const [form, setForm] = useState(
    initialData
      ? {
          minutes: String(initialData.minutes),
          description: initialData.description,
          trainingPlan: initialData.trainingPlan || (plans[0] ?? ''),
          weeks: initialData.weeks || [],
        }
      : { minutes: '', description: '', trainingPlan: plans[0] ?? '', weeks: [] }
  );

  const handleSave = async () => {
    if (!form.minutes) return toast.error('Duration is required');
    if (form.description.length < 10) return toast.error('Description must be 10+ characters');
    if (form.weeks.length === 0) return toast.error('Please add at least one week');

    const ok = await onSave({
      minutes: Number(form.minutes),
      description: form.description,
      trainingPlan: form.trainingPlan,
      weeks: form.weeks,
    });

    if (ok) onClose();
  };

  const addWeek = () =>
    setForm((f) => ({
      ...f,
      weeks: [...f.weeks, { id: Date.now(), days: [{ id: Date.now() + 1, activity: '' }] }],
    }));

  const addDay = (weekIdx) =>
    setForm((f) => {
      const weeks = f.weeks.map((w, i) =>
        i === weekIdx ? { ...w, days: [...w.days, { id: Date.now(), activity: '' }] } : w
      );
      return { ...f, weeks };
    });

  const updateActivity = (weekIdx, dayIdx, value) =>
    setForm((f) => {
      const weeks = f.weeks.map((w, i) =>
        i === weekIdx
          ? {
              ...w,
              days: w.days.map((d, j) => (j === dayIdx ? { ...d, activity: value } : d)),
            }
          : w
      );
      return { ...f, weeks };
    });

  return (
    <Modal open={true} onClose={onClose} title="Add Structure" size="md">
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Workout minutes</label>
          <input
            type="number"
            value={form.minutes}
            onChange={(e) => setForm((f) => ({ ...f, minutes: e.target.value }))}
            placeholder="32 minutes"
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Workout description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={3}
            placeholder="Improve your fitness, boost energy..."
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-green-300 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Training plan</label>
          <div className="relative">
            <select
              value={form.trainingPlan}
              onChange={(e) => setForm((f) => ({ ...f, trainingPlan: e.target.value }))}
              className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 pr-8 text-sm text-gray-700 focus:ring-2 focus:ring-green-300 focus:outline-none"
            >
              {plans.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400">
              ▾
            </span>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">Plan Structure</h3>
            <button
              onClick={addWeek}
              className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600"
            >
              Add Week
            </button>
          </div>

          {form.weeks.length === 0 && (
            <p className="text-sm text-gray-400">No weeks added yet. Click "Add Week" to start.</p>
          )}

          <div className="space-y-4">
            {form.weeks.map((week, wi) => (
              <div key={week.id} className="rounded-xl border border-green-100 bg-green-50 p-4">
                <p className="mb-2 text-sm font-semibold text-gray-700">Week {wi + 1}</p>

                {week.days.map((day, di) => (
                  <div key={day.id} className="mb-3">
                    <p className="mb-1 text-sm font-medium text-green-600">Day {di + 1}</p>
                    <p className="mb-1 text-xs text-gray-500">Activity</p>
                    <input
                      type="text"
                      value={day.activity}
                      onChange={(e) => updateActivity(wi, di, e.target.value)}
                      placeholder="5 km run"
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-green-300 focus:outline-none"
                    />
                  </div>
                ))}

                <button
                  onClick={() => addDay(wi)}
                  className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700"
                >
                  <Plus size={13} />
                  Add another day
                </button>
              </div>
            ))}
          </div>
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

export default AddStructureModal;
