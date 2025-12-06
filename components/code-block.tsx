"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  children: string;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Check if clipboard API is available
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(children);
      } else {
        // Fallback for browsers that don't support clipboard API
        const textArea = document.createElement("textarea");
        textArea.value = children;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Failed to copy text: ', err);
        }
        
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Extract language from className (format: language-xxx)
  const language = className?.replace(/language-/, "") || "";
  
  // Don't show language badge for shell/bash/sh
  const shouldShowLanguage = language && !["bash", "sh", "shell", "zsh"].includes(language.toLowerCase());

  return (
    <div className="relative group not-prose my-2">
      <div className="relative rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800/50">
        <pre className={`${className} !bg-transparent overflow-x-auto p-3 !m-0 text-left !leading-normal custom-scrollbar`}>
          <code className="text-sm font-mono text-zinc-100 !leading-normal block whitespace-pre align-top">{children}</code>
        </pre>
        
        {/* Copy button - positioned in top right */}
        <button
          onClick={handleCopy}
          type="button"
          className="absolute right-3 top-3 z-50 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium transition-all opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-zinc-100"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>

        {/* Language badge - only for programming languages */}
        {shouldShowLanguage && (
          <div className="absolute left-3 top-3 z-10">
            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-mono font-medium bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
              {language}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

