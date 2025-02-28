import { defineConfig } from "@wagmi/cli";
import { mock_abi, mock_usdc } from "./abi/mock_erc";
import { mint_abi, mint_address } from "./abi/dynamic_mint";
import { hook_abi, hook_address } from "./abi/hook_abi";

const contracts = [
  {
    name: "DynamicPoolBasedMinter",
    abi: mint_abi,
    address: mint_address,
  },
  {
    name: "MockERC20",
    abi: mock_abi,
    address: mock_usdc,
  },
  {
    name: "Hook",
    abi: hook_abi,
    address: hook_address,
  },
];

export default defineConfig({
  out: "src/generated.ts",
  contracts,

  plugins: [],
});
