const RadiusLoading = () => {
  return (
    <div className="flex justify-center items-center h-screen absolute top-0 left-0 right-0 bottom-0 bg-[#262626] bg-opacity-50 z-50">
      <div className="h-[80px] w-[80px] border-4 border-b-4 border-neutral-600 border-b-neutral-300 rounded-full animate-spin"></div>
    </div>
  );
};

export default RadiusLoading;
