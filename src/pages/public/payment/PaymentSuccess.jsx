import React, { useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { CalendarCheck2, CheckCircle2, Home } from 'lucide-react';
import { API_CONFIG } from '../../../api/config/constants';

const PaymentSuccess = () => {
  const { state } = useLocation();

  const [searchParams] = useSearchParams();
  const batchId = searchParams.get('batchId');
  const eventName = searchParams.get('eventName');
  // const eventName = state?.eventName || 'your event';
  // const batchId = state?.batchId || 'N/A';

  const quantity = Number(state?.quantity || 1);

  useEffect(() => {
    async function confirmFygaroPayment(batchId) {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/v1/payment/fygaro/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ batchId }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Payment confirmation failed');
      }

      return json.data;
    }

    if (batchId) {
      confirmFygaroPayment(batchId);
    }
  }, [state, batchId]);

  return (
    <section className="relative min-h-[calc(100vh-120px)] overflow-hidden bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-10 -left-20 h-56 w-56 rounded-full bg-emerald-200/45 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-64 w-64 rounded-full bg-cyan-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-orange-200/35 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl">
        <div className="rounded-3xl border border-white/80 bg-white/90 p-7 shadow-[0_20px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-10">
          <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-200">
            <CheckCircle2 size={44} strokeWidth={2.4} />
          </div>

          <div className="text-center">
            <p className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-[0.16em] text-emerald-700 uppercase">
              Payment Successful
            </p>
            <h1 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
              You are booked in
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">
              Your payment was completed successfully for{' '}
              <span className="font-semibold text-slate-900">
                {eventName} {batchId && `(Batch ID: ${batchId})`}
              </span>
              .{quantity > 1 ? ` ${quantity} seats have` : ' Your seat has'} been reserved.
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
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
