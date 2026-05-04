import { useState } from "react";

const NewSletter = () => {
  const [email, setEmail] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <section className="my-16 max-w-7xl mx-auto">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-medium text-gray-800">Subscribe now & get 20% off</h2>
        <p className="mt-2 text-sm text-gray-500">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-8 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
          />
          <button
            type="submit"
            className="rounded-md bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-900"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewSletter;
