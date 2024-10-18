import { useState } from "react";
import CSections from "./ConnectSection/CSections";
import Wallet from "./Wallet";
import { useWallet } from "../provider/WalletProvider";

const Body = () => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [refCode, setRefCode] = useState<string>("");
  const { isConnected, user, verifyRefferalCode } = useWallet()!;

  return (
    <>
      <button
        className={`absolute bottom-32 p-[9px] bg-[#E0DECF] border border-[#808080] daeta-logo-radius border-r-0 ${
          isClicked ? "right-[430px]" : "right-0"
        }`}
        onClick={() => setIsClicked(!isClicked)}
      >
        <div className="w-[45px] h-[45px] bg-[#232323] rounded-full flex items-center justify-center">
          <img src={"https://i.ibb.co/KXtC6X8/logo-daeta.png"} alt="logo" />
        </div>
      </button>

      <div
        className={`bg-[#E0DECF] flex flex-col items-center justify-center h-screen ${
          isClicked ? "w-[430px] min-w-[430px]" : "hidden"
        }`}
      >
        {isConnected ? (
          <>
            {(user && user._doc.isSkipped) || (user && user._doc.refCode) ? (
              <CSections />
            ) : (
              <div className="bg-[#1C1C1C] relative h-[533px] flex flex-col justify-center items-center w-[360px]">
                <img
                  src={"https://svgshare.com/i/1BJ4.svg"}
                  className="absolute top-[-40px] left-0"
                  alt="decorative top"
                />
                <img
                  src={"https://svgshare.com/i/1BGS.svg"}
                  className="absolute bottom-[-35px] left-0"
                  alt="decorative bottom"
                />
                <div className="flex flex-col items-center justify-center">
                  <div className="flex flex-col gap-3 space-mono w-full items-center justify-center">
                    <p className="space-mono text-white text-[24px] font-bold">
                      Have an Invite Code?
                    </p>
                    <p className="text-[12px] text-center w-[70%] text-[#D9D9D9]">
                      Enter your code below.
                    </p>
                  </div>
                  <input
                    type="text"
                    className="bg-white p-2 mt-4 rounded-md w-[220px] placeholder:text-center outline-none"
                    placeholder="Your invite code"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                  />
                  <div className="mt-8 flex flex-col gap-7">
                    <button
                      onClick={() => verifyRefferalCode(refCode, false)}
                      className="w-[145px] space-mono h-[38px] bg-[#F7FF98] flex items-center justify-center text-[14px] font-bold text-[#262626]"
                    >
                      Confirm
                    </button>
                  </div>
                  <p
                    className="text-[14px] text-center w-[70%] text-[#D9D9D9] mt-5 cursor-pointer"
                    onClick={() => verifyRefferalCode(refCode, true)}
                  >
                    {"Skip >>"}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#1C1C1C] relative h-[533px] flex flex-col justify-center items-center w-[360px]">
            <img
              src={"https://svgshare.com/i/1BJ4.svg"}
              className="absolute top-[-40px] left-0"
              alt="decorative top"
            />
            <img
              src={"https://svgshare.com/i/1BGS.svg"}
              className="absolute bottom-[-35px] left-0"
              alt="decorative bottom"
            />
            <Wallet />
          </div>
        )}

        {!isConnected && (
          <div className="absolute text-[12px] font-normal text-center text-[#262626] bottom-5 space-mono">
            Utilize your GPT sessions to earn tokens effortlessly.
          </div>
        )}
      </div>
    </>
  );
};

export default Body;
