"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Globe, Activity } from "lucide-react";
import { motion } from "framer-motion";
import { OtherMirror } from "@/lib/static-data";

interface OtherMirrorsProps {
  mirrors?: OtherMirror[];
  title?: string;
  subtitle?: string;
}

interface MirrorStatus {
  latency: number | null;
  error: boolean;
  loading: boolean;
}

export function OtherMirrors({ mirrors, title, subtitle }: OtherMirrorsProps) {
  const [statuses, setStatuses] = useState<Record<string, MirrorStatus>>({});

  useEffect(() => {
    if (!mirrors) return;

    mirrors.forEach((mirror) => {
      // Initialize status
      setStatuses((prev) => ({
        ...prev,
        [mirror.url]: { latency: null, error: false, loading: true },
      }));

      const startTime = Date.now();
      let isCompleted = false;

      const handleFinish = (error: boolean) => {
        if (isCompleted) return;
        isCompleted = true;
        const endTime = Date.now();
        const latency = endTime - startTime;

        setStatuses((prev) => ({
          ...prev,
          [mirror.url]: {
            latency: error ? null : latency,
            error,
            loading: false,
          },
        }));
      };

      // Use fetch with no-cors mode to detect if server is reachable
      fetch(mirror.url, { 
        method: 'HEAD', 
        mode: 'no-cors',
        cache: 'no-store',
      })
      .then(() => handleFinish(false))
      .catch(() => handleFinish(true));

      setTimeout(() => {
        if (!isCompleted) {
          handleFinish(true);
        }
      }, 5000);
    });
  }, [mirrors]);

  if (!mirrors || mirrors.length === 0) {
    return null;
  }

  const getLatencyColor = (latency: number | null) => {
    if (latency === null) return "text-muted-foreground";
    if (latency < 200) return "text-green-500";
    if (latency < 800) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <section className="mt-8">
      <div className="flex items-center gap-3 mb-4 px-1">
        <Globe className="h-9 w-9 text-primary/80 shrink-0 stroke-[1.5]" />
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider leading-none">
            {title || "Other Mirror Sites"}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground/70 font-normal mt-1.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {mirrors.map((mirror, index) => {
          const status = statuses[mirror.url] || { latency: null, error: false, loading: true };
          
          return (
            <motion.a
              key={mirror.name}
              href={mirror.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="block h-full group relative"
            >
              <div className="h-full relative rounded-xl overflow-hidden bg-card/40 border border-primary/10 hover:border-primary/40 hover:bg-card/60 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                <CardContent className="p-3 flex items-center gap-3 h-full relative z-10">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs relative group-hover:scale-110 transition-transform duration-300">
                    {mirror.name.substring(0, 1)}
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${
                      status.loading ? "bg-gray-400 animate-pulse" : 
                      status.error ? "bg-red-500" : 
                      "bg-green-500"
                    }`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 justify-between">
                      <span className="font-medium text-sm truncate block group-hover:text-primary transition-colors">
                        {mirror.name}
                      </span>
                      <div className={`text-[10px] font-mono flex items-center gap-0.5 ${getLatencyColor(status.latency)}`}>
                        {!status.loading && !status.error && status.latency !== null && (
                          <>
                            <Activity className="h-2 w-2" />
                            {status.latency}ms
                          </>
                        )}
                        {status.error && <span className="text-destructive">N/A</span>}
                      </div>
                    </div>
                    {mirror.description && (
                      <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5 group-hover:text-foreground/80 transition-colors">
                        {mirror.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
