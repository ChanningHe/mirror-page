"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FolderOpen } from "lucide-react";

interface MirrorCardProps {
  name: string;
  path: string;
  lastModified: string;
  index: number;
}

export function MirrorCard({ name, path, lastModified, index }: MirrorCardProps) {
  const formattedDate = new Date(lastModified).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  // Force native navigation, bypass Next.js router
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = path;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <a 
        href={path} 
        onClick={handleClick}
        className="block"
        rel="noopener noreferrer"
      >
        <Card className="h-full cursor-pointer overflow-hidden border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-card to-card/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-primary" />
                {name}
              </CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">
                Last updated: {formattedDate}
              </p>
              <p className="text-xs text-muted-foreground/70 font-mono">
                {path}
              </p>
            </div>
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
}

