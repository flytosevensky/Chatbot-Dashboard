import { useGetConversation, useGetConversationMessages, useSummarizeConversation, useListSummaries, getGetConversationQueryKey, getGetConversationMessagesQueryKey, getListSummariesQueryKey } from "@workspace/api-client-react";
import { useRoute } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowLeft, Bot, User, FileText, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export function ConversationDetail() {
  const [, params] = useRoute("/conversations/:id");
  const id = Number(params?.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: conversation, isLoading: isConvLoading } = useGetConversation(id, { query: { enabled: !!id, queryKey: getGetConversationQueryKey(id) } });
  const { data: messages, isLoading: isMessagesLoading } = useGetConversationMessages(id, { query: { enabled: !!id, queryKey: getGetConversationMessagesQueryKey(id) } });
  const { data: summaries } = useListSummaries({ query: { queryKey: getListSummariesQueryKey() } });
  
  const summarizeMutation = useSummarizeConversation();

  const conversationSummary = summaries?.find(s => s.conversationId === id);

  const handleSummarize = () => {
    summarizeMutation.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Conversation summarized successfully" });
        queryClient.invalidateQueries({ queryKey: getGetConversationQueryKey(id) });
        queryClient.invalidateQueries({ queryKey: getListSummariesQueryKey() });
      },
      onError: (err) => {
        toast({ title: "Failed to summarize", description: err.error, variant: "destructive" });
      }
    });
  };

  if (isConvLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading...</div>;
  }

  if (!conversation) return <div className="p-8">Conversation not found</div>;

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto w-full">
      <div className="p-6 border-b bg-card flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/conversations" className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">{conversation.contactName}</h1>
            <p className="text-sm text-muted-foreground">{conversation.contactPhone}</p>
          </div>
        </div>
        <Button 
          onClick={handleSummarize} 
          disabled={summarizeMutation.isPending}
          className="gap-2"
        >
          {summarizeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
          Summarize
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {conversationSummary && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-8">
            <h3 className="font-semibold flex items-center gap-2 text-primary mb-2">
              <FileText className="w-4 h-4" /> AI Summary
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{conversationSummary.content}</p>
          </div>
        )}

        <div className="space-y-6">
          {isMessagesLoading ? (
            <div className="text-center text-muted-foreground py-4 animate-pulse">Loading messages...</div>
          ) : messages?.length ? (
            messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-end gap-2 mb-1">
                    {!isUser && (
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div 
                      className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm ${
                        isUser 
                          ? 'bg-primary text-primary-foreground rounded-br-sm' 
                          : 'bg-card border shadow-sm text-card-foreground rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground px-8">
                    {format(new Date(msg.timestamp), 'MMM d, h:mm a')}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-muted-foreground">No messages found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
