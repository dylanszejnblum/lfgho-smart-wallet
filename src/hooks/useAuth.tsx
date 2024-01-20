import { useEffect, useState } from "react";
import { useSessionStorage } from "usehooks-ts";

export function useAuth() {
  const [LoggedInUser] = useSessionStorage("LoggedInUser", null); // Get 'user' from session storage
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!LoggedInUser); // Set to true if LoggedInUser is not null
  }, [LoggedInUser]); // Dependency on LoggedInUser

  return isLoggedIn;
}
