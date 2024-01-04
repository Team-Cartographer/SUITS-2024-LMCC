"use client";

import Image from "next/image";
import icon from "@/public/icon.png";
import { Button } from "@/components/ui/button";

const StartPage = () => {
  const onStartPress = () => {
    window.open("/screen_one", "_blank");
    window.open("/screen_two", "_blank");
    window.close();
  };

  return (
    <div className="h-full flex bg-black text-white items-center justify-center">
      <Image src={icon} alt="logo" width={95} height={95} className="pr-5" />
      <Button
        variant="secondary"
        className="text-4xl h-20 min-w-10"
        onClick={onStartPress}
      >
        Start Console
      </Button>
    </div>
  );
};

export default StartPage;
