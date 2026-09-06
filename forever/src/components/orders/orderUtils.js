/* ─── Date / currency / address formatters ─────────────────── */

export const formatDate = (value) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatCurrency = (value) =>
  `$${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
  })}`;

export const formatAddress = (addr) => {
  if (!addr) return null;
  return {
    name: [addr.firstName, addr.lastName].filter(Boolean).join(" "),
    line1: addr.street || addr.address || "",
    line2: [addr.city, addr.state, addr.zipCode, addr.country]
      .filter(Boolean)
      .join(", "),
    phone: addr.phone || "",
  };
};

export const humanPaymentMethod = (method) => {
  if (!method) return "Cash on Delivery";
  return method
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/* ─── Order status filter ──────────────────────────────────── */

export const matchesFilter = (order, filter) => {
  if (filter === "all") return true;
  const s = (order.status || "").toLowerCase();
  if (filter === "transit") return s.includes("ship") || s.includes("transit");
  if (filter === "delivered") return s.includes("deliver");
  if (filter === "atelier")
    return (
      s.includes("process") ||
      s.includes("tailor") ||
      s.includes("pending") ||
      s.includes("alloc")
    );
  return true;
};

/* ─── Build fulfilment timeline steps from a status string ─── */

export const buildTimelineSteps = (status = "") => {
  const s = status.toLowerCase();
  return [
    {
      title: "Order Confirmed",
      desc: "Payment settled and order record created.",
      done: true,
    },
    {
      title: "Atelier Allocation",
      desc: "Fabric and components assigned to your commission.",
      done:
        s.includes("process") ||
        s.includes("alloc") ||
        s.includes("ship") ||
        s.includes("deliver"),
    },
    {
      title: "Hand-Crafting & QC",
      desc: "Piece inspected and prepared for dispatch.",
      done: s.includes("ship") || s.includes("deliver"),
    },
    {
      title: "Courier Dispatched",
      desc: "Parcel collected and en route to your address.",
      done: s.includes("ship") || s.includes("deliver"),
    },
    {
      title: "Delivered",
      desc: "Piece handed over at your specified address.",
      done: s.includes("deliver"),
    },
  ];
};
