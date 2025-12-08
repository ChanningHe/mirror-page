"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CodeBlock } from "@/components/code-block";

interface ReadmePanelProps {
  content: string;
  lastModified: string;
}

export function ReadmePanel({ content, lastModified }: ReadmePanelProps) {
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
