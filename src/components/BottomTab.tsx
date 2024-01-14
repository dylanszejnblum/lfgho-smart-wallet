import { TabsTrigger, TabsList, Tabs } from "@/components/ui/tabs";
import { Wallet, LineChart, Users, Send } from "lucide-react";
import Link from "next/link";
export default function Component() {
  return (
    <div className="fixed bottom-0 w-full h-20 bg-white dark:bg-gray-950">
      <Tabs
        className="flex h-full w-full items-center justify-center gap-4"
        defaultValue="wallet"
      >
        <TabsList className="flex h-full w-full items-center justify-center gap-4">
          <Link href={"/wallet"}>
            <TabsTrigger value="wallet">
              <div className="flex flex-col items-center justify-center">
                <Wallet className="h-6 w-6" />
                <span className="text-sm font-semibold mt-1">Wallet</span>
              </div>
            </TabsTrigger>
          </Link>
          <Link href={"/earn"}>
            <TabsTrigger value="earn">
              <div className="flex flex-col items-center justify-center">
                <LineChart className="h-6 w-6" />
                <span className="text-sm font-semibold mt-1">Earn</span>
              </div>
            </TabsTrigger>
          </Link>
          <Link href={"/send"}>
            <TabsTrigger value="send">
              <div className="flex flex-col items-center justify-center">
                <Send className="h-6 w-6" />
                <span className="text-sm font-semibold mt-1">Send</span>
              </div>
            </TabsTrigger>
          </Link>
          <Link href={"/groups"}>
            <TabsTrigger value="groups">
              <div className="flex flex-col items-center justify-center">
                <Users className="h-6 w-6" />
                <span className="text-sm font-semibold mt-1">Groups</span>
              </div>
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
    </div>
  );
}
