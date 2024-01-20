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
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const send = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
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
              <Input id="address" placeholder="Enter recipient's address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset">Asset</Label>
              <Select>
                <SelectTrigger id="asset">
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="eth">ETH</SelectItem>
                  <SelectItem value="GHO">GHO</SelectItem>
                  <SelectItem value="usdc">USDC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex items-center space-x-2">
                <Input id="amount" placeholder="Enter amount" />
                <Button size="icon" variant="ghost">
                  Max
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Send
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default withAuth(send);
