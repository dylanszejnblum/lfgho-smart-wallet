import Link from "next/link";
import { useRouter } from "next/router";

import { Wallet, LineChart, Users, PackageCheck, Send } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

export default function Sidebar() {
  const router = useRouter();

  const isActive = (href: string) => {
    return router.pathname === href;
  };
  return (
    <aside className="w-64 border-r ">
      <div className="flex flex-col h-full">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link
            href="/wallet"
            passHref
            className="flex items-center gap-2 font-semibold"
          >
            <PackageCheck className="h-6 w-6" />
            <span>Simon</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="flex flex-col gap-4 px-4">
            <Link
              href="/wallet"
              passHref
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/wallet")
                  ? "text-pink-400 dark:text-pink-400"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              }`}
            >
              <Wallet className="h-4 w-4" />
              Wallet
            </Link>
            <Link
              href="/earn"
              passHref
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/earn")
                  ? "text-pink-400 dark:text-pink-400"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              }`}
            >
              <LineChart className="h-4 w-4" />
              Earn
            </Link>
            <Link
              href="/send"
              passHref
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/send")
                  ? "text-pink-400 dark:text-pink-400"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              }`}
            >
              <Send className="h-4 w-4" />
              Send Money
            </Link>
            <Link
              href="/groups"
              passHref
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive("/groups")
                  ? "text-pink-400 dark:text-pink-400"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              }`}
            >
              <Users className="h-4 w-4" />
              Groups
            </Link>
          </nav>
        </div>
        <div className="p-4 mt-auto ">
          <ModeToggle />
        </div>
      </div>
    </aside>
  );
}
