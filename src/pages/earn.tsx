import withAuth from "@/hoc/withAuth";

import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";

const SupplyAssets = [
  {
    image:
      "https://token-icons.s3.amazonaws.com/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
    name: "Ethereum",
    apy: "2",
  },
];
const borrowAssets = [
  {
    image: "https://app.aave.com/icons/tokens/gho.svg",
    name: "GHO",
    apy: "2.12",
  },
];

const earn = () => {
  return (
    <>
      <Tabs className="w-full mt-4" defaultValue="supply">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="supply">Supply</TabsTrigger>
          <TabsTrigger value="borrow">Borrow</TabsTrigger>
        </TabsList>
        <TabsContent value="supply">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]"></TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>APY</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SupplyAssets.map((asset) => (
                <TableRow key={asset.apy}>
                  <TableCell>
                    <img
                      alt="Asset Image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={asset.image}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.apy}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="borrow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]"></TableHead>
                <TableHead>Asset</TableHead>
                <TableHead>APY</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowAssets.map((asset) => (
                <TableRow key={asset.apy}>
                  <TableCell>
                    <img
                      alt="Asset Image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={asset.image}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.apy}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default withAuth(earn);
