import { useListSummaries } from "@workspace/api-client-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { FileText, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export function Summaries() {
  const { data: summaries, isLoading } = useListSummaries();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Summaries</h1>
        <p className="text-muted-foreground mt-2">Generated insights from customer conversations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 bg-muted rounded w-1/3 mb-2" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <div className="h-4 bg-muted rounded w-4/6" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : summaries?.length ? (
          summaries.map((summary) => (
            <Card key={summary.id} className="flex flex-col h-full hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-md text-primary">
                      <FileText className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-base font-semibold">Conv #{summary.conversationId}</CardTitle>
                  </div>
                  <Link href={`/conversations/${summary.conversationId}`} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                    View Thread <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-4 flex-1">
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">{summary.content}</p>
                <div className="mt-auto text-xs text-muted-foreground">
                  Generated {format(new Date(summary.createdAt), 'MMM d, yyyy h:mm a')}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-16 border rounded-lg bg-card text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No summaries generated yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
