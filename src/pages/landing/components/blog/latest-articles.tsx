import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ArticleCardProps {
  image: string
  category: string
  date: string
  title: string
  description: string
}

function ArticleCard({
  image,
  category,
  date,
  title,
  description,
}: ArticleCardProps) {
  return (
    <article className="flex flex-col space-y-6">
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-muted">
        <div className="absolute right-3 top-3 rounded-full bg-black/80 px-3 py-1 text-xs text-white z-10">
          5 min
        </div>
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="rounded-full text-xs">
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground">{date}</span>
        </div>
        <h3 className="text-xl font-semibold leading-tight">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        <button className="flex items-center gap-2 text-sm font-semibold">
          Read Article <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  )
}

const latestArticles = [
  {
    image: "/images/blog/sushi-resturant.png",
    category: "Hidden Gems",
    date: "June 10, 2023",
    title: "10 Underrated Restaurants in Stockholm That Locals Love",
    description:
      "Discover the culinary treasures that tourists often miss but locals can't get enough of, from cozy cafés to innovative bistros.",
  },
  {
    image: "/images/blog/sushi-resturant.png",
    category: "Hidden Gems",
    date: "June 10, 2023",
    title: "Stockholm's Best Sushi Places",
    description:
      "Discover the culinary treasures that tourists often miss but locals can't get enough of, from cozy cafés to innovative bistros.",
  },
  {
    image: "/images/blog/stockholm.png",
    category: "Hidden Gems",
    date: "June 10, 2023",
    title: "Best Arcades in Stockholm This Summer",
    description:
      "Discover the culinary treasures that tourists often miss but locals can't get enough of, from cozy cafés to innovative bistros.",
  },
]

export function LatestArticles() {
  return (
    <section className="space-y-8 py-8">
      <h2 className="text-2xl font-bold">Latest Articles</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {latestArticles.map((article) => (
          <ArticleCard key={article.title} {...article} />
        ))}
      </div>
    </section>
  )
} 