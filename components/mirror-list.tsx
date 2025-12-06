"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, FolderOpen, ExternalLink, Clock, Package, Database } from "lucide-react";
import { motion } from "framer-motion";
import { SingleGlassIcon } from "@/components/glass-icon";

interface Mirror {
  name: string;
  path: string;
  lastModified: string;
}

interface MirrorListResponse {
  success: boolean;
  mirrors?: Mirror[];
  count?: number;
  error?: string;
  message?: string;
}

export function MirrorList() {
  const [mirrors, setMirrors] = useState<Mirror[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMirrors() {
      try {
        const response = await fetch("/api/mirrors");
        const data: MirrorListResponse = await response.json();

        if (data.success && data.mirrors) {
          setMirrors(data.mirrors);
        } else {
          setError(data.message || "Failed to load mirrors");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchMirrors();
  }, []);

  if (loading) {
    return (
      <Card className="p-4">
        <div className="space-y-3 max-h-[600px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-10 w-10 text-destructive mb-3" />
          <h3 className="text-lg font-semibold mb-1">Failed to Load Mirrors</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </Card>
    );
  }

  if (mirrors.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <FolderOpen className="h-10 w-10 text-muted-foreground mb-3" />
          <h3 className="text-lg font-semibold mb-1">No Mirrors Found</h3>
          <p className="text-sm text-muted-foreground">
            No mirror directories are available at this time.
          </p>
        </div>
      </Card>
    );
  }

  // Force native navigation
  const handleClick = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = path;
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
              onClick={handleClick(mirror.path)}
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
                  <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(mirror.lastModified).toLocaleDateString("zh-CN")}
                  </span>
                </div>
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

