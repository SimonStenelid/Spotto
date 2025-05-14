import { Suspense } from "react"
import { BlogHeader } from "./components/blog/blog-header"
import { FeaturedArticle } from "./components/blog/featured-article"
import { LatestArticles } from "./components/blog/latest-articles"

export function Blog() {
  return (
    <main className="min-h-screen w-full bg-background">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <BlogHeader />
          <FeaturedArticle />
          <LatestArticles />
        </Suspense>
      </div>
    </main>
  )
} 