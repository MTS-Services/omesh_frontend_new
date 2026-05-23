import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Modal from '../../../components/common/Modal';
import { selectUserRole } from '../../../features/auth/selectors';
import { ROLES, getDashboardPathByRole } from '../../../utils/auth';

const OrganizerView = () => {
  const navigate = useNavigate();
  const userRole = useSelector(selectUserRole);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setModalOpen(true);
  }, []);

  const handleRegisterNow = () => {
    setModalOpen(false);
    if (userRole === ROLES.ORGANIZER) {
      navigate(getDashboardPathByRole(userRole));
      return;
    }

    navigate('/auth/register');
  };

  const handleHome = () => {
    setModalOpen(false);
    navigate('/');
  };
  // Render only the Organizer Registration Modal per request. Add a hidden
  // full-viewport spacer so the site's footer remains pushed to the bottom.
  return (
    <>
      <div style={{ height: '100vh', visibility: 'hidden' }} aria-hidden="true" />
      <Modal
      open={modalOpen}
      onClose={handleHome}
      title="Join as Organizer"
      size="md"
      closeOnOverlay={true}
      closeOnEscape={true}
      showCloseButton={true}
      footer={
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleHome}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            Home
          </button>
          <button
            type="button"
            onClick={handleRegisterNow}
            className="w-full rounded-lg bg-[#1FB356] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#188a47] sm:w-auto"
          >
            Register Now
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-center text-gray-600">
        <p className="text-lg">Would you like to join as an Organizer?</p>
        <p className="text-sm">
          Create events, manage registrations, and grow your community as an event organizer.
        </p>
      </div>
    </Modal>
    </>
  );
};

export default OrganizerView;
