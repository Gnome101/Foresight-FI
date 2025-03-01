export const hook_address = "0x456ad05e7aa5e6967e441c86661ffbe9c968c888";
export const hook_abi = [
  {
    type: "constructor",
    inputs: [
      {
        name: "poolManager_",
        type: "address",
        internalType: "contract IPoolManager",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "MakeMarket",
    inputs: [
      { name: "marketDescription", type: "string", internalType: "string" },
      { name: "registrationDelay", type: "uint256", internalType: "uint256" },
      { name: "marketLength", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "addLiquidity",
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
      { name: "amtX", type: "uint256", internalType: "uint256" },
      { name: "amtY", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "afterAddLiquidity",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
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
      {
        name: "params",
        type: "tuple",
        internalType: "struct IPoolManager.ModifyLiquidityParams",
        components: [
          { name: "tickLower", type: "int24", internalType: "int24" },
          { name: "tickUpper", type: "int24", internalType: "int24" },
          { name: "liquidityDelta", type: "int256", internalType: "int256" },
          { name: "salt", type: "bytes32", internalType: "bytes32" },
        ],
      },
      { name: "delta", type: "int256", internalType: "BalanceDelta" },
      { name: "feesAccrued", type: "int256", internalType: "BalanceDelta" },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [
      { name: "", type: "bytes4", internalType: "bytes4" },
      { name: "", type: "int256", internalType: "BalanceDelta" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "afterDonate",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
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
      { name: "amount0", type: "uint256", internalType: "uint256" },
      { name: "amount1", type: "uint256", internalType: "uint256" },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "afterInitialize",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
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
      { name: "sqrtPriceX96", type: "uint160", internalType: "uint160" },
      { name: "tick", type: "int24", internalType: "int24" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "afterRemoveLiquidity",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
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
      {
        name: "params",
        type: "tuple",
        internalType: "struct IPoolManager.ModifyLiquidityParams",
        components: [
          { name: "tickLower", type: "int24", internalType: "int24" },
          { name: "tickUpper", type: "int24", internalType: "int24" },
          { name: "liquidityDelta", type: "int256", internalType: "int256" },
          { name: "salt", type: "bytes32", internalType: "bytes32" },
        ],
      },
      { name: "delta", type: "int256", internalType: "BalanceDelta" },
      { name: "feesAccrued", type: "int256", internalType: "BalanceDelta" },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [
      { name: "", type: "bytes4", internalType: "bytes4" },
      { name: "", type: "int256", internalType: "BalanceDelta" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "afterSwap",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
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
      {
        name: "params",
        type: "tuple",
        internalType: "struct IPoolManager.SwapParams",
        components: [
          { name: "zeroForOne", type: "bool", internalType: "bool" },
          { name: "amountSpecified", type: "int256", internalType: "int256" },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
        ],
      },
      { name: "delta", type: "int256", internalType: "BalanceDelta" },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [
      { name: "", type: "bytes4", internalType: "bytes4" },
      { name: "", type: "int128", internalType: "int128" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "beforeAddLiquidity",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
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
      {
        name: "params",
        type: "tuple",
        internalType: "struct IPoolManager.ModifyLiquidityParams",
        components: [
          { name: "tickLower", type: "int24", internalType: "int24" },
          { name: "tickUpper", type: "int24", internalType: "int24" },
          { name: "liquidityDelta", type: "int256", internalType: "int256" },
          { name: "salt", type: "bytes32", internalType: "bytes32" },
        ],
      },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "beforeDonate",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
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
      { name: "amount0", type: "uint256", internalType: "uint256" },
      { name: "amount1", type: "uint256", internalType: "uint256" },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "beforeInitialize",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
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
      { name: "sqrtPriceX96", type: "uint160", internalType: "uint160" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "beforeRemoveLiquidity",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
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
      {
        name: "params",
        type: "tuple",
        internalType: "struct IPoolManager.ModifyLiquidityParams",
        components: [
          { name: "tickLower", type: "int24", internalType: "int24" },
          { name: "tickUpper", type: "int24", internalType: "int24" },
          { name: "liquidityDelta", type: "int256", internalType: "int256" },
          { name: "salt", type: "bytes32", internalType: "bytes32" },
        ],
      },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "beforeSwap",
    inputs: [
      { name: "sender", type: "address", internalType: "address" },
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
      {
        name: "params",
        type: "tuple",
        internalType: "struct IPoolManager.SwapParams",
        components: [
          { name: "zeroForOne", type: "bool", internalType: "bool" },
          { name: "amountSpecified", type: "int256", internalType: "int256" },
          {
            name: "sqrtPriceLimitX96",
            type: "uint160",
            internalType: "uint160",
          },
        ],
      },
      { name: "hookData", type: "bytes", internalType: "bytes" },
    ],
    outputs: [
      { name: "", type: "bytes4", internalType: "bytes4" },
      { name: "", type: "int256", internalType: "BeforeSwapDelta" },
      { name: "", type: "uint24", internalType: "uint24" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "chooseWinner",
    inputs: [{ name: "winner", type: "bool", internalType: "bool" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getDecryptionShares",
    inputs: [],
    outputs: [{ name: "", type: "string[]", internalType: "string[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getHookPermissions",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Hooks.Permissions",
        components: [
          { name: "beforeInitialize", type: "bool", internalType: "bool" },
          { name: "afterInitialize", type: "bool", internalType: "bool" },
          { name: "beforeAddLiquidity", type: "bool", internalType: "bool" },
          { name: "afterAddLiquidity", type: "bool", internalType: "bool" },
          { name: "beforeRemoveLiquidity", type: "bool", internalType: "bool" },
          { name: "afterRemoveLiquidity", type: "bool", internalType: "bool" },
          { name: "beforeSwap", type: "bool", internalType: "bool" },
          { name: "afterSwap", type: "bool", internalType: "bool" },
          { name: "beforeDonate", type: "bool", internalType: "bool" },
          { name: "afterDonate", type: "bool", internalType: "bool" },
          { name: "beforeSwapReturnDelta", type: "bool", internalType: "bool" },
          { name: "afterSwapReturnDelta", type: "bool", internalType: "bool" },
          {
            name: "afterAddLiquidityReturnDelta",
            type: "bool",
            internalType: "bool",
          },
          {
            name: "afterRemoveLiquidityReturnDelta",
            type: "bool",
            internalType: "bool",
          },
        ],
      },
    ],
    stateMutability: "pure",
  },
  {
    type: "function",
    name: "getKeys",
    inputs: [],
    outputs: [{ name: "", type: "string[]", internalType: "string[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMarket",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct Market",
        components: [
          { name: "description", type: "string", internalType: "string" },
          {
            name: "keyRegistrationExpiration",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "expiration", type: "uint256", internalType: "uint256" },
          { name: "c1", type: "bytes", internalType: "bytes" },
          { name: "c2", type: "bytes", internalType: "bytes" },
          { name: "publicKeys", type: "string[]", internalType: "string[]" },
          {
            name: "partialDecripts",
            type: "string[]",
            internalType: "string[]",
          },
          { name: "isFinalized", type: "bool", internalType: "bool" },
          { name: "winner", type: "bool", internalType: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMarketState",
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
    outputs: [
      { name: "", type: "int256", internalType: "int256" },
      { name: "", type: "int256", internalType: "int256" },
      { name: "", type: "int256", internalType: "int256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getPoolPrice",
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
    outputs: [{ name: "price", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getWinner",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isFinalized",
    inputs: [],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "market",
    inputs: [],
    outputs: [
      { name: "description", type: "string", internalType: "string" },
      {
        name: "keyRegistrationExpiration",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "expiration", type: "uint256", internalType: "uint256" },
      { name: "c1", type: "bytes", internalType: "bytes" },
      { name: "c2", type: "bytes", internalType: "bytes" },
      { name: "isFinalized", type: "bool", internalType: "bool" },
      { name: "winner", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "modifyVote",
    inputs: [{ name: "newVote", type: "bytes", internalType: "bytes" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "poolManager",
    inputs: [],
    outputs: [
      { name: "", type: "address", internalType: "contract IPoolManager" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "poolStates",
    inputs: [{ name: "", type: "bytes32", internalType: "PoolId" }],
    outputs: [
      { name: "X_real", type: "uint256", internalType: "uint256" },
      { name: "Y_real", type: "uint256", internalType: "uint256" },
      { name: "L", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "removeLiquidity",
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
      { name: "sharesToBurn", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "submitKey",
    inputs: [{ name: "publicKey", type: "string", internalType: "string" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "submitPartialDecript",
    inputs: [
      { name: "partialDecript", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "totalLiquidityShares",
    inputs: [{ name: "", type: "bytes32", internalType: "PoolId" }],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "unlockCallback",
    inputs: [{ name: "data", type: "bytes", internalType: "bytes" }],
    outputs: [{ name: "", type: "bytes", internalType: "bytes" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "userLiquidityShares",
    inputs: [
      { name: "", type: "bytes32", internalType: "PoolId" },
      { name: "", type: "address", internalType: "address" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  { type: "error", name: "HookNotCalledByPoolManager", inputs: [] },
  { type: "error", name: "HookNotImplemented", inputs: [] },
  { type: "error", name: "Min", inputs: [] },
  { type: "error", name: "NotPoolManager", inputs: [] },
] as const;
