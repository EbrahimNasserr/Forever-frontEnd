import Title from "../components/share/Title.jsx";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Truck } from "lucide-react";

const About = () => {
  const reasons = [
    {
      icon: ShieldCheck,
      title: "Trusted Quality",
      text: "Every product is carefully selected to ensure quality, durability, and style you can rely on.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      text: "We focus on quick dispatch and smooth delivery so your order reaches you on time.",
    },
    {
      icon: Sparkles,
      title: "Customer First",
      text: "From easy returns to responsive support, we design every step around your experience.",
    },
  ];

  return (
    <div className="my-12 max-w-7xl mx-auto space-y-14">
      <Title title1="About" title2="Us" />

      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-black/5"
        >
          <img
            src={assets.about_img}
            alt="About Forever"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Our Story
          </p>
          <h3 className="mt-2 text-3xl font-semibold text-gray-900">
            Style, comfort, and confidence in one place.
          </h3>
          <p className="mt-5 text-sm leading-7 text-gray-600">
            Forever Commerce is built for modern shoppers who want fashion that
            feels good and looks great. We combine curated collections with a
            simple shopping experience, so you can discover new favorites with
            ease.
          </p>
          <p className="mt-4 text-sm leading-7 text-gray-600">
            Our mission is to make online shopping enjoyable, dependable, and
            personal. From product selection to checkout and delivery, each step
            is crafted to be smooth and trustworthy.
          </p>
        </motion.div>
      </div>

      <section>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-6 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Why Choose Us
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-gray-900">
            Built to make shopping better
          </h3>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
        >
          {reasons.map((item) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="inline-flex rounded-xl bg-gray-900 p-2 text-white">
                  <Icon className="size-4" />
                </div>
                <h4 className="mt-4 text-base font-semibold text-gray-900">
                  {item.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {item.text}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
};

export default About;
