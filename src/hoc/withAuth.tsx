import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSessionStorage } from "usehooks-ts";

const withAuth = (WrappedComponent) => {
  return (props) => {
    // Replace useAuth with useSessionStorage
    const [LoggedInUser] = useSessionStorage("LoggedInUser", null); // Assuming 'user' is the key for logged in user
    const isLoggedIn = Boolean(LoggedInUser);
    const router = useRouter();

    useEffect(() => {
      if (!isLoggedIn) {
        router.push("/onboard"); // Redirect to onboard if not logged in
      }
    }, [isLoggedIn, router]);

    return isLoggedIn ? <WrappedComponent {...props} /> : null; // or a loading indicator
  };
};

export default withAuth;
