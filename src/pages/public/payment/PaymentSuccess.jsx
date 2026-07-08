import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { CalendarCheck2, CheckCircle2, Home, Loader2, AlertTriangle, Clock } from 'lucide-react';
import { API_CONFIG } from '../../../api/config/constants';

const STATUS = {
  LOADING: 'loading',
  SUCCESS: 'success',
  PENDING: 'pending',
  ERROR: 'error',
};

const PaymentSuccess = () => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();

  const batchId = searchParams.get('batchId') || searchParams.get('customReference');
  const eventNameFromUrl = searchParams.get('eventName');
  const quantity = Number(state?.quantity || 1);
  const missingBatchId = !batchId;

  const [status, setStatus] = useState(missingBatchId ? STATUS.SUCCESS : STATUS.LOADING);
  const [eventName, setEventName] = useState(eventNameFromUrl || '');
  const [errorMessage, setErrorMessage] = useState('');

  const hasConfirmed = useRef(false);

  useEffect(() => {
    if (!batchId) {
      return;
    }

    if (hasConfirmed.current) return;
    hasConfirmed.current = true;

    let cancelled = false;

    async function confirmFygaroPayment() {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/v1/payment/fygaro/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ batchId }),
        });

        const json = await res.json().catch(() => null);

        if (cancelled) return;

        if (res.ok && json?.success) {
          setStatus(STATUS.SUCCESS);
          if (json.data?.eventTitle) setEventName(json.data.eventTitle);
          return;
        }

        if (res.status === 404 || json?.message?.toLowerCase().includes('pending')) {
          setStatus(STATUS.PENDING);
          return;
        }

        setStatus(STATUS.ERROR);
        setErrorMessage(json?.message || 'We could not confirm your payment right now.');
      } catch {
        if (!cancelled) {
          setStatus(STATUS.ERROR);
          setErrorMessage('Network error while confirming your payment.');
        }
      }
    }

    confirmFygaroPayment();

    return () => {
      cancelled = true;
    };
  }, [batchId]);

  return (
    <section className="relative min-h-[calc(100vh-120px)] overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 -left-20 h-56 w-56 rounded-full bg-emerald-200/45 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-orange-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-10">
          {status === STATUS.LOADING && <LoadingState />}

          {status === STATUS.SUCCESS && (
            <SuccessState eventName={eventName} batchId={batchId} quantity={quantity} />
          )}

          {status === STATUS.PENDING && <PendingState eventName={eventName} batchId={batchId} />}

          {status === STATUS.ERROR && <ErrorState message={errorMessage} batchId={batchId} />}
        </div>
      </div>
    </section>
  );
};

function LoadingState() {
  return (
    <div className="py-6 text-center">
      <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Loader2 size={36} className="animate-spin" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 sm:text-3xl">Confirming your payment</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate-600 sm:text-base">
        This usually only takes a moment. Please don't close this page.
      </p>
    </div>
  );
}

function SuccessState({ eventName, batchId, quantity }) {
  return (
    <>
      <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200">
        <CheckCircle2 size={44} strokeWidth={2.4} />
      </div>

      <div className="text-center">
        <p className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase">
          Payment Successful
        </p>
        <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">You are booked in</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          Your payment was completed successfully
          {eventName && (
            <>
              {' '}
              for <span className="font-semibold text-slate-900">{eventName}</span>
            </>
          )}
          {batchId && <span className="text-slate-400"> (Ref: {batchId})</span>}.{' '}
          {quantity > 1 ? `${quantity} seats have` : 'Your seat has'} been reserved.
        </p>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          to="/user"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          <CalendarCheck2 size={18} />
          View Booking Events
        </Link>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
        >
          <Home size={18} />
          Go to Home Page
        </Link>
      </div>
    </>
  );
}

function PendingState({ eventName, batchId }) {
  return (
    <>
      <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-200">
        <Clock size={44} strokeWidth={2.4} />
      </div>

      <div className="text-center">
        <p className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-amber-700 uppercase">
          Payment Processing
        </p>
        <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">Almost there</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          We've received your payment
          {eventName && (
            <>
              {' '}
              for <span className="font-semibold text-slate-900">{eventName}</span>
            </>
          )}
          , and it's being confirmed by our payment provider. This can take a few minutes. You'll
          get a confirmation email as soon as it's done — no need to pay again.
          {batchId && (
            <span className="mt-2 block text-xs text-slate-400">Reference: {batchId}</span>
          )}
        </p>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          to="/user"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          <CalendarCheck2 size={18} />
          Check My Bookings
        </Link>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
        >
          <Home size={18} />
          Go to Home Page
        </Link>
      </div>
    </>
  );
}

function ErrorState({ message, batchId }) {
  return (
    <>
      <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-rose-500 to-red-500 text-white shadow-lg shadow-rose-200">
        <AlertTriangle size={44} strokeWidth={2.4} />
      </div>

      <div className="text-center">
        <p className="inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-rose-700 uppercase">
          Couldn't Confirm
        </p>
        <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
          {message || "We couldn't confirm your payment automatically."} If money was deducted from
          your card, please don't worry — contact us with your reference below and we'll sort it
          out.
          {batchId && (
            <span className="mt-2 block text-xs text-slate-400">Reference: {batchId}</span>
          )}
        </p>
      </div>

      <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          to="/contact"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          Contact Support
        </Link>

        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
        >
          <Home size={18} />
          Go to Home Page
        </Link>
      </div>
    </>
  );
}

export default PaymentSuccess;
