import {Skeleton} from "@/components/ui/skeleton"


/**
 * It will automatically show a skeleton loader
 * When fetching data for a server compoent
 * Or a suspense for a client component
 * @constructor
 */
function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl"/>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]"/>
        <Skeleton className="h-4 w-[200px]"/>
      </div>
    </div>
  )
}

export default SkeletonCard
