export const mint_address = "0x39caea288013b3b8b141db23cba39b8674036295";
export const mint_abi = [
  {
    type: "constructor",
    inputs: [{ name: "_hook", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "USDC",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract MockERC20" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "createMarket",
    inputs: [
      {
        name: "key",
        type: "tuple",
        internalType: "struct PoolKey",
        components: [
          { name: "currency0", type: "address", internalType: "Currency" },
          { name: "currency1", type: "address", internalType: "Currency" },
          { name: "fee", type: "uint24", internalType: "uint24" },
          { name: "tickSpacing", type: "int24", internalType: "int24" },
          { name: "hooks", type: "address", internalType: "contract IHooks" },
        ],
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "depositAndMint",
    inputs: [{ name: "usdcAmount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getNOPrice",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getYESPrice",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hook",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract Hook" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "poolKey",
    inputs: [],
    outputs: [
      { name: "currency0", type: "address", internalType: "Currency" },
      { name: "currency1", type: "address", internalType: "Currency" },
      { name: "fee", type: "uint24", internalType: "uint24" },
      { name: "tickSpacing", type: "int24", internalType: "int24" },
      { name: "hooks", type: "address", internalType: "contract IHooks" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "redeemTokenX",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "redeemTokenY",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "startMarket",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "tokenX",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract MockERC20" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "tokenY",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract MockERC20" },
    ],
    stateMutability: "view",
  },
] as const;
