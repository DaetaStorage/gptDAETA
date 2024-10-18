import { useWallet } from "../../../provider/WalletProvider";
import { convertTimestamp } from "../../../utils/convertDate";
import ActivityCard from "../../Common/ActivityCard";

const History = () => {
  const { user } = useWallet()!;

  let historyContent;
  if (user && user.histories.length > 0) {
    historyContent = user.histories.map((item: any, idx: number) => (
      <div key={idx} className="pb-[10px] w-full">
        <div className="flex flex-col justify-start">
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
            logo="https://svgshare.com/i/1BJw.svg"
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
            src={"https://svgshare.com/i/1BKD.svg"}
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

  return (
    <div className="flex flex-col w-full space-mono bg-[#262626] relative pt-[17px] pl-4 pr-3">
      <div className="flex flex-row items-center gap-[5px]">
        <img src={"https://svgshare.com/i/1BJB.svg"} alt="money_logo" />
        <div className="text-[12px] text-center font-bold space-mono">
          Earnings History
        </div>
      </div>

      {/* Activity Part */}
      <div className="w-full flex flex-col items-start mt-[18px]">
        {/* daily acitivity */}
        {historyContent}
      </div>
    </div>
  );
};

export default History;
