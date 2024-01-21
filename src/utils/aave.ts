const {
  ChainId,
  UiIncentiveDataProvider,
  UiPoolDataProvider,
} = require("@aave/contract-helpers");
import * as markets from "@bgd-labs/aave-address-book";

const ethers = require("ethers");

// Sample RPC address for querying ETH mainnet
const provider = new ethers.providers.JsonRpcProvider(
  "https://rpc.sepolia.org"
);

// User address to fetch data for, insert address here

// View contract used to fetch all reserves data (including market base currency data), and user reserves
// Using Aave V3 Eth Mainnet address for demo
const poolDataProviderContract = new UiPoolDataProvider({
  uiPoolDataProviderAddress: markets.AaveV3Sepolia.UI_POOL_DATA_PROVIDER,
  provider,
  chainId: ChainId.mainnet,
});

// View contract used to fetch all reserve incentives (APRs), and user incentives
// Using Aave V3 Eth Mainnet address for demo
const incentiveDataProviderContract = new UiIncentiveDataProvider({
  uiIncentiveDataProviderAddress:
    markets.AaveV3Sepolia.UI_INCENTIVE_DATA_PROVIDER,
  provider,
  chainId: ChainId.mainnet,
});

export async function fetchContractData(currentAccount: string) {
  // Object containing array of pool reserves and market base currency data
  // { reservesArray, baseCurrencyData }
  const reserves = await poolDataProviderContract.getReservesHumanized({
    lendingPoolAddressProvider: markets.AaveV3Sepolia.POOL_ADDRESSES_PROVIDER,
  });

  // Object containing array or users aave positions and active eMode category
  // { userReserves, userEmodeCategoryId }
  // Filter the reserves array to include only the specified names
  const filteredReserves = reserves.reservesData.filter((reserve) =>
    ["USDT", "GHO", "WETH"].includes(reserve.symbol)
  );

  // Return only the filtered reserves
  return { reserves: { ...reserves, reservesData: filteredReserves } };
}
