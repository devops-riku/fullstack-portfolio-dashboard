const shimmer = 'animate-pulse rounded-2xl bg-gray-100 dark:bg-white/5';

export const ProjectSkeleton = () => (
  <div className="space-y-4">
    <div className={`h-48 ${shimmer}`} />
    <div className={`h-4 w-2/3 ${shimmer}`} />
    <div className={`h-3 w-full ${shimmer}`} />
  </div>
);

export const ExperienceSkeleton = () => (
  <div className="space-y-3 pl-12">
    <div className={`h-5 w-1/2 ${shimmer}`} />
    <div className={`h-3 w-1/3 ${shimmer}`} />
    <div className={`h-3 w-full ${shimmer}`} />
  </div>
);
