//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DynamicPoolBasedMinter
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const dynamicPoolBasedMinterAbi = [
  {
    type: "constructor",
    inputs: [{ name: "_hook", internalType: "address", type: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "USDC",
    outputs: [
      { name: "", internalType: "contract MockERC20", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "usdcAmount", internalType: "uint256", type: "uint256" },
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
    ],
    name: "depositAndMint",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
    ],
    name: "getNOPrice",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
    ],
    name: "getYESPrice",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "hook",
    outputs: [{ name: "", internalType: "contract Hook", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "amount", internalType: "uint256", type: "uint256" }],
    name: "redeemTokenX",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "amount", internalType: "uint256", type: "uint256" }],
    name: "redeemTokenY",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "tokenX",
    outputs: [
      { name: "", internalType: "contract MockERC20", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "tokenY",
    outputs: [
      { name: "", internalType: "contract MockERC20", type: "address" },
    ],
    stateMutability: "view",
  },
] as const;

export const dynamicPoolBasedMinterAddress =
  "0x5B4f51ce66763F76C0aCe10628BC3df3b861908c" as const;

export const dynamicPoolBasedMinterConfig = {
  address: dynamicPoolBasedMinterAddress,
  abi: dynamicPoolBasedMinterAbi,
} as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Hook
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const hook_abi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "poolManager_",
        internalType: "contract IPoolManager",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "marketDescription", internalType: "string", type: "string" },
      { name: "registrationDelay", internalType: "uint256", type: "uint256" },
      { name: "marketLength", internalType: "uint256", type: "uint256" },
    ],
    name: "MakeMarket",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
      { name: "amtX", internalType: "uint256", type: "uint256" },
      { name: "amtY", internalType: "uint256", type: "uint256" },
    ],
    name: "addLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
      {
        name: "params",
        internalType: "struct IPoolManager.ModifyLiquidityParams",
        type: "tuple",
        components: [
          { name: "tickLower", internalType: "int24", type: "int24" },
          { name: "tickUpper", internalType: "int24", type: "int24" },
          { name: "liquidityDelta", internalType: "int256", type: "int256" },
          { name: "salt", internalType: "bytes32", type: "bytes32" },
        ],
      },
      { name: "delta", internalType: "BalanceDelta", type: "int256" },
      { name: "feesAccrued", internalType: "BalanceDelta", type: "int256" },
      { name: "hookData", internalType: "bytes", type: "bytes" },
    ],
    name: "afterAddLiquidity",
    outputs: [
      { name: "", internalType: "bytes4", type: "bytes4" },
      { name: "", internalType: "BalanceDelta", type: "int256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
      { name: "amount0", internalType: "uint256", type: "uint256" },
      { name: "amount1", internalType: "uint256", type: "uint256" },
      { name: "hookData", internalType: "bytes", type: "bytes" },
    ],
    name: "afterDonate",
    outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
      { name: "sqrtPriceX96", internalType: "uint160", type: "uint160" },
      { name: "tick", internalType: "int24", type: "int24" },
    ],
    name: "afterInitialize",
    outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
      {
        name: "params",
        internalType: "struct IPoolManager.ModifyLiquidityParams",
        type: "tuple",
        components: [
          { name: "tickLower", internalType: "int24", type: "int24" },
          { name: "tickUpper", internalType: "int24", type: "int24" },
          { name: "liquidityDelta", internalType: "int256", type: "int256" },
          { name: "salt", internalType: "bytes32", type: "bytes32" },
        ],
      },
      { name: "delta", internalType: "BalanceDelta", type: "int256" },
      { name: "feesAccrued", internalType: "BalanceDelta", type: "int256" },
      { name: "hookData", internalType: "bytes", type: "bytes" },
    ],
    name: "afterRemoveLiquidity",
    outputs: [
      { name: "", internalType: "bytes4", type: "bytes4" },
      { name: "", internalType: "BalanceDelta", type: "int256" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
      {
        name: "params",
        internalType: "struct IPoolManager.SwapParams",
        type: "tuple",
        components: [
          { name: "zeroForOne", internalType: "bool", type: "bool" },
          { name: "amountSpecified", internalType: "int256", type: "int256" },
          {
            name: "sqrtPriceLimitX96",
            internalType: "uint160",
            type: "uint160",
          },
        ],
      },
      { name: "delta", internalType: "BalanceDelta", type: "int256" },
      { name: "hookData", internalType: "bytes", type: "bytes" },
    ],
    name: "afterSwap",
    outputs: [
      { name: "", internalType: "bytes4", type: "bytes4" },
      { name: "", internalType: "int128", type: "int128" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
      {
        name: "params",
        internalType: "struct IPoolManager.ModifyLiquidityParams",
        type: "tuple",
        components: [
          { name: "tickLower", internalType: "int24", type: "int24" },
          { name: "tickUpper", internalType: "int24", type: "int24" },
          { name: "liquidityDelta", internalType: "int256", type: "int256" },
          { name: "salt", internalType: "bytes32", type: "bytes32" },
        ],
      },
      { name: "hookData", internalType: "bytes", type: "bytes" },
    ],
    name: "beforeAddLiquidity",
    outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
      { name: "amount0", internalType: "uint256", type: "uint256" },
      { name: "amount1", internalType: "uint256", type: "uint256" },
      { name: "hookData", internalType: "bytes", type: "bytes" },
    ],
    name: "beforeDonate",
    outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
      { name: "sqrtPriceX96", internalType: "uint160", type: "uint160" },
    ],
    name: "beforeInitialize",
    outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
      {
        name: "params",
        internalType: "struct IPoolManager.ModifyLiquidityParams",
        type: "tuple",
        components: [
          { name: "tickLower", internalType: "int24", type: "int24" },
          { name: "tickUpper", internalType: "int24", type: "int24" },
          { name: "liquidityDelta", internalType: "int256", type: "int256" },
          { name: "salt", internalType: "bytes32", type: "bytes32" },
        ],
      },
      { name: "hookData", internalType: "bytes", type: "bytes" },
    ],
    name: "beforeRemoveLiquidity",
    outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
      {
        name: "params",
        internalType: "struct IPoolManager.SwapParams",
        type: "tuple",
        components: [
          { name: "zeroForOne", internalType: "bool", type: "bool" },
          { name: "amountSpecified", internalType: "int256", type: "int256" },
          {
            name: "sqrtPriceLimitX96",
            internalType: "uint160",
            type: "uint160",
          },
        ],
      },
      { name: "hookData", internalType: "bytes", type: "bytes" },
    ],
    name: "beforeSwap",
    outputs: [
      { name: "", internalType: "bytes4", type: "bytes4" },
      { name: "", internalType: "BeforeSwapDelta", type: "int256" },
      { name: "", internalType: "uint24", type: "uint24" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "winner", internalType: "bool", type: "bool" }],
    name: "chooseWinner",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "getDecryptionShares",
    outputs: [{ name: "", internalType: "string[]", type: "string[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "getHookPermissions",
    outputs: [
      {
        name: "",
        internalType: "struct Hooks.Permissions",
        type: "tuple",
        components: [
          { name: "beforeInitialize", internalType: "bool", type: "bool" },
          { name: "afterInitialize", internalType: "bool", type: "bool" },
          { name: "beforeAddLiquidity", internalType: "bool", type: "bool" },
          { name: "afterAddLiquidity", internalType: "bool", type: "bool" },
          { name: "beforeRemoveLiquidity", internalType: "bool", type: "bool" },
          { name: "afterRemoveLiquidity", internalType: "bool", type: "bool" },
          { name: "beforeSwap", internalType: "bool", type: "bool" },
          { name: "afterSwap", internalType: "bool", type: "bool" },
          { name: "beforeDonate", internalType: "bool", type: "bool" },
          { name: "afterDonate", internalType: "bool", type: "bool" },
          { name: "beforeSwapReturnDelta", internalType: "bool", type: "bool" },
          { name: "afterSwapReturnDelta", internalType: "bool", type: "bool" },
          {
            name: "afterAddLiquidityReturnDelta",
            internalType: "bool",
            type: "bool",
          },
          {
            name: "afterRemoveLiquidityReturnDelta",
            internalType: "bool",
            type: "bool",
          },
        ],
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    inputs: [],
    name: "getKeys",
    outputs: [{ name: "", internalType: "string[]", type: "string[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "getMarket",
    outputs: [
      {
        name: "",
        internalType: "struct Market",
        type: "tuple",
        components: [
          { name: "description", internalType: "string", type: "string" },
          {
            name: "keyRegistrationExpiration",
            internalType: "uint256",
            type: "uint256",
          },
          { name: "expiration", internalType: "uint256", type: "uint256" },
          { name: "c1", internalType: "bytes", type: "bytes" },
          { name: "c2", internalType: "bytes", type: "bytes" },
          { name: "publicKeys", internalType: "string[]", type: "string[]" },
          {
            name: "partialDecripts",
            internalType: "string[]",
            type: "string[]",
          },
          { name: "isFinalized", internalType: "bool", type: "bool" },
          { name: "winner", internalType: "bool", type: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
    ],
    name: "getMarketState",
    outputs: [
      { name: "", internalType: "int256", type: "int256" },
      { name: "", internalType: "int256", type: "int256" },
      { name: "", internalType: "int256", type: "int256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
    ],
    name: "getPoolPrice",
    outputs: [{ name: "price", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "getWinner",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "isFinalized",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "market",
    outputs: [
      { name: "description", internalType: "string", type: "string" },
      {
        name: "keyRegistrationExpiration",
        internalType: "uint256",
        type: "uint256",
      },
      { name: "expiration", internalType: "uint256", type: "uint256" },
      { name: "c1", internalType: "bytes", type: "bytes" },
      { name: "c2", internalType: "bytes", type: "bytes" },
      { name: "isFinalized", internalType: "bool", type: "bool" },
      { name: "winner", internalType: "bool", type: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "newVote", internalType: "bytes", type: "bytes" }],
    name: "modifyVote",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "poolManager",
    outputs: [
      { name: "", internalType: "contract IPoolManager", type: "address" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "PoolId", type: "bytes32" }],
    name: "poolStates",
    outputs: [
      { name: "X_real", internalType: "uint256", type: "uint256" },
      { name: "Y_real", internalType: "uint256", type: "uint256" },
      { name: "L", internalType: "uint256", type: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      {
        name: "key",
        internalType: "struct PoolKey",
        type: "tuple",
        components: [
          { name: "currency0", internalType: "Currency", type: "address" },
          { name: "currency1", internalType: "Currency", type: "address" },
          { name: "fee", internalType: "uint24", type: "uint24" },
          { name: "tickSpacing", internalType: "int24", type: "int24" },
          { name: "hooks", internalType: "contract IHooks", type: "address" },
        ],
      },
      { name: "sharesToBurn", internalType: "uint256", type: "uint256" },
    ],
    name: "removeLiquidity",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "publicKey", internalType: "string", type: "string" }],
    name: "submitKey",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "partialDecript", internalType: "string", type: "string" },
    ],
    name: "submitPartialDecript",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "", internalType: "PoolId", type: "bytes32" }],
    name: "totalLiquidityShares",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [{ name: "data", internalType: "bytes", type: "bytes" }],
    name: "unlockCallback",
    outputs: [{ name: "", internalType: "bytes", type: "bytes" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "", internalType: "PoolId", type: "bytes32" },
      { name: "", internalType: "address", type: "address" },
    ],
    name: "userLiquidityShares",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  { type: "error", inputs: [], name: "HookNotCalledByPoolManager" },
  { type: "error", inputs: [], name: "HookNotImplemented" },
  { type: "error", inputs: [], name: "Min" },
  { type: "error", inputs: [], name: "NotPoolManager" },
] as const;

export const hook_address =
  "0x78A5F1eFaA6533975C4B220cdC8a990956A08888" as const;

export const hookConfig = { address: hook_address, abi: hook_abi } as const;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MockERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const mockErc20Abi = [
  {
    type: "constructor",
    inputs: [
      { name: "name", internalType: "string", type: "string" },
      { name: "symbol", internalType: "string", type: "string" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "owner", internalType: "address", type: "address" },
      { name: "spender", internalType: "address", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [{ name: "account", internalType: "address", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "amount", internalType: "uint256", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [],
    name: "name",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", internalType: "string", type: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    inputs: [
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    inputs: [
      { name: "from", internalType: "address", type: "address" },
      { name: "to", internalType: "address", type: "address" },
      { name: "value", internalType: "uint256", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ name: "", internalType: "bool", type: "bool" }],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      {
        name: "owner",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "spender",
        internalType: "address",
        type: "address",
        indexed: true,
      },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Approval",
  },
  {
    type: "event",
    anonymous: false,
    inputs: [
      { name: "from", internalType: "address", type: "address", indexed: true },
      { name: "to", internalType: "address", type: "address", indexed: true },
      {
        name: "value",
        internalType: "uint256",
        type: "uint256",
        indexed: false,
      },
    ],
    name: "Transfer",
  },
  {
    type: "error",
    inputs: [
      { name: "spender", internalType: "address", type: "address" },
      { name: "allowance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC20InsufficientAllowance",
  },
  {
    type: "error",
    inputs: [
      { name: "sender", internalType: "address", type: "address" },
      { name: "balance", internalType: "uint256", type: "uint256" },
      { name: "needed", internalType: "uint256", type: "uint256" },
    ],
    name: "ERC20InsufficientBalance",
  },
  {
    type: "error",
    inputs: [{ name: "approver", internalType: "address", type: "address" }],
    name: "ERC20InvalidApprover",
  },
  {
    type: "error",
    inputs: [{ name: "receiver", internalType: "address", type: "address" }],
    name: "ERC20InvalidReceiver",
  },
  {
    type: "error",
    inputs: [{ name: "sender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSender",
  },
  {
    type: "error",
    inputs: [{ name: "spender", internalType: "address", type: "address" }],
    name: "ERC20InvalidSpender",
  },
] as const;

export const mockErc20Address =
  "0x5136F547156eA4931D1bDad01407Af5A41d93004" as const;

export const mockErc20Config = {
  address: mockErc20Address,
  abi: mockErc20Abi,
} as const;
