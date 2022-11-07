const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="animate-spin inline-block w-10 h-10 border-[3px] border-current border-t-transparent text-yellow-500 rounded-full"
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export { Loading };
