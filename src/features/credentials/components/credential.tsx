"use client";

import { CredentialType } from "@/generated/prisma";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useCreateCredential,
  useUpdateCredential,
  useSuspenseCredential,
} from "../hooks/use-credentials";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().min(1, "API key is required"),
});

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
  {
    value: CredentialType.OPENAI,
    label: "OpenAI",
    logo: "/openai.svg",
  },
  {
    value: CredentialType.ANTHROPIC,
    label: "Anthropic",
    logo: "/anthropic.svg",
  },
  {
    value: CredentialType.GEMINI,
    label: "Gemini",
    logo: "/gemini.svg",
  },
];

interface CredentialFormProps {
  initialData?: {
    id?: string;
    name: string;
    type: CredentialType;
    value: string;
  };
}
const providerCopy = {
  OPENAI: {
    placeholder: "sk-...",
    help: "GPT-5, GPT-5 Mini, GPT-4o, embeddings and image models.",
  },
  GEMINI: {
    placeholder: "AIza...",
    help: "Gemini 2.5 Flash, Gemini 3.1 Flash Lite and image models.",
  },
  ANTHROPIC: {
    placeholder: "sk-ant-...",
    help: "Claude Sonnet, Opus and Haiku models.",
  },
};
const apiKeyPlaceholders = {
  [CredentialType.OPENAI]: "sk-...",
  [CredentialType.GEMINI]: "AIza...",
  [CredentialType.ANTHROPIC]: "sk-ant-...",
};
const providerStyles = {
  [CredentialType.OPENAI]: {
    border: "border-slate-300/50",
    bg: "from-slate-100 via-white to-zinc-100",
  },
  [CredentialType.GEMINI]: {
    border: "border-sky-200/40",
    bg: "from-sky-50/60 via-white to-cyan-50/40",
  },
  [CredentialType.ANTHROPIC]: {
    border: "border-orange-200/40",
    bg: "from-orange-50/60 via-white to-amber-50/40",
  },
} as const;
const providerHelpText = {
  [CredentialType.OPENAI]: "GPT-5, GPT-5 Mini, GPT-4o and OpenAI models.",

  [CredentialType.GEMINI]:
    "Gemini 2.5 Flash, Gemini 3.1 Flash Lite and Gemini models.",

  [CredentialType.ANTHROPIC]: "Claude Sonnet and Haiku models.",
};
export const CredentialForm = ({ initialData }: CredentialFormProps) => {
  const router = useRouter();
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();
  const { handleError, modal } = useUpgradeModal();

  const isEdit = !!initialData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      type: CredentialType.OPENAI,
      value: "",
    },
  });
  const selectedProvider = credentialTypeOptions.find(
    (option) => option.value === form.watch("type"),
  );
  const selectedType = form.watch("type");

  const providerStyle =
    providerStyles[selectedType] ?? providerStyles[CredentialType.OPENAI];
  const onSubmit = async (values: FormValues) => {
    if (isEdit && initialData?.id) {
      await updateCredential.mutateAsync({
        id: initialData.id,
        ...values,
      });
    } else {
      await createCredential.mutateAsync(values, {
        onSuccess: (data) => {
          router.push(`/credentials`);
        },
        onError: (error) => {
          handleError(error);
        },
      });
    }
  };
  const [showKey, setShowKey] = useState(false);
  return (
    <>
      <div
        className={`
    rounded-xl
    border
    bg-gradient-to-r
    p-4
    hover:shadow-sm
    flex
    items-center
    gap-3
    transition-all
    duration-200
    ${providerStyle.border}
    ${providerStyle.bg}
  `}
      >
        <Image
          src={selectedProvider?.logo ?? "/openai.svg"}
          alt=""
          width={32}
          height={32}
        />

        <div>
          <p className="font-medium">{selectedProvider?.label}</p>
          <p className="text-xs text-muted-foreground">Credential provider</p>
        </div>
      </div>
      {modal}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>
            {isEdit ? "Edit Credential" : "Create Credential"}
          </CardTitle>
          <CardDescription>
            {isEdit
              ? "Update your API key or credential details"
              : "Add a new API key or credential to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem
                    className={`
    rounded-xl
    border
    bg-gradient-to-r
    p-4
    ${providerStyle.border}
    ${providerStyle.bg}
  `}
                  >
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        className="ring-sky-200 "
                        placeholder="My API key"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem
                    className="
rounded-xl
border
border-sky-200
bg-gradient-to-r
from-sky-50/30
via-white
to-sky-50/20
p-4
"
                  >
                    <FormLabel>Service</FormLabel>
                    <Select

                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full border-gray-400">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-sky-200">
                        {credentialTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value} className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Image
                                src={option.logo}
                                alt={option.label}
                                width={16}
                                height={16}
                              />
                              {option.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {" "}
                      {providerHelpText[selectedType]}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem
                    className={`
    rounded-xl
    border
    bg-gradient-to-r
    p-4
    ${providerStyle.border}
    ${providerStyle.bg}
  `}
                  >
                    <FormLabel>Paste your key</FormLabel>{" "}
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showKey ? "text" : "password"}
                          placeholder={apiKeyPlaceholders[selectedType]}
                          className="pr-10 ring-sky-200"
                          {...field}
                        />

                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => setShowKey((prev) => !prev)}
                          className="
        absolute
        right-3
        top-1/2
        -translate-y-1/2
        text-muted-foreground
        hover:text-foreground
        transition-colors
      "
                        >
                          {showKey ? (
                            <EyeOffIcon className="size-4" />
                          ) : (
                            <EyeIcon className="size-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Your API key is encrypted before storage and never
                      displayed again.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="w-[140px]"
                  variant="accent"
                  disabled={
                    createCredential.isPending || updateCredential.isPending
                  }
                >
                  {isEdit ? "Update" : "Create"}
                </Button>
                <Button
                  type="button"
                  className="w-[80px] "
                  variant="outline"
                  asChild
                >
                  <Link href="/credentials" prefetch>
                    Cancel
                  </Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};

export const CredentialView = ({ credentialId }: { credentialId: string }) => {
  const { data: credential } = useSuspenseCredential(credentialId);

  return <CredentialForm initialData={credential} />;
};
