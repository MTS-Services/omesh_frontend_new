import { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '../../../../../components/common/Modal';
import { request } from '../../../../../api/request';
import { ENDPOINT } from '../../../../../api/config/endpoints';

const INITIAL = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  gender: '',
  age: '',
  dob: '',
  team: '',
};

const AddParticipantModal = ({
  open,
  onClose,
  eventId,
  totalPrice = 0,
  location = '',
  onSuccess,
}) => {
  const [form, setForm] = useState(INITIAL);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventId) {
      toast.error('Event ID is missing');
      return;
    }

    const requiredFields = [
      form.firstName,
      form.lastName,
      // form.email,
      form.phone,
      form.gender,
      form.age,
      form.dob,
    ];
    if (requiredFields.some((value) => !String(value || '').trim())) {
      toast.error('Please fill in all required fields');
      return;
    }

    const normalizedGender = String(form.gender || '')
      .trim()
      .toUpperCase();
    if (!['MALE', 'FEMALE'].includes(normalizedGender)) {
      toast.error('Gender must be MALE or FEMALE');
      return;
    }

    const payload = {
      eventId,
      source: 'MANUAL_ADD',
      platformFee: 7,
      totalPrice: Number(totalPrice || 0),
      participants: [
        {
          firstName: String(form.firstName || '').trim(),
          lastName: String(form.lastName || '').trim(),
          email: String(form.email || '')
            .trim()
            .toLowerCase(),
          phone: String(form.phone || '').trim(),
          gender: normalizedGender,
          age: Number(form.age || 0),
          dateOfBirth: String(form.dob || '').trim(),
          location: String(location || '').trim(),
          teamClub: String(form.team || '').trim(),
          status: 'PENDING_PAYMENT',
        },
      ],
    };

    try {
      setIsSubmitting(true);
      await request({
        method: 'POST',
        url: ENDPOINT.PUBLIC.EVENTS.REGISTRATION,
        data: payload,
      });
      toast.success('Participant added successfully');
      setForm(INITIAL);
      onClose?.();
      onSuccess?.();
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Failed to add participant';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Registration Details" size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* First + Last Name */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-700">First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-700">Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="enter your email..."
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="enter your phone number..."
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Gender + Age */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-700">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            >
              <option value="" />
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              min={1}
              className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
            placeholder="mm/dd/yyy"
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-500 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Team / Club */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-gray-700">Team / Club (optional)</label>
          <input
            name="team"
            value={form.team}
            onChange={handleChange}
            className="rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-1 w-full rounded-xl bg-[#1FB356] py-3 text-sm font-semibold text-white transition hover:bg-[#188a47]"
        >
          {isSubmitting ? 'Submitting...' : 'Confirm'}
        </button>
      </form>
    </Modal>
  );
};

export default AddParticipantModal;
