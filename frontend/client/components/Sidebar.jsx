import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  GitBranch,
  History,
  BookMarked,
  Settings,
  ChevronRight,
  Plus,
  LogOut,
} from "lucide-react";
import { useRepo } from "../context/RepoContext";
import { api } from "../api/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const location = useLocation();
  const { recentRepos, addRepo, selectRepo } = useRepo();
  const [repoUrl, setRepoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigationItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: GitBranch, label: "Repositories", href: "/repositories" },
    { icon: History, label: "Analysis History", href: "/history" },
    { icon: BookMarked, label: "Saved Reports", href: "/reports" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const isActive = (href) => location.pathname === href;

  const handleAddRepo = async (e) => {
    e.preventDefault();
    if (!repoUrl) return;
    setIsLoading(true);
    try {
      const response = await api.cloneRepo(repoUrl);
      if (response.success) {
        addRepo(response.data);
        setRepoUrl("");
        setIsDialogOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add repository");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col h-full bg-transparent">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">GA</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-sidebar-foreground">
              Git Analyzer
            </h1>
            <p className="text-xs text-muted-foreground">AI Repository Tool</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="p-4 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const isDisabled = item.label === "Analysis History" || item.label === "Saved Reports";
            return (
              <Link
                key={item.href}
                to={isDisabled ? "#" : item.href}
                onClick={(e) => isDisabled && e.preventDefault()}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  isDisabled && "opacity-50 cursor-not-allowed hover:bg-transparent text-muted-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="flex-1">{item.label}</span>
                {isDisabled && (
                  <span className="text-[10px] uppercase tracking-wider font-semibold bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Recent Repositories */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recent Repositories
            </h3>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <button className="p-1 hover:bg-sidebar-accent rounded transition-colors">
                  <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add GitHub Repository</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddRepo} className="flex flex-col gap-4">
                  <Input
                    placeholder="https://github.com/owner/repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    disabled={isLoading}
                  />
                  <Button type="submit" disabled={!repoUrl || isLoading}>
                    {isLoading ? "Cloning..." : "Add Repository"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

          </div>

          <div className="space-y-2">
            {recentRepos.map((repo) => (
              <button
                key={repo.repo_name}
                onClick={() => selectRepo(repo.repo_name)}
                className="w-full text-left px-3 py-2.5 rounded-md hover:bg-sidebar-accent transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <p className="text-xs font-medium text-sidebar-foreground truncate">
                        {repo.repo_name}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button 
          disabled
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Settings (Coming Soon)</span>
        </button>
      </div>
    </div>
  );
}
