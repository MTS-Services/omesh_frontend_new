import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CalendarDays, MapPin, ArrowLeft, Users, ShoppingBag, Plus, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { InputField, SelectField } from '../../../components/ui/forms';
import getFlagEmoji from '../../../components/common/FlagIcon';
import { resolveImageUrl } from '../../../utils/images';
import { request } from '../../../api/request';
import { ENDPOINT } from '../../../api/config/endpoints';
import { formatLocationWithCountry } from '../../../utils/eventUtils';
import TShirtSelector from '../../../components/ui/modals/TShirtSelector';

const PAYPAL_CLIENT_ID = String(import.meta.env.VITE_PAYPAL_CLIENT_ID || '').trim();

const emptyParticipant = () => ({
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  gender: '',
  age: '',
  dateOfBirth: '',
  tShirtSize: '',
  selectedTShirtSize: '',
  buyTShirt: false,
  tshirtId: null,
  tshirtName: null,
  teamClub: '',
});

const genderOptions = [
  { value: '', label: 'Select Gender' },
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
];

const getErrorMessage = (error, fallback) => {
  const message =
    error?.response?.data?.message || error?.response?.data?.error || error?.message || '';

  return String(message || fallback).trim();
};

const CheckoutView = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const event = state?.event ?? null;
  const quantity = state?.quantity ?? 1;

  const [participants, setParticipants] = useState(() =>
    Array.from({ length: quantity }, emptyParticipant)
  );
  const [promoCode, setPromoCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [platformFeePct, setPlatformFeePct] = useState(0);
  const [tshirtModalOpen, setTshirtModalOpen] = useState(false);
  const [selectedParticipantIndex, setSelectedParticipantIndex] = useState(null);
  const [paypalOrderId, setPaypalOrderId] = useState(
    String(state?.paypalOrderId || state?.orderId || '')
  );
  const [paypalOpen, setPaypalOpen] = useState(false);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');
  const [promoCheckedCode, setPromoCheckedCode] = useState('');

  useEffect(() => {
    const fetchPlatformSettings = async () => {
      try {
        const response = await request({
          method: 'GET',
          url: ENDPOINT.PUBLIC.PLATFORM_SETTINGS,
        });
        const feePct = response?.data?.platformFeePct ?? 0;

        setPlatformFeePct(Number(feePct));
      } catch {
        setPlatformFeePct(0);
      }
    };
    fetchPlatformSettings();
  }, []);

  useEffect(() => {
    if (paypalOrderId) return;

    const params = new URLSearchParams(window.location.search);
    const queryOrderId =
      params.get('paypalOrderId') || params.get('orderId') || params.get('token') || '';

    if (queryOrderId) {
      setPaypalOrderId(queryOrderId);
    }
  }, [paypalOrderId]);

  useEffect(() => {
    const normalizedInput = promoCode.trim().toUpperCase();
    const normalizedApplied = appliedPromoCode.trim().toUpperCase();
    if (normalizedInput !== normalizedApplied && promoApplied) {
      setPromoApplied(false);
    }
  }, [promoCode, appliedPromoCode, promoApplied]);

  const handleChange = (index, field) => (e) => {
    const value = e?.target?.value;
    const calculateDobFromAge = (age) => {
      const n = parseInt(age, 10);
      if (Number.isNaN(n) || n <= 0) return '';
      const today = new Date();
      const dob = new Date(today.getFullYear() - n, today.getMonth(), today.getDate());
      const yyyy = dob.getFullYear();
      const mm = String(dob.getMonth() + 1).padStart(2, '0');
      const dd = String(dob.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const calculateAgeFromDob = (dobStr) => {
      if (!dobStr) return '';
      const parts = dobStr.split('-');
      if (parts.length !== 3) return '';
      const [y, m, d] = parts.map((s) => parseInt(s, 10));
      if ([y, m, d].some((v) => Number.isNaN(v))) return '';
      const today = new Date();
      let age = today.getFullYear() - y;
      const hasHadBirthday =
        today.getMonth() + 1 > m || (today.getMonth() + 1 === m && today.getDate() >= d);
      if (!hasHadBirthday) age -= 1;
      return age >= 0 ? String(age) : '';
    };

    setParticipants((prev) => {
      const updated = [...prev];
      const current = { ...updated[index] };

      if (field === 'age') {
        current.age = value;
        const dob = calculateDobFromAge(value);
        current.dateOfBirth = dob;
      } else if (field === 'dateOfBirth') {
        current.dateOfBirth = value;
        const age = calculateAgeFromDob(value);
        current.age = age;
      } else {
        current[field] = value;
      }

      updated[index] = current;
      return updated;
    });
  };

  const handleTshirtSelect = (tshirtData) => {
    if (selectedParticipantIndex !== null) {
      setParticipants((prev) => {
        const updated = [...prev];
        updated[selectedParticipantIndex] = {
          ...updated[selectedParticipantIndex],
          tShirtSize: tshirtData.size,
          selectedTShirtSize: tshirtData.size,
          buyTShirt: true,
          tshirtId: tshirtData.tshirtId,
          tshirtName: tshirtData.tshirtName,
        };
        return updated;
      });
      toast.success(`T-shirt "${tshirtData.tshirtName}" added for size ${tshirtData.size}`);
    }
  };

  const subtotal = event ? Number(event.price || 0) * quantity : 0;
  const tshirtUnitPrice = Number(event?.tShirtPrice ?? 30);
  const selectedTShirtCount = participants.filter((p) => p.buyTShirt).length;
  const tShirtTotal = parseFloat((selectedTShirtCount * tshirtUnitPrice).toFixed(2));
  const chargeableTotal = parseFloat((subtotal + tShirtTotal).toFixed(2));
  const effectiveProcessingFeePct = event?.isFree ? 10 : platformFeePct;
  const processingFee = parseFloat(
    (chargeableTotal * (effectiveProcessingFeePct / 100)).toFixed(2)
  );
  const grandTotal = parseFloat((chargeableTotal + processingFee).toFixed(2));

  // Capacity calculation (same logic as EventCard)
  const availableSeats = event?.availableSeats ?? event?.seats ?? 0;
  const totalSeats = Number(event?.totalSeats) || 0;
  const soldSeats = Math.max(totalSeats - availableSeats, 0);
  const capacityPct = totalSeats > 0 ? Math.min((soldSeats / totalSeats) * 100, 100) : 0;
  const capacityBarColor =
    capacityPct >= 0.9 ? 'bg-red-400' : capacityPct >= 0.6 ? 'bg-amber-400' : 'bg-green-500';

  const normalizedTShirtSizes = Array.isArray(event?.tShirtSizes)
    ? event.tShirtSizes.filter(Boolean)
    : (event?.tShirtSizes?.trim?.()?.length ?? 0) > 0
      ? event.tShirtSizes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  // Map incoming size labels (e.g. "Extra Large", "2XL") to canonical short values
  const mapToCanonicalSize = (raw) => {
    if (!raw) return '';
    const s = String(raw).trim().toLowerCase();
    if (s === 'xs' || s.includes('extra small') || s === 'x-small') return 'XS';
    if (s === 's' || s === 'small') return 'S';
    if (s === 'm' || s === 'medium') return 'M';
    if (s === 'l' || s === 'large') return 'L';
    if (s === 'xl' || s === 'extra large' || s === 'x-large') return 'XL';
    if (s === 'xxl' || s === '2xl' || s.includes('2xl') || s.includes('double xl')) return 'XXL';
    const up = String(raw).trim().toUpperCase();
    return up;
  };

  const normalizedTShirtSizesCanonical = normalizedTShirtSizes
    .map(mapToCanonicalSize)
    .filter(Boolean);

  // Enable T-shirt flow when size data exists, even if image list is empty.
  const hasTShirtData = Boolean(event) && normalizedTShirtSizesCanonical.length > 0;

  const extractApprovalUrl = (response) => {
    const payload = response?.data ?? response;
    if (!payload || typeof payload !== 'object') return '';

    if (typeof payload.approvalUrl === 'string') return payload.approvalUrl;
    if (typeof payload.approveUrl === 'string') return payload.approveUrl;
    if (typeof payload.redirectUrl === 'string') return payload.redirectUrl;
    if (typeof payload.url === 'string') return payload.url;

    if (payload.data && typeof payload.data === 'object') {
      if (typeof payload.data.approvalUrl === 'string') return payload.data.approvalUrl;
      if (typeof payload.data.approveUrl === 'string') return payload.data.approveUrl;
      if (typeof payload.data.redirectUrl === 'string') return payload.data.redirectUrl;
      if (typeof payload.data.url === 'string') return payload.data.url;
    }

    const links = Array.isArray(payload.links)
      ? payload.links
      : Array.isArray(payload.data?.links)
        ? payload.data.links
        : [];

    const approveLink = links.find(
      (item) =>
        typeof item?.rel === 'string' &&
        item.rel.toLowerCase() === 'approve' &&
        typeof item?.href === 'string'
    );

    return approveLink?.href || '';
  };

  const extractPaypalOrderId = (response) => {
    const payload = response?.data ?? response;
    if (!payload || typeof payload !== 'object') return '';
    const candidates = [
      payload.paypalOrderId,
      payload.orderId,
      payload.orderID,
      payload.id,
      payload?.data?.orderId,
      payload?.data?.orderID,
      payload?.data?.id,
    ];

    const found = candidates.find((value) => typeof value === 'string' && value.trim().length > 0);
    return found ? found.trim() : '';
  };

  const validateParticipants = () => {
    const allValid = participants.every((p) => {
      const normalizedGender = String(p.gender || '')
        .trim()
        .toUpperCase();
      const hasRequired =
        p.firstName?.trim() &&
        p.lastName?.trim() &&
        p.email?.trim() &&
        p.phoneNumber?.trim() &&
        normalizedGender &&
        p.age &&
        p.dateOfBirth?.trim();

      if (!hasRequired) {
        toast.error('Required fields');
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(p.email)) {
        toast.error('Invalid email');
        return false;
      }

      const dateStr = p.dateOfBirth.trim();
      const mmddyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const isoRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
      if (!isoRegex.test(dateStr) && !mmddyyyy.test(dateStr)) {
        toast.error('Invalid date');
        return false;
      }

      if (!['MALE', 'FEMALE'].includes(normalizedGender)) {
        toast.error('Invalid gender');
        return false;
      }

      if (p.buyTShirt && !String(p.selectedTShirtSize || p.tShirtSize || '').trim()) {
        toast.error('Select size');
        return false;
      }

      return true;
    });

    return allValid;
  };

  const buildRegistrationPayload = (source = 'ONLINE') => {
    const payload = {
      eventId: event.id,
      source,
      platformFee: platformFeePct,
      totalPrice: grandTotal,
      // include couponCode at top-level when a promo is applied
      couponCode: promoApplied ? String(appliedPromoCode || '').trim() : '',
      participants: participants.map((p) => {
        const rawDob = p.dateOfBirth.trim();
        const isoRegex = /^(\d{4})-(\d{2})-(\d{2})$/;
        const mmddyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        let isoDateOfBirth = '';
        if (isoRegex.test(rawDob)) {
          isoDateOfBirth = rawDob;
        } else if (mmddyyyy.test(rawDob)) {
          const [month, day, year] = rawDob.split('/');
          isoDateOfBirth = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
        const gender = String(p.gender || '')
          .trim()
          .toUpperCase();
        const selectedSize = String(p.selectedTShirtSize || p.tShirtSize || '').trim();
        const shouldAttachTShirt = Boolean(selectedSize && p.buyTShirt);

        const participantPayload = {
          firstName: p.firstName.trim(),
          lastName: p.lastName.trim(),
          email: p.email.trim().toLowerCase(),
          phone: p.phoneNumber.trim(),
          gender,
          age: parseInt(p.age, 10),
          dateOfBirth: isoDateOfBirth,
          location: event.location || '',
          teamClub: p.teamClub?.trim() || '',
          status: source === 'MANUAL_ADD' ? 'PAID' : 'PENDING_PAYMENT',
        };

        if (shouldAttachTShirt) {
          participantPayload.selectedTShirtSize = selectedSize;
          participantPayload.buyTShirt = true;
        }

        // Attach couponCode to each participant only when a promo code was applied successfully
        if (promoApplied && appliedPromoCode) {
          participantPayload.couponCode = String(appliedPromoCode).trim();
        }

        return participantPayload;
      }),
    };
    return payload;
  };

  const handlePayPalCreateOrder = async () => {
    if (!validateParticipants()) {
      throw new Error('Participant validation failed');
    }

    if (!event?.id) {
      toast.error('Missing event');
      throw new Error('Event information is missing');
    }

    setIsSubmitting(true);
    try {
      const registrationResponse = await request({
        method: 'POST',
        url: ENDPOINT.PUBLIC.EVENTS.REGISTRATION,
        data: buildRegistrationPayload(),
      });

      const orderId = extractPaypalOrderId(registrationResponse);
      if (!orderId) {
        const approvalUrl = extractApprovalUrl(registrationResponse);
        if (approvalUrl) {
          window.location.href = approvalUrl;
        }
        throw new Error('PayPal order ID not found in registration response');
      }

      setPaypalOrderId(orderId);
      return orderId;
    } catch (error) {
      const message = getErrorMessage(error, 'Init failed');
      toast.error(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayPalApprove = async (data) => {
    const orderId = String(data?.orderID || paypalOrderId || '').trim();
    if (!orderId) {
      toast.error('Missing order');
      return;
    }

    setIsSubmitting(true);
    try {
      await request({
        method: 'POST',
        url: ENDPOINT.PUBLIC.PAYMENT.CAPTURE,
        data: { paypalOrderId: orderId },
      });

      toast.success('Payment complete');
      setPromoCode('');
      setParticipants(Array.from({ length: quantity }, emptyParticipant));
      setPaypalOrderId('');
      setPromoApplied(false);
      setAppliedPromoCode('');
      setPromoCheckedCode('');
      setPaypalOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      const message = getErrorMessage(error, 'Capture failed');
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayPalError = (error) => {
    const message = error?.message || 'Checkout failed';
    toast.error(message);
  };

  const handleApplyPromoCode = async () => {
    // console.log('▶️ handleApplyPromoCode START');
    const code = promoCode.trim().toUpperCase();
    // console.log('  Code:', code);
    if (!code) {
      toast.error('Enter code');
      return;
    }

    const participantEmail = participants
      .map((p) =>
        String(p.email || '')
          .trim()
          .toLowerCase()
      )
      .find((email) => email.length > 0);

    console.log('  Email:', participantEmail);
    if (!participantEmail) {
      toast.error('Enter email');
      return;
    }

    const applyPromoSuccessState = () => {
      // console.log('✅ applyPromoSuccessState called');
      setPromoApplied(true);
      setAppliedPromoCode(code);
      setPromoCheckedCode(code);
      setPaypalOpen(false);
      setPaypalOrderId('');
      toast.success('Promo applied');
    };

    setIsApplyingPromo(true);
    try {
      console.log('📡 Sending POST /promo/apply');
      const response = await request({
        method: 'POST',
        url: ENDPOINT.ORGANIZER.PROMO_APPLY,
        data: {
          code,
          emails: [participantEmail],
          eventId: event.id,
        },
      });

      const payload = response;

      const payloadMessage = String(payload?.message || '').toLowerCase();
      const payloadStatusCode = Number(payload?.statusCode || 0);

      console.log('  Payload message:', payloadMessage);
      console.log('  Payload statusCode:', payloadStatusCode);

      const isValid = Boolean(
        payload?.success === true || payload?.valid === true || payload?.isValid === true
      );

      if (!isValid) {
        setPromoApplied(false);
        setAppliedPromoCode('');
        setPromoCheckedCode(code);
        toast.error(payload?.message || 'Invalid code');
        return;
      }

      console.log('✅ Promo validation passed via main endpoint');
      applyPromoSuccessState();
    } catch (error) {
      console.error('❌ Error in handleApplyPromoCode:', error);
      const statusCode = Number(
        error?.response?.status || error?.response?.data?.statusCode || error?.status || 0
      );
      console.log('  HTTP Status:', statusCode);

      const backendMessage = String(error?.response?.data?.message || '').toLowerCase();
      console.log('  Backend message:', backendMessage);

      setPromoApplied(false);
      setAppliedPromoCode('');
      setPromoCheckedCode(code);
      const message = getErrorMessage(error, 'Apply failed');
      console.log('  Final error message:', message);
      toast.error(message);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleConfirm = async () => {
    const allValid = validateParticipants();

    if (!allValid) return;

    if (!event?.id) {
      toast.error('Missing event');
      return;
    }

    const normalizedCode = promoCode.trim().toUpperCase();
    const normalizedApplied = appliedPromoCode.trim().toUpperCase();
    const normalizedChecked = promoCheckedCode.trim().toUpperCase();
    const promoInputExists = normalizedCode.length > 0;
    const promoIsAppliedForCurrentCode =
      promoApplied && normalizedApplied.length > 0 && normalizedCode === normalizedApplied;
    const promoWasCheckedForCurrentCode =
      normalizedChecked.length > 0 && normalizedChecked === normalizedCode;

    if (promoInputExists && !promoIsAppliedForCurrentCode && !promoWasCheckedForCurrentCode) {
      toast.error('Apply code');
      return;
    }

    if (promoApplied) {
      setIsSubmitting(true);
      try {
        await request({
          method: 'POST',
          url: ENDPOINT.PUBLIC.EVENTS.REGISTRATION,
          data: buildRegistrationPayload('MANUAL_ADD'),
        });

        toast.success('Registration submitted successfully with promo code (manual payment).');
        setPromoCode('');
        setAppliedPromoCode('');
        setPromoApplied(false);
        setPaypalOpen(false);
        setPaypalOrderId('');
        setParticipants(Array.from({ length: quantity }, emptyParticipant));
        setPromoCheckedCode('');
        navigate('/', { replace: true });
        return;
      } catch (error) {
        const message = getErrorMessage(error, 'Submit failed');
        toast.error(message);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    console.log('All participants valid, proceeding to PayPal flow');
    setPaypalOpen(true);

    // try {
    //   if (paypalOrderId) {
    //     await request({
    //       method: 'POST',
    //       url: ENDPOINT.PUBLIC.PAYMENT.CAPTURE,
    //       data: { paypalOrderId },
    //     });
    //   }

    //   const registrationResponse = await request({
    //     method: 'POST',
    //     url: ENDPOINT.PUBLIC.EVENTS.REGISTRATION,
    //     data: buildRegistrationPayload(),
    //   });

    //   const approvalUrl = extractApprovalUrl(registrationResponse);
    //   if (approvalUrl) {
    //     window.location.href = approvalUrl;
    //     return;
    //   }

    //   toast.success('Registration submitted successfully!');
    //   // Reset form or redirect if needed
    //   setPromoCode('');
    //   setParticipants(Array.from({ length: quantity }, emptyParticipant));
    // } catch (error) {
    //   const message =
    //     error?.response?.data?.message || error?.message || 'Failed to submit registration';
    //   toast.error(message);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="bg-gray-50 py-0 md:py-8">
      <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-0">
        {/* Header */}
        {/* <div className="mb-8 flex items-center gap-3 bg-white p-6 md:rounded-lg md:shadow-sm">
          <Link
            to={event ? `/events/${event.id}` : '/events'}
            className="text-gray-400 hover:text-green-600"
          >
            <ArrowLeft size={10} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Registration</h1>
            <p className="mt-1 text-sm text-gray-600">Fill in participant details and select T-shirts</p>
          </div>
        </div> */}

        <div className="grid grid-cols-1 gap-0.5 md:gap-8 lg:grid-cols-3">
          {/* ── Main Form ── */}
          <div className="space-y-6 lg:col-span-2">
            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {participants.map((p, i) => (
                <div key={i} className="overflow-hidden rounded-lg bg-white shadow-sm">
                  {/* Participant Header */}
                  <div className="flex items-center justify-between bg-[#FFFBEB] px-6 py-2.5">
                    <h2 className="text-base font-semibold text-gray-900">Participant {i + 1}</h2>
                    {p.tshirtName && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        <ShoppingBag size={12} className="mr-1" />
                        {p.tshirtName} - Size {p.tShirtSize}
                      </span>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-5 p-6">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InputField
                        label="First Name"
                        placeholder="John"
                        value={p.firstName}
                        onChange={handleChange(i, 'firstName')}
                        required
                      />
                      <InputField
                        label="Last Name"
                        placeholder="Doe"
                        value={p.lastName}
                        onChange={handleChange(i, 'lastName')}
                        required
                      />
                    </div>

                    {/* Email & Phone Number */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <InputField
                        label="Email"
                        type="email"
                        placeholder="john@example.com"
                        value={p.email}
                        onChange={handleChange(i, 'email')}
                        required
                      />
                      <InputField
                        label="Phone Number"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={p.phoneNumber}
                        onChange={handleChange(i, 'phoneNumber')}
                        required
                      />
                    </div>

                    {/* Gender, Age, Date of Birth */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <SelectField
                        label="Gender"
                        options={genderOptions}
                        value={p.gender}
                        onChange={handleChange(i, 'gender')}
                        required
                      />
                      <InputField
                        label="Age"
                        type="number"
                        placeholder="25"
                        value={p.age}
                        onChange={handleChange(i, 'age')}
                        required
                      />
                      <InputField
                        label="Date of Birth"
                        type="date"
                        value={p.dateOfBirth}
                        onChange={handleChange(i, 'dateOfBirth')}
                        required
                      />
                    </div>

                    {/* T-Shirt Selection */}
                    {hasTShirtData && (
                      <div className=" ">
                        <div className="flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedParticipantIndex(i);
                              setTshirtModalOpen(true);
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-600 active:scale-[0.98]"
                          >
                            <Plus size={16} />
                            Add T-Shirt
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Team / Club (optional) */}
                    <InputField
                      label="Team / Club (optional)"
                      placeholder="Team name..."
                      value={p.teamClub}
                      onChange={handleChange(i, 'teamClub')}
                    />
                  </div>
                </div>
              ))}
            </form>
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 overflow-hidden rounded-xl bg-white shadow-sm">
              {/* Event Card */}
              {event && (
                <>
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden bg-linear-to-br from-green-400 to-blue-500">
                    <img
                      src={resolveImageUrl(event.image)}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                    {event.flag && (
                      <div className="absolute top-3 right-3 overflow-hidden rounded shadow">
                        {getFlagEmoji(event.flag)}
                      </div>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="border-b border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900">{event.title}</h3>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CalendarDays size={14} className="text-green-500" />
                        <span>
                          {event.date} · {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin size={14} className="text-green-500" />
                        <span>
                          {formatLocationWithCountry(event.location, event.flag || event.country)}
                        </span>
                      </div>
                    </div>

                    {/* Capacity Bar */}
                    {totalSeats > 0 && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users size={12} className="text-green-500" />
                            Capacity
                          </span>
                          <span className="font-semibold text-gray-800">
                            {soldSeats}/{totalSeats}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                          <div
                            className={`h-full rounded-full transition-all ${capacityBarColor}`}
                            style={{
                              width: `${capacityPct}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* T-Shirt Price */}
              {hasTShirtData && (
                <div className="border-b border-gray-100 px-6 py-4">
                  <h3 className="mb-3 text-sm font-bold text-gray-900">T-Shirt Price</h3>

                  <div className="space-y-2 text-sm">
                    {participants.filter((p) => p.tshirtId).length > 0 ? (
                      participants.map(
                        (p, idx) =>
                          p.tshirtId && (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-gray-600"
                            >
                              <span>
                                Participant {idx + 1} ({p.tshirtName} - Size {p.tShirtSize})
                              </span>
                              <span className="font-semibold text-green-600">
                                ${tshirtUnitPrice.toFixed(2)}
                              </span>
                            </div>
                          )
                      )
                    ) : (
                      <p className="text-xs text-gray-400">No T-shirts added yet</p>
                    )}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="border-b border-gray-100 px-6 py-4">
                {/* <h3 className="text-sm font-bold text-gray-900 mb-3">Price Summary</h3> */}

                <div className="space-y-3 text-sm">
                  {event && (
                    <div className="flex items-center justify-between text-gray-600">
                      <span>
                        Events: {event.price?.toLocaleString() || '0'} × {quantity}
                      </span>
                      <span className="font-semibold text-green-600">
                        ${subtotal.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-gray-600">
                    <span>Processing Fee ({effectiveProcessingFeePct}%)</span>
                    <span className="font-semibold text-green-600">
                      ${processingFee.toFixed(2)}
                    </span>
                  </div>

                  {hasTShirtData && (
                    <div className="flex items-center justify-between text-gray-600">
                      {/* <span>T-Shirt Price ({selectedTShirtCount})</span> */}
                      {/* <span className="font-semibold text-green-600">${tShirtTotal.toFixed(2)}</span> */}
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-green-600">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Promo Code */}
              <div className="border-b border-gray-100 p-6">
                <label className="mb-3 block text-sm font-semibold text-gray-900">Promo Code</label>
                <div className="flex items-stretch gap-2">
                  <input
                    type="text"
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code..."
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromoCode}
                    disabled={isApplyingPromo || isSubmitting}
                    className="rounded-lg bg-green-500 px-4 font-medium text-white transition"
                  >
                    {isApplyingPromo ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                {promoApplied && (
                  <p className="mt-2 text-xs font-medium text-green-600">
                    Promo applied. Confirm will submit as manual payment.
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="p-6">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="mb-3 w-full rounded-lg bg-green-500 py-3 font-semibold text-white shadow-md transition hover:bg-green-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm '}
                </button>

                <Link to="/privacy" className="block">
                  <p className="text-center text-xs text-gray-600 underline">
                    By confirming, you agree to our terms and conditions
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {paypalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900">Complete Payment</h3>
              <button
                type="button"
                onClick={() => setPaypalOpen(false)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close payment modal"
              >
                <X size={16} />
              </button>
            </div>

            <PayPalScriptProvider
              options={{
                clientId: PAYPAL_CLIENT_ID,
                currency: 'USD',
              }}
            >
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  color: 'gold',
                  shape: 'rect',
                  label: 'pay',
                }}
                createOrder={handlePayPalCreateOrder}
                onApprove={handlePayPalApprove}
                onError={handlePayPalError}
              />
            </PayPalScriptProvider>

            <button
              type="button"
              onClick={() => setPaypalOpen(false)}
              className="mt-4 w-full text-xs text-gray-500 underline transition-colors hover:text-yellow-500"
            >
              Cancel and edit details
            </button>
          </div>
        </div>
      ) : null}

      {/* T-Shirt Selector Modal */}
      <TShirtSelector
        isOpen={tshirtModalOpen}
        onClose={() => {
          setTshirtModalOpen(false);
          setSelectedParticipantIndex(null);
        }}
        onSelect={handleTshirtSelect}
        participantName={
          selectedParticipantIndex !== null
            ? `${participants[selectedParticipantIndex]?.firstName} ${participants[selectedParticipantIndex]?.lastName}`.trim() ||
              `Participant ${selectedParticipantIndex + 1}`
            : ''
        }
        tshirtImages={
          Array.isArray(event?.tShirtImageUrl)
            ? event.tShirtImageUrl.map(resolveImageUrl)
            : Array.isArray(event?.tShirtImageUrl)
              ? event.tShirtImageUrl.map(resolveImageUrl)
              : event?.tShirtImageUrl
                ? [resolveImageUrl(event.tShirtImageUrl)]
                : []
        }
        tshirtSizes={normalizedTShirtSizesCanonical}
        tshirtPrice={event?.tShirtPrice ?? 30}
      />
    </div>
  );
};

export default CheckoutView;
