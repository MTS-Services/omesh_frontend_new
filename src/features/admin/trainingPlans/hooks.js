import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTrainingPlans,
  addTrainingPlan,
  editTrainingPlan,
  removeTrainingPlan,
} from './trainingAPI';
import {
  getTrainingStructures,
  addTrainingStructure,
  editTrainingStructure,
  removeTrainingStructure,
} from './trainingStructureAPI';

const toArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const getPlanName = (item) =>
  item?.plan || item?.name || item?.title || item?.categoryName || item?.label || '';

const getPlanId = (item) => item?.id || item?._id || item?.categoryId;

const toStructureList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const normalizeWeeks = (weeks = []) => {
  if (!Array.isArray(weeks)) return [];
  return weeks.map((week, weekIndex) => {
    const days = Array.isArray(week?.days) ? week.days : [];
    return {
      id: week?.id ?? week?.weekNo ?? weekIndex + 1,
      days: days.map((activity, dayIndex) => ({
        id: `${weekIndex + 1}-${dayIndex + 1}`,
        activity: typeof activity === 'string' ? activity : '',
      })),
    };
  });
};

const mapStructure = (item) => ({
  id: item?.id ?? item?._id,
  minutes: item?.durationMin ?? item?.minutes ?? 0,
  description: item?.description ?? item?.title ?? '',
  categoryId: item?.categoryId ?? item?.category?.id ?? item?.category?._id,
  trainingPlan:
    item?.category?.plan ?? item?.categoryName ?? item?.trainingPlan ?? item?.plan ?? '',
  weeks: normalizeWeeks(item?.weeks),
});

export const useTraining = () => {
  const dispatch = useDispatch();
  const rawPlans = useSelector((state) => state.training.items);
  const status = useSelector((state) => state.training.status);
  const error = useSelector((state) => state.training.error);

  const plans = toArray(rawPlans).map(getPlanName).filter(Boolean);
  const planMap = toArray(rawPlans).reduce((acc, item) => {
    const name = getPlanName(item);
    const id = getPlanId(item);
    if (name && id) acc[name] = id;
    return acc;
  }, {});

  useEffect(() => {
    const promise = dispatch(getTrainingPlans());
    return () => promise.abort();
  }, [dispatch]);

  const createPlan = useCallback((data) => dispatch(addTrainingPlan(data)), [dispatch]);
  const updatePlan = useCallback(
    (id, data) => dispatch(editTrainingPlan({ id, data })),
    [dispatch]
  );
  const deletePlan = useCallback((id) => dispatch(removeTrainingPlan(id)), [dispatch]);

  return {
    plans,
    planMap,
    loading: status === 'loading',
    error,
    createPlan,
    updatePlan,
    deletePlan,
  };
};

export const useTrainingStructures = (query = { page: 1, limit: 10 }) => {
  const dispatch = useDispatch();
  const queryPage = query?.page ?? 1;
  const queryLimit = query?.limit ?? 10;
  const rawStructures = useSelector((state) => state.trainingStructures.items);
  const total = useSelector((state) => state.trainingStructures.total);
  const page = useSelector((state) => state.trainingStructures.page);
  const limit = useSelector((state) => state.trainingStructures.limit);
  const status = useSelector((state) => state.trainingStructures.status);
  const error = useSelector((state) => state.trainingStructures.error);

  useEffect(() => {
    const promise = dispatch(getTrainingStructures({ page: queryPage, limit: queryLimit }));
    return () => promise.abort();
  }, [dispatch, queryPage, queryLimit]);

  const createStructure = useCallback(
    (payload) => dispatch(addTrainingStructure(payload)),
    [dispatch]
  );
  const updateStructure = useCallback(
    (id, data) => dispatch(editTrainingStructure({ id, data })),
    [dispatch]
  );
  const deleteStructure = useCallback((id) => dispatch(removeTrainingStructure(id)), [dispatch]);

  return {
    structures: toStructureList(rawStructures)
      .map(mapStructure)
      .filter((item) => item.id),
    total,
    page,
    limit,
    loading: status === 'loading',
    error,
    createStructure,
    updateStructure,
    deleteStructure,
  };
};
