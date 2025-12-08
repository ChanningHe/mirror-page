"use client";

import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen, ExternalLink, Clock, Package, Database, Info } from "lucide-react";
import { motion } from "framer-motion";
import { SingleGlassIcon } from "@/components/glass-icon";
import { Mirror } from "@/lib/static-data";

interface MirrorListProps {
  mirrors: Mirror[];
}

export function MirrorList({ mirrors }: MirrorListProps) {
  if (mirrors.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <FolderOpen className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold mb-1">No Mirrors Found</h3>
          <p className="text-sm text-muted-foreground">
            No mirrors configured in mirrors.toml.
          </p>
        </div>
      </Card>
    );
  }

  // Handle click for external or internal links
  const handleClick = (path: string, isExternal?: boolean) => (e: React.MouseEvent) => {
    // If it's an external link, let the default behavior happen (or open in new tab if desired)
    // If it's internal, we might want to force native navigation for consistent experience with SSG
    if (!isExternal) {
      e.preventDefault();
      window.location.href = path;
    }
  };

  return (
    <Card className="overflow-hidden bg-card/80 backdrop-blur-md border-2 relative shadow-xl">
      <CardHeader className="bg-gradient-to-br from-primary/15 via-primary/10 to-transparent border-b border-primary/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl translate-y-1/2 translate-x-1/2" />
        <CardTitle className="flex items-center gap-2 text-base relative z-10">
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <Database className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold">Available Mirrors</span>
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            {mirrors.length} {mirrors.length === 1 ? "source" : "sources"}
          </span>
        </CardTitle>
      </CardHeader>
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        <div className="divide-y">
          {mirrors.map((mirror, index) => (
            <motion.a
              key={mirror.name}
              href={mirror.path}
              target={mirror.is_external ? "_blank" : undefined}
              rel={mirror.is_external ? "noopener noreferrer" : undefined}
              onClick={handleClick(mirror.path, mirror.is_external)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="flex items-center gap-4 px-4 py-4 hover:bg-accent/50 transition-colors group cursor-pointer"
            >
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                <div className="scale-[0.5]">
                  <SingleGlassIcon 
                    icon={getIconForMirror(mirror.name)} 
                    color={getColorForMirror(mirror.name)}
                    label=""
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm truncate">
                    {mirror.name}
                  </h3>
                  <ExternalLink className={`h-3 w-3 text-muted-foreground flex-shrink-0 transition-opacity ${mirror.is_external ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                </div>
                {mirror.description && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1 truncate">
                    <Info className="h-3 w-3 flex-shrink-0" />
                    <span>{mirror.description}</span>
                  </div>
                )}
                {mirror.lastModified && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(mirror.lastModified).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                )}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </Card>
  );
}

// Helper function to get appropriate icon for mirror name
function getIconForMirror(name: string) {
  const iconMap: Record<string, React.ReactElement> = {
    debian: <Package className="w-full h-full" />,
    ubuntu: <Package className="w-full h-full" />,
    docker: <Package className="w-full h-full" />,
    proxmox: <Package className="w-full h-full" />,
    tailscale: <Package className="w-full h-full" />,
    truenas: <Package className="w-full h-full" />,
  };
  
  return iconMap[name.toLowerCase()] || <FolderOpen className="w-full h-full" />;
}

// Helper function to get color for mirror name with more variety
function getColorForMirror(name: string): string {
  const allColors = ['blue', 'purple', 'red', 'indigo', 'orange', 'green', 'pink', 'cyan', 'yellow', 'teal', 'violet', 'rose'];
  
  // Use name as seed for consistent but random-looking colors
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash = hash & hash;
  }
  
  const index = Math.abs(hash) % allColors.length;
  return allColors[index];
}
