import React, { useState } from "react";
import withAuth from "@/hoc/withAuth";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApplicationContext } from "@/context/ApplicationContext";

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

interface SelectProps {
  children: React.ReactNode;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void; // Ensure this matches your Select component's expected behavior
}

const Send = () => {
  const { accountAddress, sendErc20 } = useApplicationContext();
  const [selectedAsset, setSelectedAsset] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAsset(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRecipientAddress(event.target.value);
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };

  const handleSend = async () => {
    console.log("Selected Asset:", selectedAsset);
    console.log("Recipient Address:", recipientAddress);
    console.log("Amount:", amount);
    const addressOfUser = sessionStorage.getItem("addressOfUser");

    await sendErc20(selectedAsset, recipientAddress, amount, 6);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Send Asset</CardTitle>
            <CardDescription>
              Enter the recipient's address and select the asset you want to
              send.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Enter recipient's address"
                value={recipientAddress}
                onChange={handleAddressChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <select
                id="asset"
                className="block w-full px-3 py-2 rounded-md shadow-sm focus:outline-none"
                value={selectedAsset}
                onChange={handleSelectChange}
              >
                <option value="">Select asset</option>
                {tokens.map((token) => (
                  <option key={token.symbol} value={token.address}>
                    {token.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleAmountChange}
                />
                <Button size="icon" variant="ghost">
                  Max
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleSend}>
              Send
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default withAuth(Send);
