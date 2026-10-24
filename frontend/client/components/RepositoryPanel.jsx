import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  Github,
  Zap,
  RefreshCw,
  Copy,
  Star,
  GitFork,
  FileCode,
  FolderOpen,
  Clock,
  BarChart3,
  Package,
  BookOpen,
  AlertCircle,
  Lightbulb,
  Database,
  Globe,
  Search,
  Check,
  PanelRightOpen,
  PanelRightClose,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRepo } from "../context/RepoContext";
import { api } from "../api/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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

export function RepositoryPanel({ onToggleChat, isChatOpen }) {
  const { currentRepo, addRepo } = useRepo();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState(null);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [isAddingRepo, setIsAddingRepo] = useState(false);
  const [tabContent, setTabContent] = useState({});
  const [isTabLoading, setIsTabLoading] = useState(false);

  const tabPrompts = {
    architecture: "Provide a detailed architecture overview of this repository. What are the main components and how do they interact?",
    documentation: "Generate a high-level documentation summary for this repository, explaining what it does and how to get started.",
    bugs: "Analyze the codebase for potential bugs, security vulnerabilities, or anti-patterns.",
    improvements: "Suggest code improvements, performance optimizations, and best practices that could be applied to this repository.",
    dependencies: "List and explain the main dependencies, libraries, and frameworks used in this repository.",
    api: "Outline the public API, endpoints, or primary exported functions/classes of this repository."
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "architecture", label: "Architecture", icon: Package },
    { id: "documentation", label: "Documentation", icon: BookOpen },
    { id: "bugs", label: "Bug Analysis", icon: AlertCircle },
    { id: "improvements", label: "Improvements", icon: Lightbulb },
    { id: "dependencies", label: "Dependencies", icon: Database },
    { id: "api", label: "API", icon: Globe },
  ];

  useEffect(() => {
    if (currentRepo) {
      // Fetch stats
      api.getRepoStats(currentRepo.repo_name)
        .then((data) => setStats(data))
        .catch(console.error);
    }
  }, [currentRepo]);

  useEffect(() => {
    if (activeTab === "overview" || !currentRepo || !isAnalyzed) return;
    
    if (tabContent[activeTab]) return;

    const fetchTabContent = async () => {
      setIsTabLoading(true);
      try {
        const response = await api.analyzeRepo(currentRepo.repo_name, tabPrompts[activeTab]);
        setTabContent(prev => ({ ...prev, [activeTab]: response.answer }));
      } catch (err) {
        console.error(err);
        setTabContent(prev => ({ ...prev, [activeTab]: "Failed to load analysis for this section. Please ensure the repository is fully analyzed first." }));
      } finally {
        setIsTabLoading(false);
      }
    };

    fetchTabContent();
  }, [activeTab, currentRepo, isAnalyzed, tabContent]);

  const handleAnalyze = async () => {
    if (!currentRepo) return;
    setIsAnalyzing(true);
    try {
      await api.indexRepo(currentRepo.repo_name);
      setIsAnalyzed(true);
    } catch (e) {
      console.error(e);
      alert("Failed to analyze repository");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddRepo = async (url) => {
    const targetUrl = url || repoUrl;
    if (!targetUrl) return;

    const isValidGithubUrl = /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+$/.test(targetUrl);
    if (!isValidGithubUrl) {
      toast.error("Invalid URL", { description: "Please enter a valid GitHub repository URL." });
      return;
    }

    setIsAddingRepo(true);
    
    let clonedRepoData = null;
    try {
      const response = await api.cloneRepo(targetUrl);
      if (response.success) {
        clonedRepoData = response.data;
      }
    } catch (err) {
      console.error(err);
      toast.error("Clone Failed", { description: "Failed to clone repository. Check the URL." });
      setIsAddingRepo(false);
      return;
    }
    
    setIsAddingRepo(false);
    
    if (clonedRepoData) {
      setIsAnalyzing(true);
      try {
        await api.indexRepo(clonedRepoData.repo_name);
        setIsAnalyzed(true);
        addRepo(clonedRepoData);
        setRepoUrl("");
        toast.success("Repository Ready", { description: "Analysis complete." });
      } catch (e) {
        console.error(e);
        toast.error("Analysis Failed", { description: "Failed to analyze repository." });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  if (!currentRepo) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-background h-full p-8 text-center relative">
        <div className="absolute top-4 right-4">
           {!isChatOpen && (
              <button 
                onClick={onToggleChat}
                className="p-2 hover:bg-muted rounded-md transition-colors"
                title="Open Chat"
              >
                <PanelRightOpen className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto space-y-6 text-center w-full">
          <div className="w-16 h-16 bg-muted/50 border border-border shadow-sm rounded-2xl flex items-center justify-center">
            <Github className="w-8 h-8 text-foreground/80" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">Analyze any Repository</h2>
            <p className="text-muted-foreground max-w-md mx-auto text-base">
              Paste a public GitHub repository URL to generate architecture diagrams, locate bugs, and search the codebase using AI.
            </p>
          </div>
          
          <div className="w-full max-w-lg relative flex items-center mt-4">
            <div className="absolute left-3 text-muted-foreground"><Search className="w-4 h-4" /></div>
            <input 
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              disabled={isAddingRepo || isAnalyzing}
              className="w-full pl-10 pr-28 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:border-primary/50 transition-colors shadow-sm"
              placeholder="https://github.com/facebook/react"
              onKeyDown={(e) => e.key === 'Enter' && handleAddRepo()}
            />
            <Button 
              className="absolute right-1.5 h-8 px-4 text-xs"
              disabled={!repoUrl || isAddingRepo || isAnalyzing}
              onClick={() => handleAddRepo()}
            >
              {isAddingRepo || isAnalyzing ? <><Loader2 className="w-3 h-3 mr-2 animate-spin" /> Analyzing</> : "Analyze"}
            </Button>
          </div>
          
          <div className="mt-4 flex gap-3 text-xs text-muted-foreground">
            <span>Try:</span>
            <button onClick={() => handleAddRepo("https://github.com/vercel/next.js")} className="hover:text-foreground underline decoration-border underline-offset-4" disabled={isAddingRepo || isAnalyzing}>vercel/next.js</button>
            <button onClick={() => handleAddRepo("https://github.com/shadcn-ui/ui")} className="hover:text-foreground underline decoration-border underline-offset-4" disabled={isAddingRepo || isAnalyzing}>shadcn-ui/ui</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-background overflow-hidden h-full">
      {/* Toolbar */}
      <div className="px-6 py-4 bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Github className="w-6 h-6 text-foreground" />
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              {currentRepo.repo_name}
              <span className="px-2 py-0.5 bg-muted rounded-md text-[10px] font-medium text-muted-foreground border border-border uppercase tracking-wider">
                main
              </span>
              {isAnalyzing && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-md text-[10px] font-medium text-primary ml-2 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" /> Indexing...
                </span>
              )}
            </h3>
            <p className="text-xs text-muted-foreground truncate max-w-[200px] sm:max-w-md">
              {currentRepo.local_path}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium text-sm shadow-sm"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {isAnalyzing ? "Analyzing..." : "Analyze Repository"}
          </button>
          <button className="flex items-center justify-center p-2 bg-card border border-border/60 text-foreground rounded-lg hover:bg-muted transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
          {!isChatOpen && (
            <button 
              onClick={onToggleChat}
              className="flex items-center justify-center p-2 bg-card border border-border/60 text-foreground rounded-lg hover:bg-muted transition-colors ml-2"
              title="Open Chat"
            >
              <PanelRightOpen className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Sleek Tabs Navigation */}
      <div className="px-6 py-2 border-b border-border bg-background sticky top-0 z-10 overflow-x-auto scrollbar-none">
        <div className="flex space-x-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 flex items-center gap-2",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
        {activeTab === "overview" && (
          <div className="max-w-5xl mx-auto">
            {/* Premium Stats Card */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Files Indexed", value: stats?.total_files || "-", icon: FileCode, color: "text-foreground" },
                { label: "Characters", value: stats?.total_characters ? (stats.total_characters/1000).toFixed(1) + 'k' : "-", icon: BarChart3, color: "text-foreground" },
                { label: "Semantic Chunks", value: stats?.chunks || "-", icon: Database, color: "text-foreground" },
                { label: "Analysis Status", value: isAnalyzed ? "Complete" : "Pending", icon: isAnalyzed ? Check : Clock, color: isAnalyzed ? "text-success" : "text-warning" }
              ].map((stat, i) => (
                <div key={i} className="p-5 rounded-xl border border-border bg-card flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <stat.icon className={cn("w-4 h-4", stat.color)} />
                    <span className="text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <span className="text-2xl font-semibold text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>

            {/* Placeholder for where actual markdown overview would go */}
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <h3 className="text-lg font-medium text-foreground mb-2">Repository Overview</h3>
              <p className="max-w-md mx-auto text-sm">
                Run the analysis to generate a comprehensive overview of this repository, including its architecture, core technologies, and structure.
              </p>
            </div>
          </div>
        )}
        
        {activeTab !== "overview" && (
          <div className="max-w-5xl mx-auto">
            {!isAnalyzed ? (
              <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground flex flex-col items-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-foreground mb-2">Analysis Required</h3>
                <p className="max-w-md mx-auto text-sm">
                  Please run the repository analysis first (click "Analyze Repository") to view the {tabs.find(t => t.id === activeTab)?.label}.
                </p>
              </div>
            ) : isTabLoading ? (
              <div className="space-y-4 w-full">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-32 w-full mt-6" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-32 w-full mt-6" />
              </div>
            ) : (
              <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
                <div className="prose prose-sm md:prose-base max-w-none text-foreground leading-relaxed break-words">
                  <ReactMarkdown
                    components={{
                      code({node, inline, className, children, ...props}) {
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
                    {tabContent[activeTab] || ""}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
