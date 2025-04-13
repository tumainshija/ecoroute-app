'use client';

import React from 'react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * A very simple markdown renderer that converts basic markdown syntax to HTML.
 * For a production app, you'd likely want to use a proper markdown library.
 */
export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const processedContent = React.useMemo(() => {
    // Split content into lines for processing
    const lines = content.split('\n');
    const result: JSX.Element[] = [];
    
    let inList = false;
    let listItems: JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      // Handle headings
      if (line.startsWith('# ')) {
        result.push(<h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>);
      } 
      else if (line.startsWith('## ')) {
        result.push(<h2 key={index} className="text-xl font-semibold mt-5 mb-3">{line.substring(3)}</h2>);
      } 
      else if (line.startsWith('### ')) {
        result.push(<h3 key={index} className="text-lg font-semibold mt-4 mb-2">{line.substring(4)}</h3>);
      } 
      // Handle lists
      else if (line.startsWith('- ')) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(<li key={`li-${index}`}>{formatInlineMarkdown(line.substring(2))}</li>);
      } 
      // Handle blockquotes
      else if (line.startsWith('> ')) {
        result.push(
          <blockquote key={index} className="pl-4 border-l-4 border-gray-300 text-gray-600 italic my-3">
            {formatInlineMarkdown(line.substring(2))}
          </blockquote>
        );
      }
      // Empty line
      else if (line.trim() === '') {
        // If we were in a list, finish it
        if (inList) {
          result.push(<ul key={`ul-${index}`} className="list-disc pl-5 my-3 space-y-1">{listItems}</ul>);
          inList = false;
        }
        result.push(<br key={index} />);
      } 
      // Regular paragraph
      else {
        // If we were in a list, finish it
        if (inList) {
          result.push(<ul key={`ul-${index}`} className="list-disc pl-5 my-3 space-y-1">{listItems}</ul>);
          inList = false;
        }
        result.push(<p key={index} className="my-2">{formatInlineMarkdown(line)}</p>);
      }
    });
    
    // If we ended with an unfinished list
    if (inList) {
      result.push(<ul key="ul-last" className="list-disc pl-5 my-3 space-y-1">{listItems}</ul>);
    }
    
    return result;
  }, [content]);
  
  function formatInlineMarkdown(text: string): React.ReactNode {
    // Process bold formatting
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Process italic formatting
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Process inline code formatting
    formattedText = formattedText.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Process links [text](url)
    formattedText = formattedText.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-600 hover:text-emerald-700">$1</a>');
    
    // Return as HTML
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  }
  
  return (
    <div className={`prose max-w-none ${className}`}>
      {processedContent}
    </div>
  );
} 