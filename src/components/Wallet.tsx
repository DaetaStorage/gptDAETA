import { useWallet } from "../provider/WalletProvider";

const handleError = () => {
  alert("Error during connecting a wallet");
};

const Wallet = () => {
  const wallet = useWallet();
  const connectWallet = wallet ? wallet.connectWallet : handleError;

  const handleConnect = () => {
    connectWallet();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col gap-3 space-mono w-full items-center justify-center">
        <p className="space-mono text-white text-[24px] font-bold">
          Connect Your Wallet
        </p>
        <p className="text-[12px] text-center w-[70%] text-[#D9D9D9]">
          To start earning, please connect your MetaMask wallet.
        </p>
      </div>
      <div className="mt-8 flex flex-col gap-7">
        <button
          onClick={handleConnect}
          className="w-[145px] space-mono h-[38px] bg-[#F7FF98] flex items-center justify-center text-[14px] font-bold text-[#262626]"
        >
          Connect Wallet
        </button>
        <img
          src={"https://svgshare.com/i/1BKC.svg"}
          alt="Crypto Wallet"
        />
      </div>
    </div>
  );
};

export default Wallet;
