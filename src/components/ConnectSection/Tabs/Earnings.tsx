import { useEffect, useState } from "react";
import axios from "axios";
import { useWallet } from "../../../provider/WalletProvider";
import { convertTimestamp } from "../../../utils/convertDate";
import ActivityCard from "../../Common/ActivityCard";

interface IConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  isChecked: boolean;
}

const Earnings = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [conversations, setConversations] = useState<IConversation[] | null>(
    null
  );
  const { account, balance, user, refetch, claimRewards, claimPoints } =
    useWallet()!;

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    const getChatGptSession = async () => {
      const { data } = await axios.get("https://chatgpt.com/api/auth/session");
      setAccessToken(data.accessToken);
    };

    getChatGptSession();
  }, [account]);

  useEffect(() => {
    const fetchConversations = async () => {
      const { data } = await axios.get(
        "https://chatgpt.com/backend-api/conversations",
        {
          params: { offset: 0, limit: 100, order: "updated" },
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (data.items && data.items.length > 0) {
        const temp: IConversation[] = [];
        if (
          user &&
          user._doc.conversations &&
          user._doc.conversations.length > 0
        ) {
          for (let i = 0; i < data.items.length; i++) {
            let flag = false;
            for (let j = 0; j < user._doc.conversations.length; j++) {
              if (data.items[i].id === user._doc.conversations[j].id) {
                flag = true;
                break;
              }
            }
            if (!flag) {
              temp.push({
                id: data.items[i].id,
                title: data.items[i].title,
                created_at: data.items[i].create_time,
                updated_at: data.items[i].update_time,
                isChecked: false,
              });
            }
          }
        } else {
          for (let i = 0; i < data.items.length; i++) {
            temp.push({
              id: data.items[i].id,
              title: data.items[i].title,
              created_at: data.items[i].create_time,
              updated_at: data.items[i].update_time,
              isChecked: false,
            });
          }
        }

        setConversations(temp);
      }
    };

    if (accessToken) fetchConversations();
  }, [user, accessToken]);

  let historyContent;
  if (user && user.histories.length > 0) {
    historyContent = user.histories.map((item: any, idx: number) => (
      <div key={idx} className="pb-[10px] w-full">
        <div className="flex flex-col justify-start ml-4">
          <div className="text-[#D9D9D9] text-[12px] font-normal space-mono leading-[24px]">
            Activity
            <br />
            <span className="text-[#E0DECF] text-opacity-70 text-[10px] space-mono font-normal">
              {convertTimestamp(new Date(item.created_at).getTime() / 1000)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-[1px] mt-[9px] w-full">
          <ActivityCard
            logo="https://daeta.xyz/lvrg/logoPoint.png"
            activityText="Activity"
            value={`+${item.reward} DaeTa`}
            valueClassName="text-green-500"
          />
        </div>
      </div>
    ));
  } else {
    historyContent = (
      <div className="mt-[15px] bg-[#1C1C1C] min-h-[247px] relative flex justify-center items-center">
        <div className="flex flex-col gap-[6px] text-center">
          <div className="text-[#F7FF98] text-[12px] font-bold space-mono self-stretch">
            No Earnings History Yet
            <p className="text-[12px] text-[#D9D9D9] font-normal inline-block">
              Start uploading sessions to earn now!
            </p>
            <br />
          </div>
        </div>

        <div className="absolute top-[5px] left-4 flex flex-row items-center">
          <img
            src={"https://daeta.xyz/lvrg/money.svg"}
            className="w-[14px] h-[14px]"
            alt="moneylogo"
          />
          <div className="text-[16px] font-normal text-[#E0DECF] space-mono">
            .earnings History
          </div>
        </div>
      </div>
    );
  }

  // Handle toggling "Select All"
  const toggleSelectAll = () => {
    if (conversations) {
      const allChecked = conversations.every((item) => item.isChecked); // Check if all are selected
      const updatedConversations = conversations.map((item) => ({
        ...item,
        isChecked: !allChecked, // Toggle the checked state
      }));
      setConversations(updatedConversations);
    }
  };

  const handleCheckboxChange = (id: string) => {
    if (conversations) {
      const updatedConversations = conversations.map((item) =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      );
      setConversations(updatedConversations);
    }
  };

  const handleClaim = () => {
    if (conversations && conversations.length > 0) {
      const checkedConversations = conversations.filter(
        (item) => item.isChecked === true
      );

      if (checkedConversations)
        claimRewards(checkedConversations.length, checkedConversations);
    } else {
      alert("No conversation to claim");
    }
  };

  const handleClaimRewards = () => {
    if (user && user._doc.points > 0) {
      claimPoints();
    } else {
      alert("No points to claim");
    }
  };

  return (
    <div className="flex flex-col w-full space-mono bg-[#262626] relative">
      <div className="w-full bg-[#F7FF98] flex flex-col justify-end pl-4 pb-[18px] pt-12 gap-4">
        <p className="text-[22px] text-black">.my Daeta Points</p>
        <div className="flex flex-row gap-[15%] items-center justify-between">
          <div className="flex flex-row items-center gap-1">
            <div className="bg-[#262626] h-[26px] w-[26px] flex items-center justify-center">
              <img src={"https://daeta.xyz/lvrg/logo2.svg"} alt="" />
            </div>
            <p className="kode-mono text-[#262626] text-[24px] font-semibold">
              {user ? user._doc.points : 0}
            </p>
          </div>
          <button
            className="bg-[#E0DECF] w-fit h-6 text-[14px] space-mono text-[#262626] flex justify-center items-center border border-transparent hover:border-[#F7FF98] hover:bg-[#1C1C1C] hover:text-[#F7FF98] transition-all ease-in-out duration-300 mr-3 text-center p-1"
            onClick={handleClaimRewards}
          >
            Collect Rewards
          </button>
        </div>
        <p className="text-[12px] text-black leading-normal mr-2">
          * You can claim tokens for your 25% points every 7 days.
        </p>
      </div>

      {/* Deposit Part */}
      <div className="bg-[#1c1c1c] px-4 py-[7px] flex w-full items-center justify-between mt-[6px]">
        <div>
          <p className="text-[18px] font-normal text-[#E0DECF] space-mono">
            .my ETH
          </p>
          <span>
            <p className="text-white text-18px font-semibold kode-mono">
              {balance}
            </p>
          </span>
        </div>
        <button className="group flex items-center justify-center cursor-pointer">
          <div className="flex flex-row gap-[7px] border bg-[#E0DECF] group-hover:bg-[#F7FF98] group-hover:border-[#F7FF98] transition-all ease-in-out duration-300">
            <div className="bg-[#E0DECF] text-[#1C1C1C] pl-[6px] pr-[2px] group-hover:bg-[#F7FF98] transition-all ease-in-out duration-300">
              +
            </div>
            <a href="https://binance.com" target="_blank">
              <div className="text-[#E0DECF] bg-[#1C1C1C] text-[14px] font-normal space-mono pr-1 pl-3 group-hover:text-[#F7FF98] transition-all ease-in-out duration-300">
                deposit
              </div>
            </a>
          </div>
        </button>
      </div>

      {/* GPT to Earn Part */}
      <div className="mt-[15px] pb-[27px] bg-[#1C1C1C]">
        <div className="pt-[10px] pl-[18px] pr-[14px] w-full flex flex-col items-center gpt-earn-background">
          <div className="w-full flex flex-row justify-between items-center">
            <div className="flex items-center">
              <img src={"https://daeta.xyz/lvrg/money.svg"} alt="money-logo" />
              <p className="text-[16px] font-normal text-[#E0DECF] space-mono">
                .GPT to Earn
              </p>
            </div>
            <div className="flex items-center gap-[9px]">
              <button
                onClick={toggleSelectAll}
                className="bg-transparent h-6 text-[10px] space-mono text-[#e0decf] text-opacity-70 border-b border-[#808080] flex justify-center items-center hover:text-white hover:border-white transition-all duration-300 ease-in-out"
              >
                {conversations && conversations.every((item) => item.isChecked)
                  ? "Deselect All"
                  : "Select All"}
              </button>
              <button
                className="bg-[#E0DECF] w-[60px] h-6 text-[14px] space-mono text-[#262626] flex justify-center items-center border border-transparent hover:border-[#F7FF98] hover:bg-[#1C1C1C] hover:text-[#F7FF98] transition-all ease-in-out duration-300"
                onClick={handleClaim}
              >
                Claim
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full mt-[17px]">
            {/* Checkbox Items */}
            {conversations &&
              conversations.map((item) => (
                <div
                  key={item.id}
                  className="w-full flex justify-between items-center"
                >
                  <div className="text-[12px] font-normal text-[#D9D9D9] space-mono">
                    {item.title}
                  </div>
                  <input
                    type="checkbox"
                    checked={item.isChecked} // Bind state
                    onChange={() => handleCheckboxChange(item.id)} // Update state on change
                    className="w-4 h-4 border border-[#808080] bg-transparent"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* .earnings History */}
      <div className="w-full flex flex-col items-start mt-[18px]">
        {historyContent}
      </div>

      <div className="absolute bottom-[-38px] left-0">
        <img
          src={"https://daeta.xyz/lvrg/bottom.svg"}
          alt="bottom-logo"
          className="w-[38px] h-[38px]"
        />
      </div>
    </div>
  );
};

export default Earnings;
