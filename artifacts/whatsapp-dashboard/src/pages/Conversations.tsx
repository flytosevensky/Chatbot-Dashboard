import { useListConversations } from "@workspace/api-client-react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Link } from "wouter";
import { MessageSquare, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function Conversations() {
  const { data: conversations, isLoading } = useListConversations();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
          <p className="text-muted-foreground mt-2">All AI-managed WhatsApp threads.</p>
        </div>
        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {conversations?.length || 0} Total
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </div>
              </div>
            </Card>
          ))
        ) : conversations?.length ? (
          conversations.map((conv) => (
            <Link key={conv.id} href={`/conversations/${conv.id}`}>
              <Card className="p-4 hover:shadow-md transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {conv.contactName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg truncate">{conv.contactName}</h3>
                      <span className="text-sm text-muted-foreground">{conv.contactPhone}</span>
                      {conv.hasSummary && (
                        <Badge variant="secondary" className="text-xs font-normal">Summarized</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm truncate mt-1">
                      {conv.lastMessage || 'No messages'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground">
                      {conv.lastMessageAt ? format(new Date(conv.lastMessageAt), 'MMM d, h:mm a') : ''}
                    </span>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MessageSquare className="w-3 h-3" />
                      <span className="text-xs font-medium">{conv.messageCount}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No conversations found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
