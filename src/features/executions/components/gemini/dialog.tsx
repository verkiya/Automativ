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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCredentialsByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: "Variable name is required" })
    .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
      message:
        "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores",
    }),
  credentialId: z.string().min(1, "Credential is required"),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, "User prompt is required"),
});

export type GeminiFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GeminiFormValues) => void;
  defaultValues?: Partial<GeminiFormValues>;
}

export const GeminiDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const { data: credentials, isLoading: isLoadingCredentials } =
    useCredentialsByType(CredentialType.GEMINI);

  const form = useForm<GeminiFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      credentialId: defaultValues.credentialId || "",
      systemPrompt: defaultValues.systemPrompt || "",
      userPrompt: defaultValues.userPrompt || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        variableName: defaultValues.variableName || "",
        credentialId: defaultValues.credentialId || "",
        systemPrompt: defaultValues.systemPrompt || "",
        userPrompt: defaultValues.userPrompt || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || "myGemini";
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

  const handleSubmit = (values: GeminiFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };
  // src/lib/ai/model-selector.ts

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
             <Image src="/gemini.svg" alt="Gemini" width={18} height={18} />
            Gemini Configuration
          </DialogTitle>

          <DialogDescription>
            Configure the credentials, and prompts for this node.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className=" space-y-2"
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
                        placeholder="myGemini"
                        className="
                          border-sky-200/50
                        "
                        {...field}
                      />
                    </FormControl>

                    <FormDescription className="space-y-2">
                      <span>Use this variable to reference AI output:</span>
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
                name="credentialId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gemini Credential</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingCredentials || !credentials?.length}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Select a credential" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {credentials?.map((credential) => (
                          <SelectItem key={credential.id} value={credential.id}>
                            <div className="flex items-center gap-2">
                              <Image
                                src="/gemini.svg"
                                alt="Gemini"
                                width={16}
                                height={16}
                              />

                              {credential.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div
              className="
                rounded-xl
                border
                border-violet-200/40
                bg-gradient-to-r
                from-violet-50/50
                via-white
                to-fuchsia-50/40
                p-4
              "
            >
              <FormField
                control={form.control}
                name="systemPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Prompt (Optional)</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="You are a helpful assistant."
                        className="
                          h-[80px]
                          max-h-[120px]
                          font-mono
                          text-sm
                          bg-white
                        "
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      Supports variables like
                      {" {{variable}} "}
                      and objects using
                      {" {{json variable}}"}.
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
                border-sky-200/40
                bg-gradient-to-r
                from-sky-50/50
                via-white
                to-cyan-50/40
                p-4
              "
            >
              <FormField
                control={form.control}
                name="userPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Prompt</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="Summarize this text: {{json httpResponse.data}}"
                        className="
                          h-[80px]
                          max-h-[120px]
                          font-mono
                          text-sm
                          bg-white
                        "
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      The prompt sent to Gemini. Use
                      {" {{variables}} "}
                      for simple values or
                      {" {{json variable}} "}
                      to stringify objects.
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
