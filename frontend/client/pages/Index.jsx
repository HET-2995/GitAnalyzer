import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { RepositoryPanel } from "@/components/RepositoryPanel";
import { AIChatPanel } from "@/components/AIChatPanel";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Index() {
  const [showChatPanel, setShowChatPanel] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      {/* Sidebar - Desktop only */}
      <div className="hidden lg:flex w-64 flex-shrink-0 border-r border-border bg-sidebar z-20">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">GA</span>
            </div>
            <span className="font-bold text-sm">Git Analyzer</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon"><Menu className="w-5 h-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 flex overflow-hidden relative">
          {/* Repository Panel - hides on mobile if chat is open */}
          <div className={`flex-1 min-w-0 overflow-hidden bg-background flex flex-col ${showChatPanel ? 'hidden lg:flex' : 'flex'}`}>
            <RepositoryPanel 
              onToggleChat={() => setShowChatPanel(!showChatPanel)}
              isChatOpen={showChatPanel}
            />
          </div>

          {/* AI Chat Panel */}
          {showChatPanel && (
            <div className="w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 border-l border-border bg-card flex flex-col z-10 lg:relative h-full">
              <AIChatPanel
                onClose={() => setShowChatPanel(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
