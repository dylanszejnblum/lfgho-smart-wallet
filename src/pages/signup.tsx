import { useState } from "react";
import { useApplicationContext } from "@/context/ApplicationContext";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogContent,
  Dialog,
} from "@/components/ui/dialog";
import { useRouter } from "next/router";

const signup = () => {
  const { handlePasskeyCreation, accountAddress, handleUsernameCreation } =
    useApplicationContext();

  const [userNameInput, setUsernameInput] = useState<string>("");
  const [passkeyInput, setPasskeyInput] = useState<string>("");

  const router = useRouter();

  const handleUsernameChange = (event) => {
    setUsernameInput(event.target.value);
  };

  // Handler for updating passkey input
  const handlePasskeyChange = (event) => {
    setPasskeyInput(event.target.value);
  };

  const createPasskey = (passkeyName: string) => {
    handlePasskeyCreation({}, passkeyName);
  };

  const createUsername = (username: string, passkeyName: string) => {
    handleUsernameCreation(username, passkeyName);
    router.push("/login");
  };
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen ">
        <div className="w-full max-w-md">
          <Card className="">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                Create your account
              </CardTitle>
              <CardDescription>Input a name for your passkey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="passkeys">Passkey name</Label>
                    <Input
                      id="passkeys"
                      required
                      onChange={handlePasskeyChange}
                      value={passkeyInput}
                    />
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => {
                        createPasskey(passkeyInput);
                      }}
                    >
                      Create Passkey
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Backup your account with a Username
                      </DialogTitle>
                      <DialogDescription>
                        Create a username so you can backup your account and
                        send and receive money easily
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          required
                          type="text"
                          onChange={handleUsernameChange}
                          value={userNameInput}
                        />
                      </div>

                      <Button
                        className="w-full"
                        type="submit"
                        onClick={() => {
                          createUsername(userNameInput, passkeyInput);
                        }}
                      >
                        Create Username
                      </Button>
                      <div className="mt-4 text-center text-sm">
                        Dont wannt a username{" "}
                        <Link className="underline" href="/login">
                          skip it
                        </Link>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link className="underline" href="/login">
                  Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default signup;
