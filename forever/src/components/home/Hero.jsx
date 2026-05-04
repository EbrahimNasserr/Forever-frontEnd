import { assets } from "../../assets/assets.js";
const Hero = () => {
  return (
    <section className="flex flex-col border border-gray-400 items-center justify-center sm:flex-row max-w-7xl mx-auto">
      {/* left side */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className=" text-[#414141]">
          <div className=" flex items-center gap-2">
            <span className="w-8 md-w-10 h-[1.5px] bg-[#414141]"></span>
            <p className="font-medium text-sm md:text-base">
              Our Best Sellers
            </p>
          </div>
          <h1 className="prata-regular text-4xl font-bold leading-relaxed md:text-5xl">
            Latest arrivals
          </h1>
          <div className="flex items-center gap-2">
            <button className="uppercase font-semibold text-sm md:text-base">Shop Now</button>
            <span className="bg-[#414141] w-8 h-[1.5px] md:w-10"></span>
          </div>
        </div>
      </div>
      {/* right side */}
      <div className="w-1/2">
        <img
          src={assets.hero_img}
          alt="hero"
          className="w-full h-full object-cover bg-center"
        />
      </div>
    </section>
  );
};

export default Hero;
