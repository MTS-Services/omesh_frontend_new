/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Skeleton from '../../../components/common/Skeleton';
import { fetchTrainingCategories } from '../../../features/public/training/trainingAPI';
import { fetchTrainingPlansByCategoryAPI } from '../../../features/public/trainingPlans/trainingPlansAPI';

const TrainingCardSkeleton = () => {
  return (
    <div className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
      <Skeleton className="mb-4 h-10 w-2/5" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-11/12" />
      <Skeleton className="mb-6 h-4 w-10/12" />
      <Skeleton className="h-10 w-40 rounded-md" />
    </div>
  );
};

const TrainingView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: categories = [], status } = useSelector((s) => s.publicTraining || {});

  const { items: plans = [], status: plansStatus } = useSelector((s) => s.publicTrainingPlans || {});

  const [activePlan, setActivePlan] = useState(null);

  const makeOption = useMemo(() => {
    return (
      categories?.map((cat) => ({
        id: cat.slug || cat.id,
        label: cat.plan,
      })) || []
    );
  }, [categories]);

  useEffect(() => {
    if (status === 'idle' || status === undefined) {
      dispatch(fetchTrainingCategories());
    }
  }, [dispatch, status]);

  // Set first tab active once categories load
  useEffect(() => {
    if (makeOption.length > 0 && !activePlan) {
      setActivePlan(makeOption[0].id);
    }
  }, [makeOption, activePlan]);

  const effectiveActivePlan = activePlan ?? makeOption[0]?.id;

  const visiblePlans = useMemo(() => {
    if (!Array.isArray(plans)) return [];
    if (!effectiveActivePlan) return plans;

    const activeKey = String(effectiveActivePlan).trim().toLowerCase();

    const withKeys = plans.map((item) => {
      const keys = [
        item?.categoryId,
        item?.category?.id,
        item?.category?._id,
        item?.category?.slug,
        item?.categorySlug,
        item?.trainingPlanCategoryId,
        item?.trainingPlanCategory?.id,
        item?.trainingPlanCategory?._id,
        item?.trainingPlanCategory?.slug,
      ]
        .filter(Boolean)
        .map((value) => String(value).trim().toLowerCase());

      return { item, keys };
    });

    const hasCategoryMetadata = withKeys.some((entry) => entry.keys.length > 0);
    if (!hasCategoryMetadata) {
      return plans;
    }

    return withKeys.filter((entry) => entry.keys.includes(activeKey)).map((entry) => entry.item);
  }, [plans, effectiveActivePlan]);

  const showPlanSkeletons =
    (plansStatus === 'idle' || plansStatus === 'loading') && Array.isArray(plans) && plans.length === 0;

  useEffect(() => {
    if (!effectiveActivePlan) return;
    const promise = dispatch(
      fetchTrainingPlansByCategoryAPI({
        category: effectiveActivePlan,
        params: { page: 1, limit: 1000, categorySlug: effectiveActivePlan, categoryId: effectiveActivePlan },
      })
    );
    return () => promise.abort();
  }, [dispatch, effectiveActivePlan]);

  return (
    <section className="bg-white px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-2xl text-gray-900 md:text-3xl lg:text-5xl">Training Plans</h1>
          <p className="mt-2 text-sm text-gray-500 md:text-base lg:text-lg">
            Choose your plan based on your goal
          </p>
        </div>

        <div className="mx-auto mt-6 mb-8 w-full px-4">
          <div className="relative flex items-center justify-between overflow-hidden rounded-xl border border-[#42444A] bg-white p-1 py-5">
            <div
              className="absolute bottom-3 h-0.5 bg-green-400 transition-all duration-500 ease-in-out"
              style={{
                width: '150px',
                left: makeOption.length
                  ? `${(100 / makeOption.length) * (makeOption.findIndex((p) => p.id === activePlan) + 0.5)}%`
                  : '50%',
                transform: 'translateX(-50%)',
              }}
            />

            {makeOption.map((plan) => {
              const isActive = activePlan === plan.id;

              return (
                <button
                  key={plan.id}
                  onClick={() => setActivePlan(plan.id)}
                  className={`relative z-10 flex-1 text-[20px] font-bold transition-colors duration-300 sm:text-[24px] ${
                    isActive ? 'text-green-600' : 'text-[#42444A] hover:text-gray-800'
                  }`}
                >
                  {plan.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {showPlanSkeletons &&
            Array.from({ length: 6 }).map((_, index) => <TrainingCardSkeleton key={index} />)}
          {status === 'failed' && (
            <div className="text-center text-red-500">Failed to load categories.</div>
          )}
          {!showPlanSkeletons &&
            Array.isArray(visiblePlans) &&
            visiblePlans.map((cat) => (
              <div
                key={cat.id}
                className="flex flex-col items-center rounded-lg border border-gray-200 bg-gray-50 p-8 text-center transition-shadow hover:shadow-md"
              >
                <h3 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
                  {cat.durationMin} 
                </h3>
                <p className="mb-6 text-sm leading-relaxed text-gray-700 md:text-base">
                  {cat.description}
                </p>
                {/* <div className="mb-4 text-sm text-gray-500">
                  {cat._count?.trainingPlans ?? 0} plans
                </div> */}
                <button
                  onClick={() => navigate(`/training-plans/${cat.id}`)}
                  className="rounded-md bg-green-500 px-8 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600 md:text-base"
                >
                  View Plans
                </button>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default TrainingView;
