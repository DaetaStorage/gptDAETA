import { createContext, useContext, useState, useEffect } from "react";
import { chainId, chainToHex, decimals } from "../constants/web3";
import { DaeTaContract } from "../web3/contract";
import contractABI from "../web3/abi.json";
import Web3 from "web3";

window.ethereum = window.ethereum || {};

export type WalletContext = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  account: string | null;
  isConnected: boolean;
  balance: number;
  user: any;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  claimRewards: (items: number, conversations: any) => Promise<void>;
  verifyRefferalCode: (refCode: string, isSkipped: boolean) => Promise<void>;
  refetch: () => void;
};

type WalletProviderProps = {
  children: JSX.Element;
};

export const Wallet = createContext<WalletContext | null>(null);

const extensionId = "olicmopfdmbpgacjdndpifmkndpgcmpm";

const web3 = new Web3(window.ethereum);

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [account, setAccount] = useState(null);
  const [isConnected, setConnection] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [user, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // Check if MetaMask is already connected on page load
    const checkConnection = async () => {
      if (window.ethereum && window.ethereum.isMetaMask) {
        const accounts: any = await window.ethereum.request<string[]>({
          method: "eth_accounts",
        });

        if (accounts && accounts.length > 0) {
          setAccount(accounts[0]);
          setConnection(true);
        }
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    if (account) getOrRegisterUser();
  }, [account]);

  const connectWallet = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        const accounts: any = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts) {
          setAccount(accounts[0]);
          setConnection(true);
        }
        if (window.ethereum.networkVersion !== chainId.toString()) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainToHex }],
          });
        }
      } else {
        alert("Please install Metamask");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      alert("Internal server error");
    }
  };

  const disconnectWallet = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        await window.ethereum.request({
          method: "wallet_revokePermissions",
          params: [{ eth_accounts: {} }],
        });
        setAccount(null);
        setConnection(false);
      }
    } catch (error) {
      console.error("Error disconnecting Metamask: ", error);
    }
  };

  const getETHBalance = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        const balance: any = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"],
        });
        const hexToDecimal = parseInt(balance, 16);
        setBalance(Number((hexToDecimal / decimals).toFixed(6)));
      }
    } catch (error) {
      console.error("Error getting ETH balance: ", error);
    }
  };

  const claimRewards = async (items: number, conversations: any) => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask && account) {
        const contract = new web3.eth.Contract(contractABI, DaeTaContract);
        contract.methods.claimRewards(items * decimals).send({
          from: account,
        });

        await new Promise((resolve) => setTimeout(resolve, 5000));

        await chrome.runtime.sendMessage(extensionId, {
          type: "CLAIM_REWARDS",
          url: "https://api.daeta.xyz/api/extension/earning-history",
          options: {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              wallet: account,
              items: items,
              reward: items,
              conversations,
            }),
          },
        });

        await getOrRegisterUser();
      }
    } catch (error) {
      console.error("Error during claiming rewards: ", error);
      await chrome.runtime.sendMessage(extensionId, {
        type: "CLAIM_REWARDS",
        url: "https://api.daeta.xyz/api/extension/earning-history",
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet: account,
            items: items,
            reward: items,
            conversations,
          }),
        },
      });

      await getOrRegisterUser();
      alert("Transaction Confirmation Failed");
    }
  };

  const getOrRegisterUser = async () => {
    try {
      const resp = await chrome.runtime.sendMessage(extensionId, {
        type: "GET_USER_INFO",
        url: "https://api.daeta.xyz/api/extension/",
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet: account,
          }),
        },
      });

      setUserInfo(resp.data);
    } catch (error) {
      console.error("Error during getting an user info: ", error);
    }
  };

  const verifyRefferalCode = async (refCode: string, isSkipped: boolean) => {
    try {
      await chrome.runtime.sendMessage(extensionId, {
        type: "VERIFY_REFERRAL_CODE",
        url: "https://api.daeta.xyz/api/extension/verify",
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet: account,
            refCode,
            isSkipped,
          }),
        },
      });

      alert("Refferal Code is verfied");
      await getOrRegisterUser();
    } catch (error) {
      console.error("Error during verifying the referral code: ", error);
    }
  };

  const refetch = () => {
    getETHBalance();
  };

  return (
    <Wallet.Provider
      value={{
        loading,
        setLoading,
        account,
        isConnected,
        balance,
        user,
        connectWallet,
        disconnectWallet,
        claimRewards,
        verifyRefferalCode,
        refetch,
      }}
    >
      {children}
    </Wallet.Provider>
  );
};

export const useWallet = () => useContext(Wallet);
