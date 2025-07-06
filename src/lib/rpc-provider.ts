import { RpcProvider } from "starknet";

export const provider = new RpcProvider({
  nodeUrl: import.meta.env.VITE_ALCHEMY_RPC,
});
