const Skeleton = ({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  ...props 
}) => {
  const baseStyles = 'animate-pulse bg-slate-200 dark:bg-slate-700 rounded';
  
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded',
  };
  
  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };
  
  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
      {...props}
    />
  );
};

// Pre-built skeleton components
export const SkeletonCard = () => (
  <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-md">
    <Skeleton variant="rectangular" height="200px" className="w-full" />
    <div className="p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <Skeleton variant="text" width="70%" height="24px" />
        <Skeleton variant="rectangular" width="60px" height="28px" className="rounded-lg" />
      </div>
      <Skeleton variant="text" width="50%" height="16px" />
      <div className="flex gap-2">
        <Skeleton variant="rectangular" width="80px" height="24px" className="rounded-md" />
        <Skeleton variant="text" width="100px" height="16px" />
      </div>
    </div>
  </div>
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === lines - 1 ? '60%' : '100%'}
        height="16px"
      />
    ))}
  </div>
);

export default Skeleton;
