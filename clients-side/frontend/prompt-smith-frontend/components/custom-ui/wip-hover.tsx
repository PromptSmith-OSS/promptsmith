import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


const WIPHover = (
  {children, description = 'Work in progress, follow us to get notified'}: { title?: string, description?: string, children?: React.ReactNode }
) => (
  <HoverCard>
    <HoverCardTrigger>{children}</HoverCardTrigger>
    <HoverCardContent>
      {description}
    </HoverCardContent>
  </HoverCard>

)

export default WIPHover
