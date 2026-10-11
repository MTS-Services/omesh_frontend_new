import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { confirmSponsorPayment } from '../../../features/public/sponsor/sponsorService';

const SponsorPaymentResult = () => {
  const [searchParams] = useSearchParams();

  const orderId = searchParams.get('order_id') || searchParams.get('orderId');
  const transactionId = searchParams.get('transaction_id') || searchParams.get('transactionId');
  const wipayStatus = searchParams.get('status');
  const hash = searchParams.get('hash');
  const wipayMessage = searchParams.get('message');

  const isSuccessReturn = Boolean(orderId) && String(wipayStatus).toLowerCase() === 'success';

  const [result, setResult] = useState(
    isSuccessReturn
      ? { status: 'loading' }
      : {
          status: 'error',
          message: wipayMessage || 'The payment was not completed. No charge was made.',
        }
  );

  useEffect(() => {
    if (!isSuccessReturn) return;

    let cancelled = false;

    confirmSponsorPayment({
      order_id: orderId,
      transaction_id: transactionId,
      status: wipayStatus,
      hash,
      message: wipayMessage,
    })
      .then((response) => {
        if (!cancelled) setResult({ status: 'success', data: response?.data });
      })
      .catch((error) => {
        if (!cancelled) {
          setResult({
            status: 'error',
            message: error?.message || 'We could not confirm your payment right now.',
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isSuccessReturn, orderId, transactionId, wipayStatus, hash, wipayMessage]);

  const data = result.data;
  const isDonation = data?.supportType === 'DONATION';

  return (
    <section className="bg-white px-4 py-14 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white px-8 py-12 text-center shadow-sm">
        {result.status === 'loading' && (
          <>
            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <Loader2 className="h-8 w-8 animate-spin" />
            </span>
            <h1 className="mb-3 text-2xl font-bold text-gray-900">Confirming your payment</h1>
            <p className="text-sm text-gray-600">Please don't close this page.</p>
          </>
        )}

        {result.status === 'success' && (
          <>
            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-500">
              <CheckCircle2 className="h-9 w-9" />
            </span>
            <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">Thank You!</h1>
            <p className="mb-2 text-sm text-gray-600 sm:text-base">
              Your {isDonation ? 'donation' : 'sponsorship'}
              {data?.amount != null && ` of $${Number(data.amount).toFixed(2)}`} has been received.
              We truly appreciate your support.
            </p>
            {orderId && <p className="mb-8 text-xs text-gray-400">Reference: {orderId}</p>}
          </>
        )}

        {result.status === 'error' && (
          <>
            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500">
              <AlertTriangle className="h-8 w-8" />
            </span>
            <h1 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
              Payment Not Completed
            </h1>
            <p className="mb-2 text-sm text-gray-600 sm:text-base">{result.message}</p>
            {orderId && <p className="mb-8 text-xs text-gray-400">Reference: {orderId}</p>}
          </>
        )}

        {result.status !== 'loading' && (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="rounded-lg bg-[#1FB356] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#188a47]"
            >
              Back to Home
            </Link>
            {result.status === 'error' && (
              <Link
                to="/sponsor"
                className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Try Again
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SponsorPaymentResult;
