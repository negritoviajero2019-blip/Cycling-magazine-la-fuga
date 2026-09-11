import { Container } from '@/components/ui/Container'
import { Skeleton } from '@/components/ui/Skeleton'

export default function Loading() {
  return (
    <Container className="py-6">
      <Skeleton className="h-[420px] w-full" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="aspect-[16/9] w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </Container>
  )
}
