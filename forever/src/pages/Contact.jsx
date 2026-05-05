import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import Title from "../components/share/Title.jsx";
import { Mail, MapPin, PhoneCall } from "lucide-react";

const Contact = () => {
  const contactCards = [
    {
      icon: MapPin,
      title: "Visit our office",
      text: "54709 Willms Station, Suite 350, Washington, USA",
    },
    {
      icon: PhoneCall,
      title: "Call us",
      text: "(415) 555-0132",
    },
    {
      icon: Mail,
      title: "Email us",
      text: "support@forever.com",
    },
  ];

  return (
    <div className="my-12 max-w-7xl mx-auto space-y-14">
      <Title title1="Contact" title2="Us" />

      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-black/5"
        >
          <img
            src={assets.contact_img}
            alt="Contact Forever"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Get in touch
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">
            We’re here to help
          </h3>
          <p className="mt-3 text-sm leading-7 text-gray-600">
            Questions about your order, products, or returns? Reach out to our
            team and we’ll get back to you as quickly as possible.
          </p>

          <div className="mt-6 space-y-3">
            {contactCards.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-gray-200 p-3"
                >
                  <div className="mt-0.5 rounded-lg bg-gray-900 p-2 text-white">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="mt-6 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Contact Support
          </button>
        </motion.div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="rounded-2xl border border-gray-200 bg-linear-to-r from-gray-900 to-gray-800 p-7 text-white sm:p-9"
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
          Need faster response?
        </p>
        <h3 className="mt-2 text-2xl font-semibold">
          Chat with our support team anytime.
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/80">
          We usually respond within a few hours. For urgent issues, include your
          order number so we can assist you faster.
        </p>
      </motion.section>
    </div>
  );
};

export default Contact;
