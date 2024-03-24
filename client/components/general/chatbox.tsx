import { z } from "zod";
import { ChatboxForm } from "./forms/chatbox-form";
import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer";
import { ChatHistoryType } from "@/hooks/types";
import Image from "next/image";

import suits_image from "@/public/suits.png";
import team_cartographer_logo from "@/public/icon.png"
import MarkdownContent from "./markdowner";


const FormSchema = z.object({
    chatItem: z
      .string()
  })

interface ChatParams { 
    chatHistory: ChatHistoryType
    setChatHistory: (chatHistory: ChatHistoryType) => void
}


const GeminiChat = (
    { chatHistory, setChatHistory }: ChatParams
    ) => {

    const [responseLoading, setResponseLoading] = useState(false); 

    const onFormSubmit = async (formData: z.infer<typeof FormSchema>) => {
        setResponseLoading(true);
        const response = await fetchWithParams<ChatHistoryType>('api/v0', {
            chat: "update", 
            message: formData.chatItem
        });
        setResponseLoading(false); 

        if (response) { setChatHistory(response); }
    }

    // Set chat history on mount
    useEffect(() => { 
        const fetchChatHistory = async () => {
            const response = await fetchWithoutParams<ChatHistoryType>('api/v0?get=chat'); 
            if (response) { setChatHistory(response); }
        }
        fetchChatHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if(scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]); 


    return ( 
        <div className="flex flex-col items-center justify-center pb-20">
            <div ref={scrollRef} className="overflow-scroll max-h-[700px] py-4 pb-8">
                {chatHistory.history.map((chatItem, index) => (
                    <div key={index} className="flex flex-row gap-x-2 py-1 gap-y-2">
                        <div className={`p-2 flex flex-row rounded-lg ${chatItem.role === "user" ? "bg-slate-800 text-white" : "bg-slate-700 text-white"}`}>
                            {chatItem.role === "user" ? (
                                <>
                                    <Image src={suits_image} width={20} height={10} alt='' className="max-h-[20px]" />
                                    {chatItem.parts.map((part, index) => (
                                        <p key={index} className="pl-3 text-sm">{part}</p>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <Image src={team_cartographer_logo} width={20} height={10} className="max-h-[20px] rounded-full" alt='' />
                                    {chatItem.parts.map((part, index) => (
                                        <MarkdownContent key={index} markdown={part} />
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>


            <ChatboxForm onFormSubmit={onFormSubmit} />

            { responseLoading && 
                <div className="flex flex-row py-3 items-center">
                    <Sparkles className="h-4 w-4 text-muted-foreground" /> 
                    <span className="text-muted-foreground text-sm pl-1 pr-2">Gemini is Loading...</span> 
                    <Spinner size="default" />
                </div>
            }
        </div> 
    );
}
 
export default GeminiChat;