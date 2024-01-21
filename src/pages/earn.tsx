import withAuth from "@/hoc/withAuth";
import { useEffect, useState } from "react";
import { TabsTrigger, TabsList, TabsContent, Tabs } from "@/components/ui/tabs";
import { useApplicationContext } from "@/context/ApplicationContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const { fetchContractData } = require("@/utils/aave");
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const earn = () => {
  const [reserves, setReserves] = useState([]); // Initialize as an empty array
  const [selectedReserve, setSelectedReserve] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { supplyAave, borrowAave } = useApplicationContext();

  const [amount, setAmount] = useState("");

  // Handler to update the state
  const handleInputChange = (event) => {
    setAmount(event.target.value);
  };

  // Function to log the current state
  const supplyAsset = async (underlyingAsset, decimals) => {
    const addressOfUser = sessionStorage.getItem("addressOfUser");
    console.log("Selected Asset :", underlyingAsset);
    console.log("Amount:", amount);
    console.log("decimals", decimals);
    console.log(addressOfUser);
    await supplyAave(underlyingAsset, addressOfUser, amount, decimals);
  };

  const handleOpenDialog = (reserve) => {
    setSelectedReserve(reserve);
    setIsDialogOpen(true);
  };

  // Function to close the dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchContractData(
          "0x9e51BB5169931ee745d44F01168172c80678B628"
        );
        // Check if data.userReserves.reservesData is an array
        console.log(data.reservesData);
        if (Array.isArray(data.reserves.reservesData)) {
          console.log(data.reserves.reservesData);
          setReserves(data.reserves.reservesData);
        } else {
          console.error(
            "userReserves.userReserves is not an array:",
            data.reserves.reservesData
          );
        }
      } catch (error) {
        console.error("Failed to fetch contract data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once

  const calculateAPY = (rate) => {
    return ((parseFloat(rate) / 1e27) * 100).toFixed(2); // Example conversion
  };
  return (
    <>
      <Tabs className="w-full mt-4" defaultValue="supply">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="supply">Supply</TabsTrigger>
          <TabsTrigger value="borrow">Borrow</TabsTrigger>
        </TabsList>

        <TabsContent value="supply">
          {reserves.map((reserve) => (
            <Card key={reserve.id}>
              <CardHeader>
                <CardTitle> {reserve.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Supply {calculateAPY(reserve.liquidityRate)}%</p>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger>
                    <div className="flex items-center justify-center mb-5 w-full">
                      <Button variant="default" className="w-full">
                        Supply
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent>
                    <Card className="w-full max-w-md rounded-lg shadow-md">
                      <CardHeader>
                        <CardTitle>Supply {reserve.symbol}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col space-y-4">
                          <div className="flex flex-col space-y-1">
                            <span>Amount</span>
                            <div className="flex items-center space-x-2">
                              <Input
                                className="flex-grow"
                                id="amount"
                                placeholder="0.00"
                                value={amount}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <h3 className="text-lg font-semibold">
                              Transaction overview
                            </h3>
                            <div className="flex justify-between">
                              <span>Supply APY</span>
                              <span className="text-gray-500">
                                {calculateAPY(reserve.liquidityRate)}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Button
                              className="flex-grow"
                              onClick={() =>
                                supplyAsset(
                                  reserve.underlyingAsset,
                                  reserve.decimals
                                )
                              }
                            >
                              Supply {reserve.symbol}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="borrow">
          {reserves.map((reserve) => (
            <>
              <Card key={reserve.id}>
                <CardHeader>
                  <CardTitle> {reserve.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Variable Borrow rate :{" "}
                    {calculateAPY(reserve.variableBorrowRate)}%
                  </p>
                  <p>
                    {" "}
                    Reserve Stable Borrow Rate{" "}
                    {calculateAPY(reserve.stableBorrowRate)}%
                  </p>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger>
                      <div className="flex items-center justify-center mb-5 w-full">
                        <Button variant="default" className="w-full">
                          Borrow{" "}
                        </Button>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <Card className="w-full max-w-md rounded-lg shadow-md">
                        <CardHeader>
                          <CardTitle>Borrow {reserve.symbol}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-1">
                              <span>Amount</span>
                              <div className="flex items-center space-x-2">
                                <Input
                                  className="flex-grow"
                                  id="amount"
                                  placeholder="0.00"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <h3 className="text-lg font-semibold">
                                Transaction overview
                              </h3>
                              <div className="flex justify-between">
                                <span> Variable Borrow rate : </span>
                                <span className="text-gray-500">
                                  {calculateAPY(reserve.variableBorrowRate)}%
                                </span>
                              </div>

                              <p className="text-sm text-gray-500">{`Liquidation at <1.0`}</p>
                            </div>
                            <div className="flex items-center justify-between">
                              <Button className="flex-grow">
                                Borrow {reserve.symbol}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </>
          ))}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default withAuth(earn);
