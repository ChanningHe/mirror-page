import { MirrorList } from "@/components/mirror-list";
import { ReadmePanel } from "@/components/readme-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { OtherMirrors } from "@/components/other-mirrors";
import Aurora from "@/components/aurora";
import { getMirrors, getReadme, getSiteConfig } from "@/lib/static-data";

export const dynamic = "force-static";

export default async function Home() {
  // Fetch data at build time
  const mirrors = await getMirrors();
  const readme = await getReadme();
  const siteConfig = await getSiteConfig();

  return (
    <main className="min-h-screen bg-background relative overflow-hidden flex flex-col">
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
      <section className="relative overflow-hidden z-10 flex-shrink-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative container mx-auto px-4 py-8 md:py-12 z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1" />
            <ThemeToggle />
          </div>
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {siteConfig.title}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {siteConfig.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area - Optimized Layout */}
      <div className="container mx-auto px-4 py-4 relative z-10 flex-grow">
        {/* Top Split: MirrorList (Sidebar/Left) + Readme (Main/Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Sidebar: Available Mirrors (Left/Top on Mobile) */}
          <div className="lg:col-span-4 order-1 lg:order-1 flex flex-col gap-6 sticky top-4">
             <section>
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {siteConfig.mirror_list_title || "Mirrors"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {siteConfig.mirror_list_subtitle || "Direct access"}
                  </p>
                </div>
                <MirrorList mirrors={mirrors} />
              </div>
            </section>
          </div>

          {/* Main Content: Documentation (Right/Bottom on Mobile) */}
          <div className="lg:col-span-8 order-2 lg:order-2 flex flex-col gap-6">
            <section className="h-full">
               <div className="space-y-4 h-full">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      {siteConfig.documentation_title || "Documentation"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {siteConfig.documentation_subtitle || "Important information and usage instructions"}
                    </p>
                  </div>
                </div>
                <ReadmePanel content={readme.content} lastModified={readme.lastModified} />
              </div>
            </section>
          </div>

        </div>

        {/* Bottom Section: Other Mirrors */}
        {siteConfig.other_mirrors && siteConfig.other_mirrors.length > 0 && (
          <div className="mt-8 pt-8 border-t border-primary/10">
            <OtherMirrors 
              mirrors={siteConfig.other_mirrors} 
              title={siteConfig.other_mirrors_title}
              subtitle={siteConfig.other_mirrors_subtitle}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-12 relative z-10 flex-shrink-0">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} {siteConfig.title}</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
