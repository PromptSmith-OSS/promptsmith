import SkeletonCard from "@/components/custom-ui/skeleton-card";

/**
 * It will automatically show a skeleton loader
 * When fetching data for a server compoent
 * Or a suspense for a client component
 * @constructor
 */
function Loading() {
  return (
    <SkeletonCard/>
  )
}

export default Loading
