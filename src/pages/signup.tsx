import { useApplicationContext } from "@/context/ApplicationContext";
import { Button } from "@/components/ui/button";
const signup = () => {
  const { handlePasskeyCreation, accountAddress, handleUsernameCreation } =
    useApplicationContext();
  return (
    <div>
      <Button
        onClick={() => {
          handlePasskeyCreation({}, "testo");
        }}
      >
        Create Passkey
      </Button>

      {accountAddress}

      <Button
        onClick={() => {
          handleUsernameCreation("testo", "testo");
        }}
      >
        Handle username creation
      </Button>
    </div>
  );
};

export default signup;
