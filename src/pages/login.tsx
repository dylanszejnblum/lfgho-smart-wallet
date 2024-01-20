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

const login = () => {
  const [userNameInput, setUsernameInput] = useState<string>("");
  const [passkeyInput, setPasskeyInput] = useState<string>("");
  const { handleLogin } = useApplicationContext();
  const router = useRouter();

  const handleUsernameChange = (event) => {
    setUsernameInput(event.target.value);
  };

  // Handler for updating passkey input
  const handlePasskeyChange = (event) => {
    setPasskeyInput(event.target.value);
  };

  const redirectLogin = async (typeOfAuth: any, input: string) => {
    try {
      const loginResult = await handleLogin(typeOfAuth, input);
      if (loginResult) {
        // Redirect to the /wallet route on successful login
        router.push("/wallet");
      } else {
        // Handle the failed login scenario
        console.error("Login failed:");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="w-full max-w-md">
        <Card className="">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Login to your account
            </CardTitle>
            <CardDescription>
              Select your preferred method of authentication
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full mb-4" variant="outline">
                    Login with Passkeys
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Login with Passkeys</DialogTitle>
                    <DialogDescription>
                      Enter your passkey name below to login to your account
                    </DialogDescription>
                  </DialogHeader>
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
                    <Button
                      onClick={() => {
                        redirectLogin("passkey_name", passkeyInput);
                      }}
                      className="w-full"
                      type="submit"
                    >
                      Login
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" variant="outline">
                    Login with Username
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Login with Username</DialogTitle>
                    <DialogDescription>
                      Enter your username to login to your account
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
                        redirectLogin("username", userNameInput);
                      }}
                    >
                      Login
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?
              <Link className="underline" href="/signup">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default login;
