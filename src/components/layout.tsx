import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Home, Menu, Moon, Sun, X } from "lucide-react";
import { useAccount, useDisconnect } from "@starknet-react/core";
import WalletModal from "./shared/wallet-modal";
import classNames from "classnames";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openWalletModal, setOpenWalletModal] = useState(false);

  const { isDark, toggleTheme } = useTheme();

  const { disconnectAsync } = useDisconnect();
  const { address } = useAccount();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Create Bootcamp", href: "/create-bootcamp", icon: BookOpen },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const onDisconnectWalletHandler = async () => {
    try {
      setOpenWalletModal(false);
      await disconnectAsync();
      toast.error("Wallet has been disconnected");
    } catch (error) {
      toast.error("There was an error connecting your wallet");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              BootTrack
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary-100 text-primary-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-600 dark:shadow-sm dark:shadow-gray-600">
          <div className="flex h-16 items-center px-4 border-b dark:border-b-gray-600 dark:shadow-sm dark:shadow-gray-600">
            <h1 className="text-xl font-bold text-gray-900 dark:text-slate-200">
              BootTrack
            </h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-gray-700 dark:hover:text-slate-200",
                    {
                      "bg-primary-100 text-primary-700 dark:bg-slate-600 dark:text-slate-50":
                        isActive(item.href),
                    }
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:shadow-gray-600 sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 gap-x-4 justify-between lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />
              <div
                className={classNames(
                  "flex items-center gap-x-4 text-sm font-medium text-gray-900 dark:text-slate-200"
                )}
              >
                Connected Wallet:{" "}
                {address ? (
                  <span className="text-green-600">
                    {address?.slice(0, 6)}....
                    {address?.slice(-4)}
                  </span>
                ) : (
                  <span className="text-gray-900 dark:text-slate-200">Nil</span>
                )}
              </div>
            </div>
            <div className="flex space-x-6 items-center">
              {!address ? (
                <button
                  className={classNames(
                    `flex items-center text-white text-center px-8 py-2 rounded-lg text-sm font-medium bg-blue-800 transition-colors hover:bg-blue-600 dark:bg-slate-200 dark:text-gray-800`
                  )}
                  onClick={() => setOpenWalletModal((prev) => !prev)}
                >
                  connect a Wallet
                </button>
              ) : (
                <button
                  className={classNames(
                    `flex items-center text-white text-center px-8 py-2 rounded-lg text-sm font-medium bg-red-800  transition-colors hover:bg-red-600`
                  )}
                  onClick={onDisconnectWalletHandler}
                >
                  Disconnect
                </button>
              )}
              <div className="flex items-center gap-x-4 ml-auto">
                <button
                  onClick={toggleTheme}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title={
                    isDark ? "Switch to light mode" : "Switch to dark mode"
                  }
                >
                  {isDark ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
      <WalletModal
        isOpen={openWalletModal}
        onClose={() => setOpenWalletModal(false)}
        address={address}
      />
    </div>
  );
};

export default Layout;
