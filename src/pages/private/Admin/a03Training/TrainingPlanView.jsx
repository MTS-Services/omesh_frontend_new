import React, { useState } from 'react';
import PlanTabs from './components/PlanTabs';
import StructureCards from './components/StructureCards';
import ParticipantList from './components/ParticipantList';
import AddPlanModal from './components/AddPlanModal';
import AddStructureModal from './components/AddStructureModal';
import { useTraining, useTrainingStructures } from '../../../../features/admin/trainingPlans/hooks';
import { toast } from 'react-toastify';

const TrainingPlanView = () => {
  const { plans, planMap, createPlan, deletePlan, loading, error } = useTraining();
  const {
    structures,
    createStructure,
    updateStructure,
    deleteStructure,
    loading: structuresLoading,
    error: structuresError,
  } = useTrainingStructures({ page: 1, limit: 10 });
  const [activePlan, setActivePlan] = useState('');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [editingStructure, setEditingStructure] = useState(null);
  const selectedPlan = activePlan || plans[0] || '';

  const handleAddPlan = async ({ plan, description }) => {
    const planName = plan?.trim();
    const planDescription = description?.trim();

    // 1. Auto-generate Slug
    const planSlug = planName
      ? planName
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
      : '';
    if (!planName) {
      toast.error('Please enter a plan name');
      return false;
    }

    if (!planDescription || planDescription.length < 10) {
      toast.error('Description must be at least 10 characters long');
      return false;
    }

    try {
      await createPlan({
        plan: planName,
        slug: planSlug,
        description: planDescription,
      }).unwrap();

      toast.success('Plan added successfully!');
      setActivePlan(planName);
      return true;
    } catch (error) {
      // Handle 422 or other backend errors
      const errorMessage = error?.data?.message || 'Failed to create plan';
      toast.error(errorMessage);
      console.error('Backend Error:', error);
      return false;
    }
  };

  const handleDeletePlan = async (planName) => {
    const id = planMap[planName];
    if (!id) return;

    try {
      await deletePlan(id).unwrap();

      if (selectedPlan === planName) {
        const nextPlan = plans.find((p) => p !== planName) || '';
        setActivePlan(nextPlan);
      }
    } catch {
      // Keep the UI unchanged when delete fails.
    }
  };

  const toStructurePayload = ({ minutes, description, weeks, categoryId }) => ({
    categoryId,
    durationMin: Number(minutes),
    title: description,
    description,
    isActive: true,
    weeks: (weeks || []).map((week, index) => ({
      weekNo: index + 1,
      days: Array.from({ length: 7 }).map(
        (_, dayIndex) => week.days?.[dayIndex]?.activity || 'Rest Day'
      ),
    })),
  });

  const handleAddStructure = async (data) => {
    const categoryId = planMap[data.trainingPlan];
    if (!categoryId) {
      toast.error('Please select a valid training plan category');
      return false;
    }

    try {
      await createStructure(toStructurePayload({ ...data, categoryId })).unwrap();
      toast.success('Structure added successfully!');
      return true;
    } catch (createError) {
      toast.error(createError || 'Failed to create structure');
      return false;
    }
  };

  const handleEditStructure = async (data) => {
    if (!editingStructure?.id) return false;

    const categoryId =
      planMap[data.trainingPlan] ||
      editingStructure.categoryId ||
      planMap[editingStructure.trainingPlan];

    if (!categoryId) {
      toast.error('Unable to resolve category for update');
      return false;
    }

    try {
      await updateStructure(
        editingStructure.id,
        toStructurePayload({ ...data, categoryId })
      ).unwrap();
      toast.success('Structure updated successfully!');
      setEditingStructure(null);
      return true;
    } catch (updateError) {
      toast.error(updateError || 'Failed to update structure');
      return false;
    }
  };

  const handleDeleteStructure = async (id) => {
    if (!id) return;
    try {
      await deleteStructure(id).unwrap();
      toast.success('Structure deleted successfully!');
    } catch (deleteError) {
      toast.error(deleteError || 'Failed to delete structure');
    }
  };

  const openEdit = (structure) => {
    setEditingStructure(structure);
    setShowStructureModal(true);
  };

  const closeStructureModal = () => {
    setShowStructureModal(false);
    setEditingStructure(null);
  };

  return (
    <div className="">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Training Plans</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          Loading plans...
        </div>
      )}

      {structuresLoading && (
        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
          Loading structures...
        </div>
      )}

      {structuresError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {structuresError}
        </div>
      )}

      <PlanTabs
        plans={plans}
        activePlan={selectedPlan}
        onPlanChange={setActivePlan}
        onAddPlan={() => setShowPlanModal(true)}
        onDeletePlan={handleDeletePlan}
      />

      <StructureCards
        structures={structures}
        onAdd={() => setShowStructureModal(true)}
        onEdit={openEdit}
        onDelete={handleDeleteStructure}
      />

      <ParticipantList />

      {showPlanModal && (
        <AddPlanModal onClose={() => setShowPlanModal(false)} onSave={handleAddPlan} />
      )}

      {showStructureModal && (
        <AddStructureModal
          plans={plans}
          initialData={editingStructure}
          onClose={closeStructureModal}
          onSave={editingStructure ? handleEditStructure : handleAddStructure}
        />
      )}
    </div>
  );
};

export default TrainingPlanView;
