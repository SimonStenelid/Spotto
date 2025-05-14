import { cn } from "@/lib/utils"

interface CategoryProps {
  name: string
  isActive?: boolean
}

function Category({ name, isActive = false }: CategoryProps) {
  return (
    <button
      className={cn(
        "rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-foreground text-background"
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
    >
      {name}
    </button>
  )
}

const categories = [
  { name: "All", isActive: true },
  { name: "Guides" },
  { name: "Hidden Gems" },
  { name: "Local Tips" },
  { name: "App Updates" },
]

export function BlogHeader() {
  return (
    <section className="space-y-8 py-8">
      <div className="space-y-4">
        <p className="text-sm font-medium text-primary">THE SPOTTO BLOG</p>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
          Stories, tips, and guides for exploring Stockholm
        </h1>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Category key={category.name} {...category} />
        ))}
      </div>
    </section>
  )
} 