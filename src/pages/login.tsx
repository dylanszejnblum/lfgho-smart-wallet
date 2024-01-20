import { useApplicationContext } from "@/context/ApplicationContext";
import { Button } from "@/components/ui/button";

const login = () => {
  const { handleLogin } = useApplicationContext();
  return (
    <div>
      <Button
        onClick={() => {
          handleLogin("passkey_name", "test");
        }}
      >
        Login with passkey
      </Button>
      <Button
        onClick={() => {
          handleLogin("username", "test");
        }}
      >
        Login with username
      </Button>
    </div>
  );
};

export default login;
