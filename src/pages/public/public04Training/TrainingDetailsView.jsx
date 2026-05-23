import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { request } from '../../../api/request';
import { fetchTrainingPlanByIdAPI } from '../../../features/public/trainingPlans/trainingPlansAPI';
import { clearSelectedPlan } from '../../../features/public/trainingPlans/trainingPlansSlice';

const TrainingDetailsView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isJoining, setIsJoining] = React.useState(false);

  const numericKey = Number(id);
  const isNumeric = !Number.isNaN(numericKey);

  const { selectedPlan, selectedPlanStatus } = useSelector((s) => s.publicTrainingPlans || {});
  const { isAuthenticated } = useSelector((s) => s.auth || {});

  const showPageLoader = !isNumeric && selectedPlanStatus === 'loading';

  useEffect(() => {
    if (isNumeric) return;
    const promise = dispatch(fetchTrainingPlanByIdAPI({ id }));
    return () => {
      promise.abort();
      dispatch(clearSelectedPlan());
    };
  }, [dispatch, id, isNumeric]);

  const apiWeeks = selectedPlan?.weeks ?? selectedPlan?.schedule ?? [];

  const handleJoinNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login first to join this training plan.');
      return;
    }

    const planId = selectedPlan?.id ?? selectedPlan?._id ?? id;
    if (!planId) {
      toast.error('Training plan id is missing.');
      return;
    }

    try {
      setIsJoining(true);
      await request({
        method: 'POST',
        url: '/api/v1/training-enrollment',
        data: {
          planId,
        },
      });
      toast.success('Training plan joined successfully.');
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to join training plan.';
      toast.error(message);
    } finally {
      setIsJoining(false);
    }
  };

  if (showPageLoader) {
    return (
      <section className="bg-white px-4 py-10 sm:px-6 md:py-16 lg:px-8">
        <div className="mx-auto flex min-h-[45vh] max-w-7xl items-center justify-center">
          <div className="inline-flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 text-gray-700 shadow-sm">
            <Loader2 className="h-5 w-5 animate-spin text-green-500" />
            <span className="text-sm font-medium">Loading training details...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-2xl text-gray-900 md:text-3xl lg:text-5xl">Training Plans</h1>
            <p className="text-base text-gray-700">{selectedPlan?.title}</p>
          </div>
          <div>
            <button
              onClick={handleJoinNow}
              disabled={isJoining}
              className="rounded-md bg-green-500 px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600 md:text-base"
            >
              {isJoining ? 'Joining...' : 'Join Now'}
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        {isNumeric ? (
          <div className="space-y-4 lg:hidden">
            {apiWeeks.weeks.map((weekData) => (
              <div key={weekData.week} className="rounded-lg border border-gray-300 p-4 md:p-6">
                {/* Week Title */}
                <h3 className="mb-4 text-xl font-semibold text-green-500">Week {weekData.week}</h3>

                {/* Days List */}
                <div className="space-y-2.5">
                  {weekData.days.map((day, dayIndex) => (
                    <div key={dayIndex} className="flex text-sm">
                      <span className="min-w-[50px] font-medium text-gray-700">
                        Day {dayIndex + 1}:
                      </span>
                      <span className="text-gray-600">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {selectedPlanStatus === 'failed' && (
              <div className="text-center text-red-500">Failed to load plan details.</div>
            )}
            {selectedPlanStatus === 'succeeded' && apiWeeks.length === 0 && (
              <div className="text-center text-gray-600">No schedule available for this plan.</div>
            )}

            {/* Mobile card view */}
            <div className="space-y-4 lg:hidden">
              {apiWeeks.map((weekData, wi) => (
                <div
                  key={weekData.week ?? wi}
                  className="rounded-lg border border-gray-300 p-4 md:p-6"
                >
                  <h3 className="mb-4 text-xl font-semibold text-green-500">
                    Week {weekData.week ?? wi + 1}
                  </h3>
                  <div className="space-y-2.5">
                    {(weekData.days ?? []).map((day, dayIndex) => (
                      <div key={dayIndex} className="flex text-sm">
                        <span className="min-w-[50px] font-medium text-gray-700">
                          Day {dayIndex + 1}:
                        </span>
                        <span className="text-gray-600">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            {apiWeeks.length > 0 && (
              <div className="hidden overflow-x-auto rounded-lg border border-gray-200 lg:block">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="border border-gray-700 px-4 py-3 text-left text-sm font-semibold">
                        Weeks
                      </th>
                      {Array.from({ length: 7 }, (_, i) => (
                        <th
                          key={i}
                          className="border border-gray-700 px-4 py-3 text-left text-sm font-semibold"
                        >
                          Day {i + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {apiWeeks.map((weekData, index) => (
                      <tr
                        key={weekData.week ?? index}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-900">
                          {weekData.week ?? index + 1}
                        </td>
                        {(weekData.days ?? []).map((day, dayIndex) => (
                          <td
                            key={dayIndex}
                            className="border border-gray-200 px-4 py-3 text-sm text-gray-700"
                          >
                            {day}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Desktop Table View — static plans only */}
        {isNumeric ? (
          <div className="hidden overflow-x-auto rounded-lg border border-gray-200 lg:block">
            <table className="w-full border-collapse">
              {/* Table Header */}
              <thead>
                <tr className="bg-black text-white">
                  <th className="border border-gray-700 px-4 py-3 text-left text-sm font-semibold">
                    Weeks
                  </th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-sm font-semibold">
                    Day 1
                  </th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-sm font-semibold">
                    Day 2
                  </th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-sm font-semibold">
                    Day 3
                  </th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-sm font-semibold">
                    Day 4
                  </th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-sm font-semibold">
                    Day 5
                  </th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-sm font-semibold">
                    Day 6
                  </th>
                  <th className="border border-gray-700 px-4 py-3 text-left text-sm font-semibold">
                    Day 7
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {apiWeeks.weeks.map((weekData, index) => (
                  <tr key={weekData.week} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 px-4 py-3 text-center text-sm font-medium text-gray-900">
                      {weekData.week}
                    </td>
                    {weekData.days.map((day, dayIndex) => (
                      <td
                        key={dayIndex}
                        className="border border-gray-200 px-4 py-3 text-sm text-gray-700"
                      >
                        {day}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default TrainingDetailsView;
