import withAuth from "@/hoc/withAuth";
import { useApplicationContext } from "@/context/ApplicationContext";
import { Button } from "@/components/ui/button";
import { InterestRate } from "@aave/contract-helpers";
const groups = () => {
  const { sendErc20, accountAddress, supplyAave, borrowAave } =
    useApplicationContext();
  return (
    <div>
      <Button
        onClick={() => {
          supplyAave(
            "0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0",
            "0x790E61b5B6Be0776CFaBEB587D6eF707D0be31c0",
            "3",
            6
          );
        }}
      >
        Supply aave
      </Button>

      <Button
        onClick={() => {
          console.log(InterestRate.Stable);
        }}
      >
        borrow aave
      </Button>
    </div>
  );
};

export default withAuth(groups);
