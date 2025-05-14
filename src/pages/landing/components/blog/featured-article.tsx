import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function FeaturedArticle() {
  return (
    <section className="grid gap-8 py-8 lg:grid-cols-2">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted lg:aspect-[4/3]">
        <img
          src="/images/blog/stockholm.png"
          alt="Stockholm cityscape"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
        />
      </div>
      <div className="flex flex-col justify-center space-y-6">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="rounded-full">
            Guides
          </Badge>
          <span className="text-sm text-muted-foreground">June 15, 2023</span>
        </div>
        <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
          The Ultimate 48-Hour Stockholm Itinerary
        </h2>
        <p className="text-lg text-muted-foreground">
          Make the most of your weekend in Stockholm with our carefully curated
          itinerary covering the city's must-see attractions, hidden gems, and
          local favorites.
        </p>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>EL</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">Emma Lindberg</p>
            <p className="text-sm text-muted-foreground">
              Local Guide & Travel Writer
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 font-semibold">
          Read Article <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  )
} 