import React from "react";

import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  braavos,
  useInjectedConnectors,
  voyager,
  argent as ready,
  jsonRpcProvider,
} from "@starknet-react/core";

const provider = jsonRpcProvider({
  rpc: () => ({
    nodeUrl:
      "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_8/pH41rX9iiwIa_4WDhyb_znunwrpuUUlF",
  }),
});

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [ready(), braavos()],
    // Hide recommended connectors if the user has any connector installed.
    // includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "alphabetical",
  });

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={connectors}
      explorer={voyager}
      autoConnect={true}
    >
      {children}
    </StarknetConfig>
  );
}
