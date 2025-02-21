const DashedBackgroundLines = () => {
  return (
    <div className="absolute inset-y-0 flex items-stretch justify-center w-full pointer-events-none">
      <div className="relative w-full max-w-[1440px] mx-auto">
        <div className="absolute inset-y-0 left-0 border-l border-dashed border-gray-300" />
        <div className="absolute inset-y-0 right-0 border-l border-dashed border-gray-300" />
      </div>
    </div>
  );
};

export default DashedBackgroundLines;
