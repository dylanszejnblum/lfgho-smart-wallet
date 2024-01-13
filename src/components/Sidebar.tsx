import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Wallet, LineChart, Users, Ghost } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

export default function Component() {
  return (
    <aside className="w-64 border-r bg-white dark:bg-gray-800">
      <div className="flex flex-col h-full">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link
            href="#"
            passHref
            className="flex items-center gap-2 font-semibold"
          >
            <Ghost className="h-6 w-6" />
            <span>GHOWALLET</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="flex flex-col gap-4 px-4">
            <Link
              href="#"
              passHref
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              <Wallet className="h-4 w-4" />
              Wallet
            </Link>
            <Link
              href="#"
              passHref
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              <LineChart className="h-4 w-4" />
              Earn
            </Link>
            <Link
              href="#"
              passHref
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            >
              <Users className="h-4 w-4" />
              Groups
            </Link>
          </nav>
        </div>
        <div className="p-4 mt-auto ">
          <Card className="mb-2">
            <CardHeader className="pb-4">
              <CardTitle>Not connected</CardTitle>
              <CardDescription>
                You dont seem to have an account please connect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="sm">
                Connect
              </Button>
            </CardContent>
          </Card>
          <ModeToggle />
        </div>
      </div>
    </aside>
  );
}
