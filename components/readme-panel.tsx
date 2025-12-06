"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "@/lib/config";
import { CodeBlock } from "@/components/code-block";

interface ReadmeResponse {
  success: boolean;
  content?: string;
  lastModified?: string;
  error?: string;
  message?: string;
}

export function ReadmePanel() {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastModified, setLastModified] = useState<string>("");

  useEffect(() => {
    async function fetchReadme() {
      try {
        const headers: HeadersInit = {};
        if (lastModified) {
          headers["If-Modified-Since"] = lastModified;
        }

        const response = await fetch("/api/readme", { headers });

        // Handle 304 Not Modified
        if (response.status === 304) {
          return;
        }

        const data: ReadmeResponse = await response.json();

        if (data.success && data.content) {
          setContent(data.content);
          if (data.lastModified) {
            setLastModified(data.lastModified);
          }
          setError(null);
        } else {
          setError(data.message || "Failed to load README");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchReadme();

    // Set up polling for updates
    const interval = setInterval(fetchReadme, config.readmeUpdateInterval);

    return () => clearInterval(interval);
  }, [lastModified]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            README
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Error Loading README
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden flex flex-col max-h-[700px] bg-card/80 backdrop-blur-md border-2 relative shadow-xl">
      <CardHeader className="bg-gradient-to-br from-primary/15 via-primary/10 to-transparent flex-shrink-0 border-b border-primary/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
        <CardTitle className="flex items-center gap-2 text-base relative z-10">
          <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold">Documentation</span>
          {lastModified && (
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              Last updated: {new Date(lastModified).toLocaleDateString("zh-CN")}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 overflow-y-auto flex-1 relative custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={content}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="prose prose-sm prose-zinc dark:prose-invert max-w-none
                       prose-headings:text-foreground prose-headings:font-bold prose-headings:tracking-tight
                       prose-h1:text-2xl prose-h1:pb-2 prose-h1:border-b prose-h1:border-primary/20 prose-h1:mb-4
                       prose-h2:text-xl prose-h2:mt-6 prose-h2:mb-3 prose-h2:text-primary
                       prose-h3:text-lg prose-h3:mt-4 prose-h3:mb-2
                       prose-p:text-foreground prose-p:leading-relaxed prose-p:text-sm prose-p:mb-3
                       prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:transition-colors
                       prose-strong:text-foreground prose-strong:font-semibold prose-strong:text-primary/90
                       prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-semibold prose-code:before:content-none prose-code:after:content-none prose-code:border prose-code:border-primary/20
                       prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:text-muted-foreground prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
                       prose-ul:text-foreground prose-ol:text-foreground prose-ul:text-sm prose-ol:text-sm
                       prose-li:text-foreground prose-li:marker:text-primary/70 prose-li:my-1
                       prose-table:text-foreground prose-table:text-sm prose-table:border prose-table:border-border prose-table:rounded-lg prose-table:overflow-hidden
                       prose-th:bg-primary/10 prose-th:text-foreground prose-th:font-semibold prose-th:border-border
                       prose-td:border-border prose-td:py-2
                       prose-hr:border-primary/20 prose-hr:my-6
                       prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-border"
          >
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                pre: ({ children }) => {
                  // Check if the child is a code element
                  // @ts-ignore - Children of pre in MD is usually a code element
                  if (children?.type === 'code' || (children?.props && children.props.className)) {
                    // Extract code content and language
                    // @ts-ignore
                    const codeProps = children.props;
                    const className = codeProps.className || '';
                    const content = String(codeProps.children).replace(/\n$/, '');
                    
                    return (
                      <CodeBlock className={className}>
                        {content}
                      </CodeBlock>
                    );
                  }
                  return <pre>{children}</pre>;
                },
                code: ({ className, children, ...props }) => {
                  // Inline code style
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

