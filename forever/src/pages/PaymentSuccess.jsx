import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Loader } from "lucide-react";
import { toast } from "react-toastify";
import { useVerifyCheckoutSessionQuery } from "../features/payment/paymentApi";
import { useCart } from "../features/cart/useCart";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { clear: clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verified, setVerified] = useState(false);
  const [verifyError, setVerifyError] = useState(false);

  const { data, isLoading, isError, error } = useVerifyCheckoutSessionQuery(
    sessionId,
    { skip: !sessionId },
  );

  useEffect(() => {
    if (!sessionId) {
      setVerifyError(true);
      return;
    }

    if (isError) {
      setVerifyError(true);
      const message =
        error?.data?.message || error?.error || "Payment verification failed";
      toast.error(message);
      return;
    }

    if (data) {
      if (data.paid) {
        // Payment successful - verified by Stripe
        setVerified(true);
        clearCart();
        toast.success("Payment successful! Order confirmed.");

        const timer = setTimeout(() => {
          navigate("/orders", { replace: true });
        }, 3500);

        return () => clearTimeout(timer);
      } else if (data.orderId) {
        // Payment not yet confirmed but order exists - may be pending
        setVerified(true);
        clearCart();
        toast.info("Order created. Payment verification in progress.");

        const timer = setTimeout(() => {
          navigate("/orders", { replace: true });
        }, 3500);

        return () => clearTimeout(timer);
      } else {
        // No orderId - verification actually failed
        setVerifyError(true);
        toast.error("Payment could not be verified");
      }
    }
  }, [data, isError, error, sessionId, clearCart, navigate]);

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader className="mx-auto size-12 animate-spin text-gray-900" />
          <p className="mt-4 text-sm font-semibold text-gray-900">
            Verifying your payment…
          </p>
        </motion.div>
      ) : verified ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
          >
            <CheckCircle className="mx-auto size-16 text-emerald-600" />
          </motion.div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
            Payment successful!
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Thank you for your purchase. Your order has been confirmed and will
            be processed shortly.
          </p>

          <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <p className="text-sm text-emerald-800">
              <span className="font-semibold">Confirmation email</span> has been
              sent to your email address.
            </p>
            <p className="mt-2 text-sm text-emerald-700">
              You will be redirected to your orders page in a few seconds…
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/orders", { replace: true })}
            className="mt-8 inline-flex rounded-2xl bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            View orders
          </button>
        </motion.div>
      ) : verifyError ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center rounded-full bg-red-100 p-3">
            <div className="text-2xl">❌</div>
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
            Payment verification failed
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            We couldn't verify your payment. Please contact support if you
            believe this is an error.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="inline-flex rounded-2xl bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Back to cart
            </button>
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="inline-flex rounded-2xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              View orders
            </button>
          </div>
        </motion.div>
      ) : null}
    </section>
  );
};

export default PaymentSuccess;
