import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const settingsSchema = z.object({
  chatbotWebhookUrl: z.string().url("Must be a valid URL").or(z.literal("")).nullable(),
  summarizerWebhookUrl: z.string().url("Must be a valid URL").or(z.literal("")).nullable(),
});

export function Settings() {
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const updateMutation = useUpdateSettings();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const initializedForId = useRef<number | null>(null);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      chatbotWebhookUrl: "",
      summarizerWebhookUrl: "",
    },
  });

  useEffect(() => {
    if (settings && initializedForId.current !== settings.id) {
      initializedForId.current = settings.id;
      form.reset({
        chatbotWebhookUrl: settings.chatbotWebhookUrl || "",
        summarizerWebhookUrl: settings.summarizerWebhookUrl || "",
      });
    }
  }, [settings, form]);

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    updateMutation.mutate({ data: values }, {
      onSuccess: (data) => {
        toast({ title: "Settings updated successfully" });
        queryClient.setQueryData(getGetSettingsQueryKey(), data);
      },
      onError: () => {
        toast({ title: "Failed to update settings", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Configure integrations and webhook URLs for AI operations.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>n8n Webhook Integrations</CardTitle>
          <CardDescription>
            Provide the URLs to your n8n workflows that power the WhatsApp AI chatbot and summarization features.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="chatbotWebhookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chatbot Webhook URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://n8n.yourdomain.com/webhook/..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>
                      The endpoint that receives new messages and generates the AI response.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summarizerWebhookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summarizer Webhook URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://n8n.yourdomain.com/webhook/..." {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription>
                      The endpoint that processes the conversation history and returns a concise summary.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="bg-muted/30 border-t px-6 py-4">
              <Button type="submit" disabled={updateMutation.isPending} className="gap-2">
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Configuration
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
