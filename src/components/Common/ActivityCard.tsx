import React from "react";

// Define the types for the props
interface ActivityCardProps {
  logo?: string;
  activityText?: string;
  value?: string;
  valueClassName?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  logo = "https://svgshare.com/i/1BJw.svg", // Default logo
  // logo = "https://svgshare.com/i/1BJx.svg", // Default logo
  activityText = "Activity", // Default activity text
  value = "+0.123 BNB", // Default value
  valueClassName = "text-white", // Default class for value
}) => {
  return (
    <div className="bg-[#1C1C1C] border border-[#262626] py-[17px] px-[15px] w-full flex flex-row justify-between items-center">
      <div className="flex flex-row gap-[13px]">
        <img src={logo} alt="logo" />
        <p className="text-white text-[12px] font-normal space-mono">
          {activityText}
        </p>
      </div>
      <div className={`text-[12px] font-semibold kode-mono ${valueClassName}`}>
        {value}
      </div>
    </div>
  );
};

export default ActivityCard;
