import React from 'react';
import { useState, useRef, useEffect } from 'react';
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
  ArrowLeft,
  ImagePlus,
  X,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../../../../api/config/constants';
import { request } from '../../../../api/request';
import { ENDPOINT } from '../../../../api/config/endpoints';
import {
  createEventService,
  uploadEventImages,
  updateEventService,
} from '../../../../features/organizer/events/eventService';
import MultipleImageUpload from '../../../../components/common/MultipleImageUpload';
import { useEventsList } from '../../../../features/organizer/events/hooks';

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
  bannerImages: [],
};

const Field = ({ label, icon, children }) => {
  const IconComponent = icon;

  return (
    <div className="flex flex-col gap-1">
      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-800">
        {React.createElement(IconComponent, {
          size: 13,
          className: 'text-gray-500',
        })}
        {label}
      </label>
      {children}
    </div>
  );
};

const inputCls =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-100 focus:outline-none transition';

const resolveImageUrl = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^https?:\/\//i.test(raw) || raw.startsWith('data:') || raw.startsWith('blob:')) {
    return raw;
  }

  return `${API_CONFIG.BASE_URL}${raw.startsWith('/') ? '' : '/'}${raw}`;
};

const normalizeDateForInput = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const ddmmyyMatch = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
  if (ddmmyyMatch) {
    const day = ddmmyyMatch[1].padStart(2, '0');
    const month = ddmmyyMatch[2].padStart(2, '0');
    const yearRaw = ddmmyyMatch[3];
    const year = yearRaw.length === 2 ? `20${yearRaw}` : yearRaw;
    return `${year}-${month}-${day}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return '';
};

const normalizeTimeForInput = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';

  const hhmmMatch = raw.match(/^(\d{1,2}):(\d{2})$/);
  if (hhmmMatch) {
    const hour = hhmmMatch[1].padStart(2, '0');
    const minute = hhmmMatch[2].padStart(2, '0');
    return `${hour}:${minute}`;
  }

  const hhmmssMatch = raw.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
  if (hhmmssMatch) {
    const hour = hhmmssMatch[1].padStart(2, '0');
    const minute = hhmmssMatch[2].padStart(2, '0');
    return `${hour}:${minute}`;
  }

  const parsed = new Date(`1970-01-01T${raw}`);
  if (!Number.isNaN(parsed.getTime())) {
    const hour = String(parsed.getHours()).padStart(2, '0');
    const minute = String(parsed.getMinutes()).padStart(2, '0');
    return `${hour}:${minute}`;
  }

  return '';
};

const extractTimeFromISO = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return '';
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  } catch {
    return '';
  }
};

const buildInitialForm = (event) => {
  // Extract date and time from startAt (ISO datetime)
  const startAtDate = event?.startAt ? normalizeDateForInput(event.startAt) : '';
  const startAtTime = event?.startAt ? extractTimeFromISO(event.startAt) : '';

  // Build banner images from API response
  let bannerImages = [];

  // Priority 1: Use images array if available (API returns array of image objects)
  if (Array.isArray(event?.images) && event.images.length > 0) {
    bannerImages = event.images
      .filter((img) => img?.url)
      .map((img) => ({
        file: null,
        preview: resolveImageUrl(img.url),
        uploaded: false,
      }));
  }

  // Priority 2: Use coverImageUrl if no images array
  if (bannerImages.length === 0 && event?.coverImageUrl) {
    bannerImages = [{ file: null, preview: resolveImageUrl(event.coverImageUrl), uploaded: false }];
  }

  // Priority 3: Use legacy image field
  if (bannerImages.length === 0 && event?.image) {
    bannerImages = [{ file: null, preview: resolveImageUrl(event.image), uploaded: false }];
  }

  // Priority 4: Use gallery array (fallback)
  if (bannerImages.length === 0 && Array.isArray(event?.gallery)) {
    bannerImages = event.gallery.filter(Boolean).map((preview) => ({
      file: null,
      preview: resolveImageUrl(preview),
      uploaded: false,
    }));
  }

  return {
    title: event?.title ?? '',
    description: event?.body ?? event?.description ?? '',
    date: startAtDate,
    time: event?.time ? normalizeTimeForInput(event?.time) : startAtTime,
    location: event?.location ?? '',
    country: event?.country ?? '',
    totalTickets: event?.totalSeats?.toString?.() ?? event?.totalTickets?.toString?.() ?? '',
    distance: event?.distance ?? '',
    ticketPrice: String(event?.price ?? event?.ticketPrice ?? ''),
    promoCode: event?.promoCode ?? '',
    promoDiscount: event?.promoDiscount ?? '',
    bannerImages,
    tShirtPrice: String(event?.tShirtPrice ?? ''),
    tShirtSizes: event?.tShirtSizes ?? '',
    tShirtImageUrl: event?.tShirtImageUrl ?? event?.tShirtImageUrl ?? '',
  };
};

const hasTShirtConfiguration = (event) => {
  if (!event) return false;

  const rawSizes = event?.tShirtSizes;
  const sizes = Array.isArray(rawSizes)
    ? rawSizes.filter(Boolean)
    : String(rawSizes || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

  const rawImages = Array.isArray(event?.tShirtImageUrl)
    ? event.tShirtImageUrl
    : event?.tShirtImageUrl
      ? [event.tShirtImageUrl]
      : [];

  const hasSizes = sizes.length > 0;
  const hasImages = rawImages.filter(Boolean).length > 0;
  const hasPrice = Number(event?.tShirtPrice || 0) > 0;

  return hasSizes || hasImages || hasPrice;
};

const inferIsFreeTShirt = (event) => {
  if (!event) return false;
  if (typeof event?.isFree === 'boolean') return event.isFree;
  if (!hasTShirtConfiguration(event)) return false;
  return Number(event?.tShirtPrice || 0) <= 0;
};

const extractPromoCodes = (response) => {
  const payload = response?.data ?? response;

  const list = (() => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.data?.data)) return payload.data.data;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.data?.items)) return payload.data.items;
    return [];
  })();

  return list
    .map((item) => String(item?.code || '').trim())
    .filter(Boolean)
    .filter((code, index, arr) => arr.indexOf(code) === index);
};

const toIsoDateTime = (dateValue, timeValue) => {
  if (!dateValue) return '';

  try {
    if (String(dateValue).includes('T')) {
      return dateValue;
    }
    const timeStr = timeValue ? String(timeValue).trim() : '12:00 AM';
    const combinedString = `${String(dateValue).trim()} ${timeStr}`;
    const parsedDate = new Date(combinedString);

    if (Number.isNaN(parsedDate.getTime())) {
      return '';
    }
    return parsedDate.toISOString();
  } catch (error) {
    console.error('Date conversion error:', error);
    return '';
  }
};

const getShortDescription = (value) =>
  String(value || '')
    .trim()
    .slice(0, 160);

const addHoursToIso = (isoString, hours = 1) => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  date.setHours(date.getHours() + hours);
  return date.toISOString();
};

const EventCreateView = () => {
  const location = useLocation();
  const [form, setForm] = useState(() => buildInitialForm(location.state?.event));
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [promoOptions, setPromoOptions] = useState([]);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoLoadError, setPromoLoadError] = useState('');
  const [tShirtImages, setTShirtImages] = useState(() => {
    const initialEvent = location.state?.event;
    const initialImages = Array.isArray(initialEvent?.tShirtImageUrl)
      ? initialEvent.tShirtImageUrl
      : initialEvent?.tShirtImageUrl
        ? [initialEvent.tShirtImageUrl]
        : [];
    return initialImages
      .filter(Boolean)
      .map((value) => resolveImageUrl(value))
      .filter(Boolean);
  });
  const [tShirtImagePaths, setTShirtImagePaths] = useState(() => {
    const initialEvent = location.state?.event;
    const initialImages = Array.isArray(initialEvent?.tShirtImageUrl)
      ? initialEvent.tShirtImageUrl
      : initialEvent?.tShirtImageUrl
        ? [initialEvent.tShirtImageUrl]
        : [];
    return initialImages.filter(Boolean);
  });
  const [tShirtUploading, setTShirtUploading] = useState(false);
  const [tShirtUploadError, setTShirtUploadError] = useState('');
  const [tShirtEnabled, setTShirtEnabled] = useState(() =>
    hasTShirtConfiguration(location.state?.event)
  );

  const [isFreeTShirt, setIsFreeTShirt] = useState(() => inferIsFreeTShirt(location.state?.event));
  const [selectedSizes, setSelectedSizes] = useState(() => {
    const initialForm = buildInitialForm(location.state?.event);
    if (initialForm.tShirtSizes) {
      return Array.isArray(initialForm.tShirtSizes)
        ? initialForm.tShirtSizes.filter(Boolean)
        : initialForm.tShirtSizes
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    }
    return [];
  });
  const fileRef = useRef(null);
  const tShirtFileRef = useRef(null);
  const navigate = useNavigate();
  const { setSignal } = useEventsList();

  const isEditing = Boolean(location.state?.event?.id);

  // If navigation provided an event (edit mode), ensure form updates when that event data arrives
  useEffect(() => {
    if (location.state?.event) {
      setForm(buildInitialForm(location.state.event));
      setTShirtEnabled(hasTShirtConfiguration(location.state.event));
      setIsFreeTShirt(inferIsFreeTShirt(location.state.event));
      setUploadedImages([]);
      const initialImages = Array.isArray(location.state.event?.tShirtImageUrl)
        ? location.state.event.tShirtImageUrl
        : location.state.event?.tShirtImageUrl
          ? [location.state.event.tShirtImageUrl]
          : [];
      setTShirtImages(
        initialImages
          .filter(Boolean)
          .map((value) => resolveImageUrl(value))
          .filter(Boolean)
      );
      setTShirtImagePaths(initialImages.filter(Boolean));
      if (location.state.event?.tShirtSizes) {
        const sizes = location.state.event.tShirtSizes;
        setSelectedSizes(
          Array.isArray(sizes)
            ? sizes.filter(Boolean)
            : sizes
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
        );
      }
    }
  }, [location.state?.event]);


  useEffect(() => {
    let isMounted = true;

    const fetchPromoCodes = async () => {
      setPromoLoading(true);
      setPromoLoadError('');

      try {
        const response = await request({
          method: 'GET',
          url: ENDPOINT.ORGANIZER.PROMO,
        });

        if (!isMounted) return;
        setPromoOptions(extractPromoCodes(response));
      } catch (error) {
        if (!isMounted) return;
        const message =
          error?.response?.data?.message || error?.message || 'Failed to load promo codes';
        setPromoLoadError(message);
      } finally {
        if (isMounted) {
          setPromoLoading(false);
        }
      }
    };

    fetchPromoCodes();

    return () => {
      isMounted = false;
    };
  }, []);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleTShirtImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['image/png', 'image/jpeg'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const rejected = [];
    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        rejected.push(`${file.name}: invalid type`);
        return false;
      }
      if (file.size > maxSize) {
        rejected.push(`${file.name}: too large`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      setTShirtUploadError(
        rejected.length > 0 ? rejected.join(', ') : 'Please select valid image files.'
      );
      return;
    }

    setTShirtUploading(true);
    setTShirtUploadError('');

    uploadEventImages(validFiles)
      .then((images) => {
        if (images && images.length > 0) {
          const nextImages = images.map((image) => resolveImageUrl(image)).filter(Boolean);
          setTShirtImages((prev) => [...prev, ...nextImages]);
          setTShirtImagePaths((prev) => [...prev, ...images]);
        }
      })
      .catch((error) => {
        const message =
          error?.response?.data?.message || error?.message || 'Failed to upload T-shirt images.';
        setTShirtUploadError(message);
      })
      .finally(() => {
        setTShirtUploading(false);
      });

    e.target.value = '';
  };

  const removeTShirtImage = (index) => {
    setTShirtImages((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
    setTShirtImagePaths((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const toggleTShirtSize = (size) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((s) => s !== size);
      } else {
        return [...prev, size];
      }
    });
  };

  const appendUploadedPreviews = (images) => {
    const nextImages = images
      .filter(Boolean)
      .map((value) => ({ file: null, preview: resolveImageUrl(value), uploaded: true }));

    if (nextImages.length === 0) return;

    setForm((prev) => {
      const storageMax = 10;
      const available = storageMax - prev.bannerImages.length;
      if (available <= 0) return prev;

      return {
        ...prev,
        bannerImages: [...prev.bannerImages, ...nextImages.slice(0, available)],
      };
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['image/png', 'image/jpeg'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const rejected = [];

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        rejected.push(`${file.name}: invalid type`);
        return false;
      }
      if (file.size > maxSize) {
        rejected.push(`${file.name}: too large`);
        return false;
      }
      return true;
    });

    const storageMax = 10;
    const available = storageMax - form.bannerImages.length;
    const limitedFiles = validFiles.slice(0, Math.max(available, 0));

    if (limitedFiles.length > 0) {
      setUploading(true);
      setUploadError('');

      uploadEventImages(limitedFiles)
        .then((images) => {
          // normalize returned image paths to resolved URLs
          const resolved = images.map((i) => resolveImageUrl(i));
          setUploadedImages((prev) => [...prev, ...resolved]);
          appendUploadedPreviews(images);
        })
        .catch((error) => {
          const message =
            error?.response?.data?.message || error?.message || 'Failed to upload selected images.';
          setUploadError(message);
        })
        .finally(() => {
          setUploading(false);
        });
    }

    if (rejected.length > 0) {
      // lightweight feedback; could be replaced with UI toast
      alert('Some files were skipped:\n' + rejected.join('\n'));
    }

    e.target.value = '';
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['image/png', 'image/jpeg'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const rejected = [];

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        rejected.push(`${file.name}: invalid type`);
        return false;
      }
      if (file.size > maxSize) {
        rejected.push(`${file.name}: too large`);
        return false;
      }
      return true;
    });

    const storageMax = 10;
    const available = storageMax - form.bannerImages.length;
    const limitedFiles = validFiles.slice(0, Math.max(available, 0));

    if (limitedFiles.length > 0) {
      setUploading(true);
      setUploadError('');

      uploadEventImages(limitedFiles)
        .then((images) => {
          const resolved = images.map((i) => resolveImageUrl(i));
          setUploadedImages((prev) => [...prev, ...resolved]);
          appendUploadedPreviews(images);
        })
        .catch((error) => {
          const message =
            error?.response?.data?.message || error?.message || 'Failed to upload dropped images.';
          setUploadError(message);
        })
        .finally(() => {
          setUploading(false);
        });
    }

    if (rejected.length > 0) {
      alert('Some files were skipped:\n' + rejected.join('\n'));
    }
  };

  const removeBannerImage = (index) => {
    setForm((prev) => {
      const removed = prev.bannerImages[index];
      if (removed?.file) {
        URL.revokeObjectURL(removed.preview);
      }

      // If the removed image was from newly uploaded images, remove it from uploadedImages by URL
      if (removed?.uploaded) {
        setUploadedImages((prevUploaded) => prevUploaded.filter((u) => u !== removed.preview));
      }

      return { ...prev, bannerImages: prev.bannerImages.filter((_, i) => i !== index) };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitError('');

    const startAt = toIsoDateTime(form.date, form.time);
    const normalizedBody = String(form.description || '').trim();
    const normalizedShort = getShortDescription(form.description);
    // prefer newly uploaded images; otherwise use existing banner previews
    // Merge: keep existing (non-uploaded) previews and append newly uploaded images
    const existingPreviews = form.bannerImages
      .filter((b) => !b.uploaded)
      .map((b) => b.preview)
      .filter(Boolean);
    const storedImages = [...existingPreviews, ...(uploadedImages || [])];
    const payload = {
      title: String(form.title || '').trim(),
      startAt,
      time: form.time,
      endAt: addHoursToIso(startAt, 1),
      location: String(form.location || '').trim(),
      distance: String(form.distance || '').trim(),
      price: Number(form.ticketPrice || 0),
      currency: 'USD',
      totalSeats: Number(form.totalTickets || 0),
      country: String(form.country || '').trim() || 'Trinidad & Tobago',
      body: normalizedBody,
      sortDescription: normalizedShort,
      shortDescription: normalizedShort,
      images: storedImages,
      promoCode: String(form.promoCode || '').trim(),
      tShirtIncluded: tShirtEnabled,
      isFree: tShirtEnabled ? isFreeTShirt : false,
      tShirtSizes: selectedSizes,
      tShirtPrice: tShirtEnabled && !isFreeTShirt ? Number(form.tShirtPrice || 0) : 0,
      tShirtImageUrl: tShirtEnabled ? tShirtImagePaths : [],
    };

    if (!tShirtEnabled) {
      payload.tShirtSizes = [];
    }

    if (!payload.startAt) {
      setSubmitError('Please provide a valid start date and time.');
      return;
    }

    if (!payload.title || !payload.location || !payload.body) {
      setSubmitError('Title, location, and description are required.');
      return;
    }

    if (uploading) {
      setSubmitError('Please wait for image upload to finish.');
      return;
    }

    if (storedImages.length === 0) {
      setSubmitError('Please upload at least one image before creating the event.');
      return;
    }

    setSubmitting(true);

    try {
      if (location.state?.event?.id) {
        // update existing event
        await updateEventService(location.state.event.id, payload);
      } else {
        await createEventService(payload);
      }
      setUploadedImages([]);
      setForm(() => buildInitialForm(null));
      // Pass refetch flag to trigger EventView to refetch event list
      setSignal((prev) => (prev ? `${prev}-refetch` : 'refetch'));
      navigate('/org/events', { state: { refetch: true } });
    } catch (error) {
      const validationErrors = error?.response?.data?.errors;
      const details = Array.isArray(validationErrors)
        ? validationErrors.join(', ')
        : validationErrors && typeof validationErrors === 'object'
          ? Object.values(validationErrors).flat().join(', ')
          : '';
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create event. Please try again.';
      setSubmitError(details ? `${message} (${details})` : message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/org/events');
  };

  return (
    <div className="bg-gray-50">
      <div className="mx-auto w-full">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {location.state?.event ? 'Edit Event' : 'Create New Event'}
            </h1>
            <p className="text-sm text-gray-500">
              {location.state?.event
                ? 'Update the details for your event'
                : 'Fill in the details to create your event'}
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {submitError ? (
              <div className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                {submitError}
              </div>
            ) : null}

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

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="Date" icon={Calendar}>
                <input
                  type="date"
                  value={form.date}
                  onChange={set('date')}
                  className={inputCls}
                  required
                />
              </Field>
              <Field label="Time" icon={Clock}>
                <input type="time" value={form.time} onChange={set('time')} className={inputCls} />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Location" icon={MapPin}>
                <input
                  type="text"
                  value={form.location}
                  onChange={set('location')}
                  placeholder="enter event location"
                  className={inputCls}
                />
              </Field>

              <Field label="Country" icon={MapPin}>
                <select value={form.country} onChange={set('country')} className={inputCls}>
                  <option value="">Select country</option>
                  <option value="Trinidad & Tobago">Trinidad & Tobago</option>
                  <option value="Guyana">Guyana</option>
                </select>
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              <Field label="Total Ticket" icon={Users}>
                <input
                  type="number"
                  value={form.totalTickets}
                  onChange={set('totalTickets')}
                  placeholder="Number Of seats"
                  className={inputCls}
                  min={0}
                  step={1}
                />
              </Field>
              <Field label="Distance" icon={Ruler}>
                <input
                  type="text"
                  value={form.distance}
                  onChange={set('distance')}
                  placeholder="e.g., 5km Trail race or 10km Relay"
                  className={inputCls}
                  step="any"
                />
              </Field>
              <Field label="Ticket Price in USD" icon={DollarSign}>
                <input
                  type="number"
                  value={form.ticketPrice}
                  onChange={set('ticketPrice')}
                  placeholder="Enter price in USD"
                  className={inputCls}
                  min={0}
                  step="any"
                />
              </Field>
            </div>

            <div className="">
              <Field label="Promo Code" icon={Tag}>
                <div className="flex flex-col gap-1.5">
                  <select value={form.promoCode} onChange={set('promoCode')} className={inputCls}>
                    <option value="">Select promo code</option>
                    {promoOptions.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                    {form.promoCode && !promoOptions.includes(form.promoCode) ? (
                      <option value={form.promoCode}>{form.promoCode}</option>
                    ) : null}
                  </select>
                  {promoLoading ? (
                    <p className="text-xs text-gray-500">Loading promo codes...</p>
                  ) : null}
                  {promoLoadError ? <p className="text-xs text-red-500">{promoLoadError}</p> : null}
                </div>
              </Field>

              {/* <Field label="Discount Percentage" icon={DollarSign}>
                <input
                  type="number"
                  value={form.promoDiscount}
                  onChange={set('promoDiscount')}
                  placeholder="Discount %"
                  className={inputCls}
                  min={0}
                  max={100}
                />
              </Field> */}
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-bold text-gray-800">Event Banner</span>

              {/* Thumbnails */}
              {form.bannerImages.length > 0 && (
                <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-6">
                  {(() => {
                    const displayMax = 6;
                    const total = form.bannerImages.length;
                    const toShow = form.bannerImages.slice(0, displayMax);
                    return toShow.map((img, i) => (
                      <div
                        key={i}
                        className="group relative overflow-hidden rounded-lg border border-gray-200"
                      >
                        <img
                          src={img.preview}
                          alt={`banner-${i}`}
                          className="h-24 w-full object-cover"
                        />
                        {i === displayMax - 1 && total > displayMax && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                            <span className="rounded-full bg-black/60 px-3 py-1 text-sm">
                              +{total - displayMax} more
                            </span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeBannerImage(i)}
                          className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ));
                  })()}
                </div>
              )}

              <div
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 py-8 transition hover:border-red-400 hover:bg-green-50/30 ${
                  form.bannerImages.length >= 10 ? 'opacity-60' : ''
                }`}
                onDrop={handleImageDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  multiple
                  disabled={form.bannerImages.length >= 10}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
                  <ImagePlus className="h-8 w-8 text-gray-400" />
                </div>
                <p className="mt-3 text-sm font-medium text-gray-700">
                  {form.bannerImages.length >= 10
                    ? '10 images added — storage full (showing 6)'
                    : form.bannerImages.length > 0
                      ? `${form.bannerImages.length} image(s) added — showing up to 6`
                      : 'Upload up to 10 images (6 shown)'}
                </p>
                <p className="mt-1 text-sm text-gray-400">PNG, JPG up to 10MB each</p>
                <p className="mt-1 text-center text-sm text-gray-400">
                  Select multiple files at once or drag and drop them here.
                </p>
                {uploading ? (
                  <p className="mt-2 text-xs text-green-600">Uploading images...</p>
                ) : null}
                {!uploading && uploadedImages.length ? (
                  <p className="mt-2 text-xs text-green-600">
                    {uploadedImages.length} image(s) uploaded and stored for event payload
                  </p>
                ) : null}
                {uploadError ? <p className="mt-2 text-xs text-red-500">{uploadError}</p> : null}
                <button
                  type="button"
                  disabled={form.bannerImages.length >= 10 || uploading || submitting}
                  onClick={() => fileRef.current?.click()}
                  className="mt-4 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
                >
                  Select Images
                </button>
              </div>
            </div>

            {/* T-Shirt Configuration */}
            <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-gray-900">T-Shirt Configuration</h3>
                <button
                  type="button"
                  aria-pressed={tShirtEnabled}
                  onClick={() => setTShirtEnabled((prev) => !prev)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                    tShirtEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                      tShirtEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {tShirtEnabled ? (
                <>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.9fr)]">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-semibold text-gray-700">T-Shirt Sizes</span>
                      <div className="flex flex-wrap gap-2">
                        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleTShirtSize(size)}
                            className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition ${
                              selectedSizes.includes(size)
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                      <div className="w-full sm:w-44">
                        <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2">
                          <span className="text-sm font-semibold text-gray-700">Is Free</span>
                          <button
                            type="button"
                            aria-pressed={isFreeTShirt}
                            onClick={() => setIsFreeTShirt((prev) => !prev)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              isFreeTShirt ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isFreeTShirt ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {!isFreeTShirt ? (
                        <div className="w-full sm:flex-1">
                          <Field label="T-Shirt Price" icon={DollarSign}>
                            <input
                              type="number"
                              value={form.tShirtPrice}
                              onChange={set('tShirtPrice')}
                              placeholder="Enter price ($)"
                              className={inputCls}
                              min={0}
                            />
                          </Field>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-semibold text-gray-700">T-Shirt Image</span>

                    {tShirtImages.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {tShirtImages.filter(Boolean).map((image, index) => (
                          <div
                            key={`${image}-${index}`}
                            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white"
                          >
                            <img
                              src={image}
                              alt={`T-shirt ${index + 1}`}
                              className="h-28 w-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeTShirtImage(index)}
                              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Area */}
                    <div
                      className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white py-6 transition hover:border-green-400 hover:bg-green-50/20"
                      onDrop={(e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files || []);
                        if (files.length > 0) {
                          handleTShirtImageUpload({ target: { files } });
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <input
                        ref={tShirtFileRef}
                        type="file"
                        accept="image/png,image/jpeg"
                        multiple
                        onChange={handleTShirtImageUpload}
                        className="hidden"
                      />
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <ImagePlus className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-700">
                        {tShirtImages.length > 0 ? 'Add more images' : 'Upload T-shirt images'}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">PNG, JPG up to 10MB</p>
                      {tShirtUploading ? (
                        <p className="mt-2 text-xs text-green-600">Uploading...</p>
                      ) : null}
                      {tShirtUploadError ? (
                        <p className="mt-2 text-xs text-red-500">{tShirtUploadError}</p>
                      ) : null}
                      <button
                        type="button"
                        disabled={tShirtUploading}
                        onClick={() => tShirtFileRef.current?.click()}
                        className="mt-3 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
                      >
                        Select Images
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-500">
                  Turn on the toggle to configure T-shirt sizes, price, and images.
                </p>
              )}
            </div>

            {/* <MultipleImageUpload images={images} setImages={setImages} maxImages={10} /> */}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border border-gray-200 bg-white px-6 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || uploading}
                className="rounded-lg bg-green-500 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
              >
                {submitting ? 'Submitting...' : isEditing ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventCreateView;
