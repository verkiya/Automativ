"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import { generateGoogleFormScript } from "./utils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: Props) => {
  const params = useParams();
  const workflowId = params.workflowId as string;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied");
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg
        [&>button]:transition-all
        [&>button]:duration-200
        [&>button]:ease-out
        [&>button]:rounded-md
        [&>button]:p-1
        [&>button]:hover:bg-muted
        [&>button]:hover:scale-110
        [&>button]:active:scale-95"
      >
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-semibold">
            Google Form Trigger
          </DialogTitle>
          <DialogDescription className="text-sm">
            Connect your Google Form to this workflow using a webhook.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={copyToClipboard}
                className="hover:scale-105 active:scale-95 transition"
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
            <h4 className="text-sm font-semibold">Setup Instructions</h4>

            <ol className="space-y-2 text-sm text-muted-foreground">
              {[
                "Open your Google Form",
                "Click the three-dot menu → Apps Script editor",
                "Paste the script (below)",
                "Replace WEBHOOK_URL with your URL",
                "Go to Triggers → Add Trigger",
                "Function to run: onFormSubmit",
                "Select: Event Source (From form) & Event Type (On form submit)",
                "Save the trigger and authorize the account",
              ].map((step, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-medium text-foreground">{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Google Apps Script</h4>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={async () => {
                  const script = generateGoogleFormScript(webhookUrl);
                  try {
                    await navigator.clipboard.writeText(script);
                    toast.success("Script copied");
                  } catch {
                    toast.error("Failed to copy script");
                  }
                }}
                className="hover:scale-105 active:scale-95 transition"
              >
                <CopyIcon className="size-4 mr-2" />
                Copy Script
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Includes your webhook URL and handles submissions automatically.
            </p>
          </div>

          <div className="rounded-xl border bg-muted/40 p-4 space-y-3">
            <h4 className="text-sm font-semibold">Available Variables</h4>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-1">
                <code className="bg-background px-2 py-1 rounded text-xs font-mono w-fit">
                  {"{{googleForm.respondentEmail}}"}
                </code>
                <span className="text-muted-foreground text-xs">
                  Respondent email
                </span>
              </div>

              <div className="flex items-center gap-1">
                <code className="bg-background px-2 py-1 rounded text-xs font-mono w-fit">
                  {"{{googleForm.responses['Question Name']}}"}
                </code>
                <span className="text-muted-foreground text-xs">
                  Specific answer
                </span>
              </div>

              <div className="flex items-center gap-1">
                <code className="bg-background px-2 py-1 rounded text-xs font-mono w-fit">
                  {"{{json googleForm.responses}}"}
                </code>
                <span className="text-muted-foreground text-xs">
                  All responses as JSON
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

