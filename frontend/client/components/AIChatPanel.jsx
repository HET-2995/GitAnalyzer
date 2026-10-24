import React, { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Send, Paperclip, Trash2, Bot, FolderOpen, User, FileCode, X, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRepo } from "../context/RepoContext";
import { api } from "../api/api";
import TextareaAutosize from 'react-textarea-autosize';

const CopyButton = ({ text, className }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className={cn("p-1.5 bg-card/80 hover:bg-card border border-border rounded-md text-muted-foreground transition-all", className)}>
      {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
};

const ChatMessage = React.memo(({ message }) => {
  return (
    <div className="flex gap-4 group">
      {/* Avatar */}
      <div className={cn("w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-1 border shadow-sm",
        message.role === "user" ? "bg-background border-border text-foreground" : "bg-primary/10 border-primary/20 text-primary"
      )}>
        {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2 overflow-hidden min-w-0">
        {message.role === "assistant" ? (
          <div className="prose prose-sm md:prose-base max-w-none text-foreground leading-relaxed break-words">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <div className="relative group rounded-md overflow-hidden my-4 border border-border text-sm">
                      <CopyButton text={String(children)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono border border-border" {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">{message.content}</p>
        )}

        {/* Source Chips Example */}
        {message.role === "assistant" && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 mt-2 border-t border-border/20">
            {message.sources.map((source, idx) => (
              <span key={idx} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-card border border-border/50 text-[11px] font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-colors shadow-sm">
                <FileCode className="w-3 h-3" /> {source.filename || source.file || "Source"}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

const ChatInput = ({ onSend, isTyping }) => {
  const [input, setInput] = useState("");

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  const handleSendClick = () => {
    if (!input.trim() || isTyping) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="p-4 bg-background border-t border-border shrink-0">
      <div className="relative flex flex-col bg-card border border-border rounded-xl focus-within:border-primary/50 focus-within:bg-card transition-all shadow-sm">
        <TextareaAutosize
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          className="w-full bg-transparent p-3.5 pr-12 text-sm outline-none resize-none placeholder:text-muted-foreground/60 min-h-[52px]"
          placeholder="Ask about architecture, bugs, or improvements..."
          maxRows={8}
        />
        <div className="absolute right-2 bottom-2 flex gap-1">
          <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            <Paperclip className="w-4 h-4" />
          </button>
          <button
            onClick={handleSendClick}
            disabled={!input.trim() || isTyping}
            className="p-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-[10px] text-center text-muted-foreground mt-2 hidden sm:block">
        AI can make mistakes. Verify code and architecture claims.
      </p>
    </div>
  );
};

export function AIChatPanel({ onClose }) {
  const { currentRepo } = useRepo();
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm your AI Repository Assistant. Ask me anything about the code, architecture, potential bugs, or improvements.",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = useCallback(async (text) => {
    if (!text.trim() || !currentRepo) return;

    const userMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await api.analyzeRepo(currentRepo.repo_name, userMessage.content);
      const assistantMessage = {
        id: Math.random().toString(),
        role: "assistant",
        content: response.answer,
        sources: response.sources || [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content: "Sorry, I encountered an error while analyzing your question. Please ensure the repository is analyzed/indexed first.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [currentRepo]);

  const handleClearChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your AI Repository Assistant. Ask me anything about the code, architecture, potential bugs, or improvements.",
        timestamp: new Date(),
      },
    ]);
  };

  if (!currentRepo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center relative">
        {onClose && (
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-card rounded-md transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        )}
        <div className="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <Bot className="w-8 h-8 text-primary/80" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">No Repository</h2>
        <p className="text-sm max-w-[250px]">
          Select a repository to chat with its AI assistant.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
        <div>
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Bot className="w-4 h-4 text-primary" />
            AI Assistant
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleClearChat}
            className="p-1.5 hover:bg-card rounded-md transition-colors text-muted-foreground hover:text-foreground"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-card rounded-md transition-colors text-muted-foreground hover:text-foreground ml-1"
              title="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-6">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="flex gap-4 group">
            <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 mt-1 border shadow-sm bg-primary/10 border-primary/20 text-primary">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex-1 flex items-center h-8">
              <div className="flex space-x-1 items-center">
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Premium Input */}
      <ChatInput onSend={handleSend} isTyping={isTyping} />
    </div>
  );
}
