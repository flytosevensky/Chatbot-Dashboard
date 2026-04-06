import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Sidebar } from "@/components/layout/Sidebar";
import { Dashboard } from "@/pages/Dashboard";
import { Conversations } from "@/pages/Conversations";
import { ConversationDetail } from "@/pages/ConversationDetail";
import { Summaries } from "@/pages/Summaries";
import { Settings } from "@/pages/Settings";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-w-0">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/conversations" component={Conversations} />
          <Route path="/conversations/:id" component={ConversationDetail} />
          <Route path="/summaries" component={Summaries} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
