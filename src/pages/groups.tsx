import withAuth from "@/hoc/withAuth";
import { useApplicationContext } from "@/context/ApplicationContext";
import { Button } from "@/components/ui/button";
const groups = () => {
  const { sendErc20, accountAddress } = useApplicationContext();
  return (
    <div>
      <Button
        onClick={() => {
          sendErc20(
            "0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0",
            "0x9e51BB5169931ee745d44F01168172c80678B628",
            "0.5",
            6
          );
        }}
      >
        Approve erc20
      </Button>
    </div>
  );
};

export default withAuth(groups);
