import { Sidebar } from "@/components/Sidebar";

export default function PlaceholderPage({ title }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground mb-6">
            This page is coming soon. Continue prompting to add more features to
            your app.
          </p>
          <p className="text-sm text-muted-foreground">
            Ask the builder to implement this page to get started.
          </p>
        </div>
      </div>
    </div>
  );
}
