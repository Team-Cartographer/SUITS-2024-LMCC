"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import icon from "@/public/icon.png";

let screenTwoOpened: boolean = false;
const StartPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/screen_one");
    if (typeof window !== "undefined" && !screenTwoOpened) {
      window.open("/screen_two", "_blank");
      screenTwoOpened = true;
    }
    setTimeout(() => {
      window.location.reload();
    }, 10);
  }, [router]);

  return (
    <div className="h-full flex bg-black text-white items-center justify-center">
      <Image src={icon} alt="logo" width={70} height={70} className="pr-5" />
      <p className="font-bold text-4xl">Loading...</p>
    </div>
  );
};

export default StartPage;
