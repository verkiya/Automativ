"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CheckIcon, CopyIcon } from "lucide-react";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and container only letters, numbers, and underscores",
    }),
  username: z.string().optional(),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(2000, "Discord messages cannot exceed 2000 characters"),
  webhookUrl: z.string().min(1, "Webhook URL is required"),
});

export type DiscordFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<DiscordFormValues>;
}

export const DiscordDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      username: defaultValues.username || "",
      content: defaultValues.content || "",
      webhookUrl: defaultValues.webhookUrl || "",
    },
  });

  // Reset form values when dialog opens with new defaults
  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        username: defaultValues.username || "",
        content: defaultValues.content || "",
        webhookUrl: defaultValues.webhookUrl || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "myDiscord";
  const [copied, setCopied] = useState(false);

  const variableReference = `{{${watchVariableName}.text}}`;

  const handleCopy = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    await navigator.clipboard.writeText(variableReference);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
    sm:max-w-lg

    [&>button]:transition-all
    [&>button]:duration-200
    [&>button]:ease-out
    [&>button]:rounded-md
    [&>button]:p-1
    [&>button]:hover:bg-muted
    [&>button]:hover:scale-110
    [&>button]:active:scale-95
  "
      >
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2">
            <Image src="/discord.svg" alt="Discord" width={18} height={18} />
            Discord Configuration
          </DialogTitle>
          <DialogDescription>
            Configure the Discord webhook settings for this node.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-2"
          >
            <div
              className="
                rounded-xl
                border
                border-sky-200/50
                bg-gradient-to-r
                from-sky-50
                via-white
                to-cyan-50
                p-4
              "
            >
              <FormField
                control={form.control}
                name="variableName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variable Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="myDiscord"
                        className="
                          border-sky-200/50
                        "
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="space-y-2">
                      <span>Use this name to reference the result in other nodes:</span>
                      <span className="flex items-start gap-2 mt-2">
                        <span
                          className="
                            inline-flex
                            max-w-full
                            rounded-xl
                            border
                            border-sky-200/60
                            bg-gradient-to-r
                            from-sky-50
                            via-white
                            to-cyan-50
                            px-3
                            py-1.5
                          "
                        >
                          <code
                            className="
                              break-all
                              font-mono
                              text-xs
                              text-sky-800
                            "
                          >
                            {variableReference}
                          </code>
                        </span>

                        <Button
                          type="button"
                          size="icon-sm"
                          onClick={handleCopy}
                          variant="workflowSoft"
                          className="shrink-0"
                        >
                          {copied ? (
                            <CheckIcon className="size-3 text-emerald-500" />
                          ) : (
                            <CopyIcon className="size-3" />
                          )}
                        </Button>
                      </span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div
              className="
                rounded-xl
                border
                border-indigo-200/40
                bg-gradient-to-r
                from-indigo-50/60
                via-white
                to-violet-50/40
                p-4
              "
            >
              <FormField
                control={form.control}
                name="webhookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paste Webhook URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://discord.com/api/webhooks/..."
                        className="bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Edit Channel / Channel Settings → Integrations →
                      Webhooks
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div
              className="
                rounded-xl
                border
                border-emerald-200/40
                bg-gradient-to-r
                from-emerald-50/60
                via-white
                to-green-50/40
                p-4
              "
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Summary: {{myDiscord.text}}"
                        className="
                          min-h-[80px]
                          max-h-[120px]
                          font-mono
                          text-sm
                          bg-white
                        "
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The message to send. Use {"{{variables}}"} for simple values
                      or {"{{json variable}}"} to stringify objects.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div
              className="
                rounded-xl
                border
                border-amber-200/40
                bg-gradient-to-r
                from-amber-50/50
                via-white
                to-orange-50/40
                p-4
              "
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bot Username (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Workflow Bot" className="bg-white" {...field} />
                    </FormControl>
                    <FormDescription>
                      Override the webhook&apos;s default username.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" variant="workflow" className="w-full">
                Save Configuration
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
