import { assets } from "../../assets/assets.js";

const OurPolicy = () => {
  const policies = [
    {
      icon: assets.exchange_icon,
      title: "Easy Exchange Policy",
      description: "We offer hassle free exchange policy",
    },
    {
      icon: assets.quality_icon_icon,
      title: "7 Days Return Policy",
      description: "We provide 7 days free return policy",
    },
    {
      icon: assets.support_img_icon,
      title: "Best customer support",
      description: "We provide 24/7 customer support",
    },
  ];

  return (
    <section className="my-12">
      <div className="flex flex-col sm-flex-row justify-around gap-12 sm-gap-2 text-center py-12 text-xs sm:text-sm md:text-base text-gray-700">
        {policies.map((policy) => (
          <div key={policy.title}>
            <img
              src={policy.icon}
              className="w-12 m-auto mb-5"
              alt={`${policy.title} icon`}
            />
            <h3 className="font-semibold">{policy.title}</h3>
            <p className="text-gray-400">{policy.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurPolicy;
