import { MirrorList } from "@/components/mirror-list";
import { ReadmePanel } from "@/components/readme-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import Aurora from "@/components/aurora";
import { config } from "@/lib/config";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Aurora Background Effect */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <Aurora
          colorStops={["#6366f1", "#8b5cf6", "#ec4899"]}
          amplitude={1.0}
          blend={0.5}
          speed={0.5}
        />
      </div>
      {/* Hero Section */}
      <section className="relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-12 md:py-16 z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1" />
            <ThemeToggle />
          </div>
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {config.siteTitle}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {config.siteSubtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          {/* Mirror List Section */}
          <section>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Available Mirrors
                </h2>
                <p className="text-sm text-muted-foreground">
                  Browse and access our mirror repositories
                </p>
              </div>
              <MirrorList />
            </div>
          </section>

          {/* README Section */}
          <section>
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  Documentation
                </h2>
                <p className="text-sm text-muted-foreground">
                  Important information and usage instructions
                </p>
              </div>
              <ReadmePanel />
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-12 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {config.siteTitle}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

