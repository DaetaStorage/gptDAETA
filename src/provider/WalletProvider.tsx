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
  verifyOtp: (otp: string) => Promise<void>;
  refetch: () => void;
  claimPoints: () => Promise<void>;
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

  const claimPoints = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask && account) {
        const priceInRaw = await chrome.runtime.sendMessage(extensionId, {
          type: "GET_PRICE",
          url: "https://api.dexscreener.com/latest/dex/search?q=0x53b0fd79c57aebeb6cf567804883ad4702df9607&chain=ethereum",
          options: {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        });

        let tokenPrice = 0;
        if (
          priceInRaw.data &&
          priceInRaw.data.pairs &&
          priceInRaw.data.pairs[0].priceUsd
        ) {
          tokenPrice = Number(priceInRaw.data.pairs[0].priceUsd);
        }

        if (tokenPrice === 0) {
          alert("Internal server error");
          return;
        }

        const response = await chrome.runtime.sendMessage(extensionId, {
          type: "CLAIM_POINTS",
          url: "https://api.daeta.xyz/api/extension/claim-points",
          options: {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              wallet: account,
            }),
          },
        });

        if (response.data && response.data.count) {
          // Generate Signature
          const sigResp = await chrome.runtime.sendMessage(extensionId, {
            type: "GET_SIGNATURE",
            url: "https://api.daeta.xyz/api/extension/generate-signature",
            options: {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                wallet: account,
                points: response.data.count,
              }),
            },
          });

          if (sigResp.data && sigResp.data.sig) {
            // Claim tokens from Contract
            try {
              const contract = new web3.eth.Contract(
                contractABI,
                DaeTaContract
              );
              const isCallable = await contract.methods
                .claimRewards(
                  sigResp.data.sig,
                  Math.round(tokenPrice * 10 ** 6).toString()
                )
                .call({ from: account });

              if (isCallable) {
                try {
                  const hash = await contract.methods
                    .claimRewards(
                      sigResp.data.sig,
                      Math.round(tokenPrice * 10 ** 6).toString()
                    )
                    .send({
                      from: account,
                    });

                  console.log({ hash });

                  await chrome.runtime.sendMessage(extensionId, {
                    type: "CLAIMED_POINTS",
                    url: "https://api.daeta.xyz/api/extension/claimed-points",
                    options: {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        wallet: account,
                        points: response.data.count,
                      }),
                    },
                  });

                  alert("Transaction is succeed.");
                  await getOrRegisterUser();
                } catch (error: any) {
                  alert(error.message);
                  return;
                }
              } else {
                alert("You can't claim your tokens at this time.");
              }
            } catch (error: any) {
              alert(error.message);
            }
          } else {
            alert("Internal server error");
          }
        } else {
          alert("Internal server error.");
        }
      }
    } catch (error) {
      await getOrRegisterUser();
      alert("Transaction is pending, please check later.");
    }
  };

  const claimRewards = async (items: number, conversations: any) => {
    try {
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
      alert("You claimed your points");
    } catch (error) {
      await getOrRegisterUser();
      alert("Transaction is pending, please check later.");
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

  const verifyOtp = async (otp: string) => {
    try {
      await chrome.runtime.sendMessage(extensionId, {
        type: "VERIFY_OTP_CODE",
        url: "https://api.daeta.xyz/api/extension/verify-otp",
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet: account,
            otp,
          }),
        },
      });

      alert("OTP Code is verfied");
      await getOrRegisterUser();
    } catch (error) {
      console.error("Error during verifying the otp code: ", error);
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
    getOrRegisterUser();
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
        verifyOtp,
        refetch,
        claimPoints,
      }}
    >
      {children}
    </Wallet.Provider>
  );
};

export const useWallet = () => useContext(Wallet);
