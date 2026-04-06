import { useGetDashboardStats, useListConversations, useListSummaries } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, FileText, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

export function Dashboard() {
  const { data: stats, isLoading: isStatsLoading } = useGetDashboardStats();
  const { data: conversations, isLoading: isConversationsLoading } = useListConversations();
  const { data: summaries, isLoading: isSummariesLoading } = useListSummaries();

  const recentConversations = conversations?.slice(0, 5) || [];
  const recentSummaries = summaries?.slice(0, 5) || [];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">Real-time monitoring of your WhatsApp AI operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Chats</CardTitle>
            <Activity className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isStatsLoading ? "..." : stats?.activeConversations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Messages (24h)</CardTitle>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isStatsLoading ? "..." : stats?.messagesLast24h}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Conversations</CardTitle>
            <Users className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isStatsLoading ? "..." : stats?.totalConversations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Summaries</CardTitle>
            <FileText className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isStatsLoading ? "..." : stats?.totalSummaries}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Conversations</CardTitle>
            <Link href="/conversations" className="text-sm text-primary hover:underline font-medium">View all</Link>
          </CardHeader>
          <CardContent>
            {isConversationsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : recentConversations.length > 0 ? (
              <div className="space-y-4">
                {recentConversations.map((conv) => (
                  <Link key={conv.id} href={`/conversations/${conv.id}`} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                      {conv.contactName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate">{conv.contactName}</p>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {conv.lastMessageAt ? formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true }) : ''}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">{conv.lastMessage || 'No messages yet'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No recent conversations.</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Summaries</CardTitle>
            <Link href="/summaries" className="text-sm text-primary hover:underline font-medium">View all</Link>
          </CardHeader>
          <CardContent>
            {isSummariesLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : recentSummaries.length > 0 ? (
              <div className="space-y-4">
                {recentSummaries.map((summary) => (
                  <div key={summary.id} className="p-3 rounded-lg border bg-card text-card-foreground">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                        Conv #{summary.conversationId}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(summary.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2 text-muted-foreground">{summary.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No recent summaries.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
