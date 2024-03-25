import { z } from "zod";
import { ChatboxForm } from "./forms/chatbox-form";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Upload } from "lucide-react";
import { Spinner } from "../ui/spinner";
import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer";
import { ChatHistoryType, ChatItemType } from "@/hooks/types";

import Image from "next/image";
import MarkdownContent from "./markdowner";

import suits_image from "@/public/suits.png";
import team_cartographer_logo from "@/public/icon.png"
import { Button } from "@/components/ui/button";
import { useNetwork } from "@/hooks/context/network-context";


const FormSchema = z.object({
    chatItem: z
      .string()
  })

interface ChatParams { 
    chatHistory: ChatItemType[]
    setChatHistory: (chatHistory: ChatItemType[]) => void
    newTodoItem: [string, string]
    setNewTodoItem: (newTodoItem: [string, string]) => void
}


const GeminiChat = (
    { chatHistory, setChatHistory, newTodoItem, setNewTodoItem }: ChatParams
    ) => {

    const [responseLoading, setResponseLoading] = useState(false); 

    const { getTodoData } = useNetwork();

    const onFormSubmit = async (formData: z.infer<typeof FormSchema>) => {
        setResponseLoading(true);
        setChatHistory([...chatHistory, { role: "user", parts: [formData.chatItem] }]);
        const response = await fetchWithParams<ChatHistoryType>('api/v0', {
            chat: "update", 
            message: formData.chatItem
        });
        setResponseLoading(false); 

        if (response) { 
            setChatHistory(response.history); 
            if (response.todoItem !== '') {
                setNewTodoItem([response.todoItem, "False"]);
            } else { 
                setNewTodoItem(["", ""]);
            }
        }
    }

    // Set chat history on mount
    useEffect(() => { 
        const fetchChatHistory = async () => {
            const response = await fetchWithoutParams<ChatHistoryType>('api/v0?get=chat'); 
            if (response) { setChatHistory(response.history); }
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


    const sendTodoItem = async () => {
        const current_list = getTodoData().todoItems;
        await fetchWithParams('api/v0',
        {
            notif: "update_todo",
            todoItems: [...(current_list || []), [newTodoItem[0], "False"]]
        })
    }


    return ( 
        <div className="flex flex-col items-center justify-center pb-20">
            <div ref={scrollRef} className="overflow-scroll max-h-[700px] py-4 pb-8">
                {chatHistory.map((chatItem, index) => (
                    <div key={index} className="flex flex-row gap-x-2 py-1 gap-y-2">
                        <div className={`p-2 flex flex-row rounded-lg ${chatItem.role === "user" ? "bg-slate-800 text-white" : "bg-slate-700 text-white"}`}>
                            {chatItem.role === "user" ? (
                                <>
                                    <Image src={suits_image} width={20} height={10} alt='' className="max-h-[20px]" />
                                    {chatItem.parts.map((part, index) => (
                                        <p key={index} className="pl-3 pr-2 text-sm">{part}</p>
                                    ))}
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row pr-2">
                                            <Image src={team_cartographer_logo} width={20} height={10} className="max-h-[20px] rounded-full" alt='' />
                                            {chatItem.parts.map((part, index) => (
                                                <MarkdownContent key={index} markdown={part} />
                                            ))}
                                        </div>
                                        {
                                            newTodoItem[0] !== '' && index === chatHistory.length - 1 && 
                                            <div className="flex flex-col text-sm px-4 pt-3 pb-1">
                                                <span className="pb-1 text-muted-foreground">
                                                    Suggested Todo Item (Click to Send): 
                                                </span>
                                                <div className="flex flex-row items-center">
                                                    <p className="text-wrap pr-4">{newTodoItem[0]}</p>
                                                    <Button 
                                                        variant="secondary"
                                                        onClick={sendTodoItem}
                                                    >
                                                        Send
                                                    </Button>
                                                </div>
                                            </div>
                                        }
                                    </div>
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