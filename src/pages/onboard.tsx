import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PackageCheck } from "lucide-react";

const onboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2" href="#">
          <PackageCheck className="h-6 w-6" />
          <span className="text-lg font-semibold">Simon</span>
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-8 p-4 md:gap-12 md:p-12">
        <h1 className="text-3xl font-bold">Welcome to Simon Wallet</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Send , receive and borrow gHo easy with passkeys
        </p>
        <div className="flex flex-col gap-2">
          <Link className="flex items-center gap-2" href="/signup">
            <Button className="w-full" variant="secondary">
              Create Account
            </Button>
          </Link>
          <Link className="flex items-center gap-2" href="/login">
            <Button className="w-full" variant="default">
              Login
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default onboard;
