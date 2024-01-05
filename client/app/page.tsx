"use client";

import Image from "next/image";
import icon from "@/public/icon.png";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { GitHub } from "@mui/icons-material";

const StartPage = () => {
  const [screenOneOpened, setScreenOneOpened] = useState(false);
  const [buttonOneText, setButtonOneText] = useState("Start Screen 1");
  const [buttonOneStyle, setButtonOneStyle] = useState("");

  const [screenTwoOpened, setScreenTwoOpened] = useState(false);
  const [buttonTwoText, setButtonTwoText] = useState("Start Screen 2");
  const [buttonTwoStyle, setButtonTwoStyle] = useState("");

  const onScreen1Press = () => {
    if (!screenOneOpened) {
      window.open("/screen_one", "_blank");
      setScreenOneOpened(true);
    }
  };

  const onScreen2Press = () => {
    if (!screenTwoOpened) {
      window.open("/screen_two", "_blank");
      setScreenTwoOpened(true);
    }
  };

  useEffect(() => {
    if (screenOneOpened) {
      setButtonOneText("Screen 1 Started");
      setButtonOneStyle(
        "text-slate-600 bg-transparent hover:bg-transparent cursor-default"
      );
    }
  }, [screenOneOpened]);

  useEffect(() => {
    if (screenTwoOpened) {
      setButtonTwoText("Screen 2 Started");
      setButtonTwoStyle(
        "text-slate-600 bg-transparent hover:bg-transparent cursor-default"
      );
    }
  }, [screenTwoOpened]);

  return (
    <div className="h-full flex flex-col bg-slate-950 text-white items-center justify-center">
      <div className="flex flex-row pb-2 text-3xl font-bold items-center">
        <Image src={icon} alt="logo" width={65} height={65} className="pr-5" />
        Team Cartographer SUITS 2024 LMCC Console
      </div>

      <div className="pt-2">
        <Button
          variant="secondary"
          className={`dark text-xl pt-2 ${buttonOneStyle}`}
          onClick={onScreen1Press}
        >
          {buttonOneText}
        </Button>
      </div>
      <div className="pt-2">
        <Button
          variant="secondary"
          className={`dark text-xl pt-2 ${buttonTwoStyle}`}
          onClick={onScreen2Press}
        >
          {buttonTwoText}
        </Button>
      </div>
      <div className="fixed bottom-0 pb-5">
        <Button
          className="dark flex items-center justify-center align-middle gap-x-2 text-sm"
          onClick={() => {
            open("https://github.com/Team-Cartographer/SUITS-2024-LMCC");
          }}
        >
          <GitHub className="h-5 w-5" /> GitHub
        </Button>
      </div>
    </div>
  );
};

export default StartPage;
