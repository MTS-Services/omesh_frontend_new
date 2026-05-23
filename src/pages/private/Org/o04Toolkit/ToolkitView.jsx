import { useState } from 'react';
import { ImagePlus, X } from 'lucide-react';
import {
  submitToolkitRequest,
  uploadToolkitImages,
} from '../../../../features/organizer/toolkit/toolkitService';
import { toast } from 'react-toastify';

const ToolkitView = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    quantity: '',
    images: [],
    needHelp: false,
    fullName: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const max = 4;
    const availableSlots = max - formData.images.length;
    if (availableSlots <= 0) {
      setError('You can only upload 4 images. Remove one to add another.');
      e.target.value = '';
      return;
    }

    const filesToUpload = files.slice(0, availableSlots);
    if (files.length > availableSlots) {
      setError(`Only ${availableSlots} image(s) were added to reach 4 total.`);
    } else {
      setError('');
    }

    try {
      setUploadingImages(true);
      const uploadedUrls = await uploadToolkitImages(filesToUpload);

      const uploadedEntries = filesToUpload.map((file, index) => ({
        file,
        url: uploadedUrls[index] || '',
        preview: URL.createObjectURL(file),
      }));

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedEntries.filter((entry) => entry.url)],
      }));
    } catch (uploadError) {
      const message =
        uploadError?.response?.data?.message || uploadError?.message || 'Failed to upload images.';
      setError(message);
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      URL.revokeObjectURL(prev.images[index].preview);
      const next = { ...prev, images: prev.images.filter((_, i) => i !== index) };
      // clear error if we now have slots
      if (next.images.length < 4) setError('');
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.eventName.trim()) {
      setError('Please enter an event name.');
      return;
    }

    if (!formData.eventDate) {
      setError('Please pick an event date.');
      return;
    }

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      setError('Please enter a valid quantity.');
      return;
    }

    if (formData.images.length === 0) {
      setError('Please upload at least one design image.');
      return;
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    submitToolkitRequest({
      eventName: formData.eventName.trim(),
      eventDate: formData.eventDate,
      quantity: Number(formData.quantity),
      designImageUrls: formData.images
        .map((img) => img.url)
        .filter((value) => typeof value === 'string' && value.trim()),
      needsDesignHelp: formData.needHelp,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
    })
      .then(() => {
        formData.images.forEach((img) => {
          if (typeof img?.preview === 'string' && img.preview.startsWith('blob:')) {
            URL.revokeObjectURL(img.preview);
          }
        });
        setSuccess('Toolkit request submitted successfully.');
        toast.success('Toolkit request submitted successfully.');
        setFormData({
          eventName: '',
          eventDate: '',
          quantity: '',
          images: [],
          needHelp: false,
          fullName: '',
          email: '',
          phone: '',
        });
        setError('');
      })
      .catch((submitError) => {
        const message =
          submitError?.response?.data?.message ||
          submitError?.message ||
          'Failed to submit toolkit request.';
        setError(message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <div>
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Event Details */}
        <section>
          <h3 className="my-6 text-lg font-bold text-gray-900">Event Details</h3>
          <div className="space-y-3">
            <input
              type="text"
              name="eventName"
              placeholder="Event Name..."
              value={formData.eventName}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <input
              type="date"
              name="eventDate"
              placeholder="Event Date..."
              value={formData.eventDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
            <input
              type="number"
              name="quantity"
              min="1"
              step="1"
              placeholder="Quantity Needed"
              value={formData.quantity}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
        </section>

        {/* Design */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-gray-900">Design</h3>
          {/* Image previews */}
          {formData.images.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {formData.images.map((img, i) => (
                <div
                  key={i}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200"
                >
                  <img
                    src={img.preview}
                    alt={img.file.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <label
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-16 transition hover:border-green-300 hover:bg-green-50/30 ${
              formData.images.length >= 4 ? 'cursor-not-allowed opacity-60' : ''
            }`}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={formData.images.length >= 4 || uploadingImages}
              className="hidden"
            />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white">
              <ImagePlus className="h-8 w-8 text-gray-400" />
            </div>
            <p className="mt-4 text-sm font-medium text-gray-700">
              {uploadingImages
                ? 'Uploading images...'
                : formData.images.length === 4
                  ? '4 images selected — maximum reached'
                  : `Upload ${4 - formData.images.length} image(s) — total 4 required`}
            </p>
          </label>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-2 text-sm text-green-600">{success}</p>}
          <label className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              name="needHelp"
              checked={formData.needHelp}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-500"
            />
            <span className="text-sm text-gray-600">Need help with design</span>
          </label>
        </section>

        {/* Contact Info */}
        <section>
          <h3 className="mb-4 text-lg font-bold text-gray-900">Contact Info</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                name="fullName"
                placeholder="enter your full name..."
                value={formData.fullName}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <input
                type="email"
                name="email"
                placeholder="enter your email..."
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>
            <input
              type="tel"
              name="phone"
              placeholder="enter your Phone number..."
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>
          <p className="mt-4 text-sm text-gray-600">
            We'll respond within 24 hours. No commitment required.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 rounded-lg bg-[#1FB356] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#188a47] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? 'Submitting...' : 'Request Quote'}
          </button>
        </section>
      </form>
    </div>
  );
};

export default ToolkitView;
