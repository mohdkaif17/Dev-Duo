const SectionHeading = ({ children, accent, className = "" }) => {
  return (
    <div className={`mb-10 text-center flex flex-col items-center ${className}`}>
      <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 uppercase tracking-tight">
        {children} <span className="text-teal">{accent}</span>
      </h2>
      <div className="w-16 h-1 bg-teal rounded-full"></div>
    </div>
  );
};

export default SectionHeading;
