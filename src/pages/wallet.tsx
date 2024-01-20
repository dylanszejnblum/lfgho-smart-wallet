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
const wallet = () => {
  return (
    <>
      <div className=" p-6 max-w-sm mx-auto">
        <h1 className="text-2xl font-semibold text-center">My Balance</h1>
        <p className="text-6xl font-bold text-center my-4">9.44 Gho</p>
        <div className="flex justify-between my-6">
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
              <TableRow>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Plane className="h-5 w-5 green-red-500" />
                    <span>Avalanche</span>
                  </div>
                </TableCell>
                <TableCell>36.18</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};

export default withAuth(wallet);
