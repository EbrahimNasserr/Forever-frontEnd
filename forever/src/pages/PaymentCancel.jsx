import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
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
          <AlertCircle className="mx-auto size-16 text-amber-600" />
        </motion.div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900 sm:text-4xl">
          Payment cancelled
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Your payment was cancelled. No charges have been made to your card.
        </p>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="text-sm text-amber-800">
            Your cart items are still saved. You can continue shopping or try
            checking out again.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/cart", { replace: true })}
            className="inline-flex rounded-2xl bg-gray-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Return to cart
          </button>
          <button
            type="button"
            onClick={() => navigate("/collection")}
            className="inline-flex rounded-2xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            Continue shopping
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default PaymentCancel;
