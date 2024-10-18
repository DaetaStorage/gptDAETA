import { useState } from "react";
import { TbX } from "react-icons/tb";
import Earnings from "./Tabs/Earnings";
import History from "./Tabs/History";
import RewardClaim from "./Tabs/RewardClaim";
import { useWallet } from "../../provider/WalletProvider";

interface dataprops {
  [key: string]: React.ReactNode;
}

const handleError = () => {
  alert("Error during disconnecting a wallet");
};

const CSections = () => {
  const [active, setActive] = useState("earnings");
  const wallet = useWallet();
  const disconnectWallet = wallet ? wallet.disconnectWallet : handleError;

  const handleDisconnect = () => {
    disconnectWallet();
  };

  const bar = [
    {
      icon: "https://svgshare.com/i/1BHs.svg",
      title: "Earnings",
      act: "earnings",
      activeIcon: "https://svgshare.com/i/1BK5.svg",
    },
    {
      icon: "https://svgshare.com/i/1BKP.svg",
      title: "History",
      act: "history",
      activeIcon: "https://svgshare.com/i/1BJA.svg",
    },
    {
      icon: "https://svgshare.com/i/1BK_.svg",
      title: "Reward",
      act: "reward",
      activeIcon: "https://svgshare.com/i/1BHe.svg",
    },
  ];

  const dataDetails: dataprops = {
    earnings: <Earnings />,
    history: <History />,
    reward: <RewardClaim />,
  };

  const handleClick = (item: string) => {
    setActive(item);
  };

  return (
    <div className="flex flex-row w-full space-mono">
      <div className="w-full bg-[#262626] text-white text-3xl h-screen overflow-y-scroll">
        {dataDetails[active]}
      </div>
      <div className="min-w-[67px] bg-[#1C1C1C] h-screen flex flex-col gap-4 pt-[17px]">
        <div className="flex items-center justify-center">
          <TbX className="text-2xl text-white" />
        </div>
        <div className="flex flex-col gap-[45px] mt-[54px]">
          {bar.map((item, index) => (
            <button
              onClick={() => handleClick(item.act)}
              key={index}
              className={`flex flex-col items-center gap-[5px] pt-[8.5px] pb-[14.63px] pl-[9px] pr-[5px] ${
                active === item.act
                  ? "text-[#262626] bg-[#F7FF98]"
                  : "text-white hover:bg-[#686c4560] transition-all duration-300 ease-in-out"
              }`}
            >
              <img
                src={active === item.act ? item.activeIcon : item.icon}
                alt={item.title}
              />
              <p className="text-[10px] font-normal text-center space-mono">
                {item.title}
              </p>
            </button>
          ))}
        </div>
        <div className="flex flex-col justify-between text-white text-[12px] font-normal text-center space-mono h-full">
          <span></span>
          <button className="mb-8" onClick={handleDisconnect}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CSections;
