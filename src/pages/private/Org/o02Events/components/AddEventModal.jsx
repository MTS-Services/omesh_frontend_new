import { useState, useEffect, useRef } from 'react';
import {
  Type,
  AlignLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Ruler,
  DollarSign,
  Tag,
  Upload,
} from 'lucide-react';
import Modal from '../../../../../components/common/Modal';

const EMPTY_FORM = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  totalTickets: '',
  distance: '',
  ticketPrice: '',
  promoCode: '',
  promoDiscount: '',
  banner: null,
  bannerPreview: null,
};

const Field = ({ label, icon: Icon, children }) => (
  <div className="flex flex-col gap-1">
    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
      <Icon size={13} className="text-gray-500" />
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition';

const AddEventModal = ({ isOpen, onClose, initialData = null, onSubmit }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const fileRef = useRef(null);

  /* Populate form when editing */
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          title: initialData.title ?? '',
          description: initialData.description ?? '',
          date: initialData.date ?? '',
          time: initialData.time ?? '',
          location: initialData.location ?? '',
          totalTickets: initialData.totalSeats?.toString() ?? '',
          distance: initialData.distance ?? '',
          ticketPrice: initialData.ticketPrice ?? '',
          promoCode: initialData.promoCode ?? '',
          promoDiscount: initialData.promoDiscount ?? '',
          banner: null,
          bannerPreview: initialData.image ?? null,
        });
      } else {
        setForm(EMPTY_FORM);
      }
    }
  }, [isOpen, initialData]);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      banner: file,
      bannerPreview: URL.createObjectURL(file),
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      banner: file,
      bannerPreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Event' : 'Add Event'}
      size="2xl"
      className="max-h-[80vh]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Event Title" icon={Type}>
          <input
            type="text"
            value={form.title}
            onChange={set('title')}
            placeholder="enter event title"
            className={inputCls}
            required
          />
        </Field>

        <Field label="Description" icon={AlignLeft}>
          <textarea
            value={form.description}
            onChange={set('description')}
            placeholder="enter event description"
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Date" icon={Calendar}>
            <input
              type="text"
              value={form.date}
              onChange={set('date')}
              placeholder="dd/mm/yy"
              className={inputCls}
              required
            />
          </Field>
          <Field label="Time" icon={Clock}>
            <input
              type="text"
              value={form.time}
              onChange={set('time')}
              placeholder="Select time"
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Location" icon={MapPin}>
          <input
            type="text"
            value={form.location}
            onChange={set('location')}
            placeholder="enter event location"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Total Ticket" icon={Users}>
            <input
              type="number"
              value={form.totalTickets}
              onChange={set('totalTickets')}
              placeholder="Number Of seats"
              className={inputCls}
              min={0}
            />
          </Field>
          <Field label="Distance" icon={Ruler}>
            <input
              type="text"
              value={form.distance}
              onChange={set('distance')}
              placeholder="Distance (km)"
              className={inputCls}
            />
          </Field>
          <Field label="Ticket Price" icon={DollarSign}>
            <input
              type="number"
              value={form.ticketPrice}
              onChange={set('ticketPrice')}
              placeholder="Enter price ($)"
              className={inputCls}
              min={0}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Promo Code" icon={Tag}>
            <input
              type="text"
              value={form.promoCode}
              onChange={set('promoCode')}
              placeholder="Promo code"
              className={inputCls}
            />
          </Field>

          <Field label="Discount Percentage" icon={DollarSign}>
            <input
              type="number"
              value={form.promoDiscount}
              onChange={set('promoDiscount')}
              placeholder="Discount %"
              className={inputCls}
              min={0}
              max={100}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-sm font-bold text-gray-800">Event Banner</span>
          <div
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-4 transition hover:border-green-400 hover:bg-green-50"
            onClick={() => fileRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            {form.bannerPreview ? (
              <img
                src={form.bannerPreview}
                alt="Banner preview"
                className="h-72 w-full rounded-lg object-cover"
              />
            ) : (
              <>
                <Upload size={22} className="text-gray-400" />
                <p className="text-sm font-medium text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleFile}
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="rounded-lg bg-green-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddEventModal;
