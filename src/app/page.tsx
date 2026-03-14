import { Button } from "@/components/ui/button";
import { caller } from "@/trpc/server";
const Page = async () => {
  const users = await caller.getUsers();
  return (
    <div className="text-red-400 min-h-screen bg-black">
      Calling the database
      <Button variant="outline">{JSON.stringify(users)}</Button>
    </div>
  );
};
export default Page;
