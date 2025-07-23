import React from "react";
import { X, Wallet, Shield, Zap } from "lucide-react";
import { Connector, useConnect } from "@starknet-react/core";
import toast from "react-hot-toast";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string | undefined;
}

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  address,
}) => {
  const { connectAsync, connectors } = useConnect();

  if (!isOpen || address) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const onConnectHandler = async (connector: Connector) => {
    try {
      await connectAsync({ connector });
      toast.success("Wallet successfully connected");
    } catch (error) {
      toast.error("There was an error connecting your wallet");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-out scale-100 opacity-100 dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-200">
              Connect Wallet
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-sm mb-6 dark:text-slate-400">
            Choose your preferred wallet to connect to the application
          </p>

          <ul className="space-y-3">
            {/* ArgentX Wallet */}
            {connectors.map((connector) => (
              <li key={connector.id}>
                <button
                  onClick={() => onConnectHandler(connector)}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl transition-all duration-200 group dark:border-gray-600 hover:border-orange-300 hover:bg-orange-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                      {connector.name?.toLowerCase() === "ready wallet" ? (
                        <Shield className="w-5 h-5 text-white" />
                      ) : (
                        <Zap className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 dark:text-slate-300 group-hover:text-gray-800">
                        Connect to{" "}
                        <span className="capitalize">{connector.name}</span>
                      </h3>
                      <p className="text-sm text-gray-500">
                        Secure StarkNet wallet
                      </p>
                    </div>
                  </div>
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center group-hover:border-orange-500 transition-colors duration-200">
                    <div className="w-2 h-2 bg-transparent group-hover:bg-orange-500 rounded-full transition-colors duration-200"></div>
                  </div>
                </button>
              </li>
            ))}

            {/* Braavos Wallet
            <button
              onClick={() => onConnectWallet("braavos")}
              className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 group"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">
                    Connect to Braavos
                  </h3>
                  <p className="text-sm text-gray-500">
                    Advanced StarkNet wallet
                  </p>
                </div>
              </div>
              <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center group-hover:border-purple-500 transition-colors duration-200">
                <div className="w-2 h-2 bg-transparent group-hover:bg-purple-500 rounded-full transition-colors duration-200"></div>
              </div>
            </button> */}
          </ul>

          {/* Footer */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
            <p className="text-xs text-gray-500 text-center dark:text-slate-300">
              By connecting, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletModal;
