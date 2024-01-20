import * as React from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { QrCodeIcon, CopyIcon } from "lucide-react";
import { useApplicationContext } from "@/context/ApplicationContext";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

const QrCodeModal = () => {
  const { accountAddress } = useApplicationContext();

  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const triggerButton = (
    <Button onClick={() => setOpen(true)} disabled={!accountAddress}>
      <QrCodeIcon className="mr-2" /> QR Code
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Address QRCODE</DialogTitle>
            <DialogDescription>
              Only send funds to this address in the Sepolia Network
            </DialogDescription>
          </DialogHeader>
          <QrCodeCard />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>QR code</DrawerTitle>
          <DrawerDescription>
            Only send funds to this address in the Sepolia Network
          </DrawerDescription>
        </DrawerHeader>
        <QrCodeCard className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

function QrCodeCard({}: React.ComponentProps<"form">) {
  // Handle change in the address input

  const { accountAddress } = useApplicationContext();
  const copyAddressToClipboard = () => {
    if (navigator.clipboard && accountAddress) {
      navigator.clipboard
        .writeText(accountAddress)
        .then(() => {
          toast("Address Copied to clipboard");
        })
        .catch((err) => {
          console.error("Error in copying text: ", err);
          toast("Failed to copy address");
        });
    }
  };
  return (
    <Card>
      <CardContent>
        <QRCodeSVG className="w-full h-full mt-5" value={accountAddress} />
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center mb-5 w-full space-y-4">
        <span className="text-center">
          Only send funds to this address in the Sepolia Network
        </span>
        <Button className="w-full mt-4" onClick={copyAddressToClipboard}>
          {" "}
          {/* You can adjust mt-4 to increase or decrease the space */}
          <CopyIcon /> Copy Address
        </Button>
      </CardFooter>
    </Card>
  );
}

export default QrCodeModal;
