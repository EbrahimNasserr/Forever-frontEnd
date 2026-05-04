const Title = ({ title1, title2 }) => {
  return (
    <div className="inline-flex justify-center w-full items-center gap-2 mb-3">
      <span className="w-8 md-w-10 h-[1.5px] bg-[#414141]"></span>

      <h2 className="prata-regular text-4xl font-medium leading-relaxed md:text-5xl">
        {title1}
      </h2>
      <h2 className="prata-regular text-4xl font-bold leading-relaxed md:text-5xl">
        {title2}
      </h2>
      <span className="w-8 md-w-10 h-[1.5px] bg-[#414141]"></span>
    </div>
  );
};

export default Title;
