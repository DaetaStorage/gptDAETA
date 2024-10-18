import { useState } from "react";
import { useWallet } from "../../../provider/WalletProvider";

const RewardClaim = () => {
  const { user } = useWallet()!;
  const [isCopied, setIsCopied] = useState<boolean>(false);

  let referralContent;
  if (user && user.referrals.length > 0) {
    referralContent = user.referrals.map((item: any, idx: number) => (
      <div
        key={idx}
        className="group pl-4 pr-3 py-2 flex justify-between items-center bg-[#1C1C1C] hover:bg-[#262626] transition-all cursor-pointer"
      >
        <span className="text-[#D9D9D9] text-sm group-hover:text-[#F7FF98]">
          My Referrer Earnings
        </span>
        <div className="flex items-center gap-1">
          <span className="text-white font-bold text-[14px]">{`+${item.reward}`}</span>
          <div className="w-5 h-5 bg-[#262626] flex items-center justify-center">
            <img src={"https://svgshare.com/i/1BJi.svg"} alt="referImg" />
          </div>
        </div>
      </div>
    ));
  } else {
    referralContent = (
      <div className="group pl-4 pr-3 py-2 flex justify-between items-center bg-[#1C1C1C] hover:bg-[#262626] transition-all cursor-pointer">
        <span className="text-[#D9D9D9] text-sm group-hover:text-[#F7FF98]">
          No referral. Please invite your friends.
        </span>
      </div>
    );
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(user ? user._doc.code : "");
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch {
      console.error("Failed to copy the invite code.");
    }
  };

  return (
    <div className="flex flex-col w-full space-mono bg-[#262626] relative">
      <div className="pl-4 pr-3 bg-[#F7FF98] pt-8 w-full relative h-[232px] select-none">
        <div className="bg-[#262626] text-[#F7FF98] font-bold text-[32px] space-mono w-fit pr-[2px]">
          More Friends
        </div>
        <div className="mt-[10px] text-[#262626] font-bold text-[32px] space-mono">
          More Gains!
        </div>
        <div className="absolute bottom-[10px] right-11">
          <img
            src={"https://svgshare.com/i/1BJh.svg"}
            className=" rotate-[-9.938deg]"
            alt="link-logo"
          />
        </div>
      </div>
      <div className="pl-4 pr-3 pt-[14px] flex flex-col gap-9 pb-[17px]">
        <p className="text-[#D9D9D9] max-w-[276px] text-sm select-none">
          Invite friends and&nbsp;
          <span className="text-[#F7FF98]">earn an additional 10%</span> based
          on the points earned by your invited friends. No limits, start now!
        </p>

        <button
          onClick={handleCopy}
          className="py-4 px-3 flex flex-row items-center justify-center gap-[10px] bg-[#E0DECF]"
        >
          <img src={"https://svgshare.com/i/1BJM.svg"} alt="copyImg" />
          <p className="text-[#262626] text-[14px] font-bold leading-[100%] space-mono">
            {isCopied ? "Copied!" : "Copy Invite Code"}
          </p>
        </button>
      </div>

      {/* Referrer Earnings */}
      {referralContent}

      {/* Social Rewards */}
      <div className="mt-[15px] pl-4 pr-3 pt-3 pb-7 flex flex-col gap-[13px] bg-[#1C1C1C]">
        <div className="text-[#D9D9D9] text-[14px] font-normal select-none">
          Unlock Rewards with Social Link!
        </div>
        <div className="group border border-[#E0DECF] flex flex-row justify-between items-center pl-3 pr-[14px] pt-[13px] pb-[14px] cursor-pointer hover:border-[#F7FF98] hover:bg-[#F7FF98] transition-all duration-300 ease-in-out">
          <div className="flex flex-row gap-[9px] items-center">
            <img src={"https://svgshare.com/i/1BKa.svg"} alt="xImg" />
            <div className="text-[#D9D9D9] space-mono text-[14px] font-normal group-hover:text-[#1C1C1C]">
              X.com
            </div>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <div className="text-[14px] text-white space-mono font-bold group-hover:text-[#1C1C1C]">
              +121
            </div>
            <div className="w-[21px] h-[21px] flex justify-center items-center bg-[#262626]">
              <img src={"https://svgshare.com/i/1BJi.svg"} alt="referImg" />
            </div>
          </div>
        </div>
        <div className="group border border-[#E0DECF] flex flex-row justify-between items-center pl-3 pr-[14px] pt-[13px] pb-[14px] cursor-pointer hover:border-[#F7FF98] hover:bg-[#F7FF98] transition-all duration-300 ease-in-out">
          <div className="flex flex-row gap-[9px] items-center">
            <img src={"https://svgshare.com/i/1BKa.svg"} alt="xImg" />
            <div className="text-[#D9D9D9] space-mono text-[14px] font-normal group-hover:text-[#1C1C1C]">
              X.com
            </div>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <div className="text-[14px] text-white space-mono font-bold group-hover:text-[#1C1C1C]">
              +121
            </div>
            <div className="w-[21px] h-[21px] flex justify-center items-center bg-[#262626]">
              <img src={"https://svgshare.com/i/1BJi.svg"} alt="referImg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardClaim;
