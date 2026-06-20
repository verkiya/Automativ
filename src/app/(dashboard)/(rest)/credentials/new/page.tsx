import { CredentialForm } from "@/features/credentials/components/credential";
import { requireAuth } from "@/lib/auth-utils";
import { KeyRoundIcon } from "lucide-react";

const Page = async () => {
  await requireAuth();

  return (
    <div className="h-full px-4 py-4 md:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-2xl flex flex-col gap-y-6">
        <div className="space-y-1">
          <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
            <KeyRoundIcon className="size-5 text-sky-700" />
            Credentials
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage API keys and provider credentials for your workflows.
          </p>
        </div>

        <CredentialForm />
      </div>
    </div>
  );
};

export default Page;
