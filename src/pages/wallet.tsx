import withAuth from "@/hoc/withAuth";

import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { QrCode, ArrowDown, Wallet, Plane } from "lucide-react";
import QrCodeModal from "@/components/QrCodeModal";
import { useApplicationContext } from "@/context/ApplicationContext";
import { useEffect, useState } from "react";
const tokens = [
  {
    chainId: 11155111,
    name: "GHO Stablecoin",
    symbol: "GHO",
    decimals: 18,
    address: "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60",
    logoURI: "https://app.aave.com/icons/tokens/gho.svg",
    tags: ["pos", "erc20", "swapable", "metaTx"],
    balance: "0",
    extensions: {
      rootAddress: "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60",
    },
  },
  {
    chainId: 11155111,
    name: "USDT Stablecoin",
    symbol: "USDT",
    decimals: 6,
    address: "0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0",
    logoURI:
      "https://token-icons.s3.amazonaws.com/0xdac17f958d2ee523a2206206994597c13d831ec7.png",
    tags: ["pos", "erc20", "swapable", "metaTx"],
    balance: "0",
    extensions: {
      rootAddress: "0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0",
    },
  },
];
const wallet = () => {
  const { accountAddress, getBalance, getBalanceErc20 } =
    useApplicationContext();
  const [balance, setBalance] = useState("0");
  const [tokensWithBalance, setTokensWithBalance] = useState(tokens);

  useEffect(() => {
    async function fetchBalance() {
      const response = await getBalance(accountAddress);
      setBalance(response);
    }

    async function fetchTokenBalances() {
      const updatedTokens = await Promise.all(
        tokens.map(async (token) => {
          const tokenBalance = await getBalanceErc20(
            token.address,
            accountAddress,
            token.decimals
          );
          return { ...token, balance: tokenBalance };
        })
      );
      setTokensWithBalance(updatedTokens);
    }

    fetchBalance();
    fetchTokenBalances();
  }, []); // Empty dependency array ensures this effect runs only once

  return (
    <>
      <div className=" p-6 max-w-sm mx-auto">
        <h1 className="text-2xl font-semibold text-center">My Balance</h1>
        <p className="text-6xl font-bold text-center my-4">
          {parseFloat(balance).toFixed(4)} ETH
        </p>
        <div className="flex justify-center my-6">
          <QrCodeModal />
        </div>
      </div>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Wallet className="h-6 w-6 text-pink-400" />
              <div>
                <CardTitle>My tokens</CardTitle>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokensWithBalance.map((token) => (
                <TableRow key={token.name}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <img
                        className="h-5 w-5 green-red-500"
                        src={token.logoURI}
                      />
                      <span>{token.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {" "}
                    {token.balance ? token.balance : "Loading..."}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default withAuth(wallet);
