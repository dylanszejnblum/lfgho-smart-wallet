import withAuth from "@/hoc/withAuth";
import { useApplicationContext } from "@/context/ApplicationContext";
import { Button } from "@/components/ui/button";
const groups = () => {
  const { approveErc20, accountAddress } = useApplicationContext();
  return (
    <div>
      <Button
        onClick={() => {
          approveErc20(
            "0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0",
            "0x790E61b5B6Be0776CFaBEB587D6eF707D0be31c0",
            "1",
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
