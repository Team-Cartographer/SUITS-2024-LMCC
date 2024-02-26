"use client";

import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";
import { TodoAreaForm } from "./forms/todo-list-form";
import * as z from "zod"
import { X } from "lucide-react";
import { useNetwork } from "@/hooks/context/network-provider";

interface PanicData {
    infoWarning: string, 
    todoItems: [string, string][], 
    isWarning: boolean,
}

type Task = [string, string]

const FormSchema = z.object({
    todoitem: z
      .string()
  })

const TodoLister = () => {
    const [notifData, setNotifData] = useState<PanicData>();
    const networkProvider = useNetwork();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setNotifData(networkProvider.getNotifData())
        }, 100); 
        return () => clearInterval(intervalId);
      });

    
    const onFormSubmit = async (formData: z.infer<typeof FormSchema>) => {
        sendTodoItem(formData.todoitem);
    }

    const sendTodoItem = async (new_item: string) => {
        const current_list = notifData?.todoItems
        await fetchWithParams('api/v0',
        {
            notif: "update",
            todoItems: [...(current_list || []), [new_item, "False"]]
        })
    }

    const toggleTaskStatus = async (index: number) => {
        const updatedTasks = notifData?.todoItems.map((task, i) => {
            if (i === index) {
              const currentStatus = task[1] === "True"; // true if "true", false otherwise
              const toggledStatus = !currentStatus; // Toggle the boolean value
              return [task[0], toggledStatus ? "True" : "False"]; // Convert boolean back to string
            }
            return task;
          });
        await fetchWithParams('api/v0',
            {
                notif: "update",
                todoItems: updatedTasks
        })
      };

    const deleteTask = async (index: number) => {
        const updatedTasks = notifData?.todoItems.filter((_, i) => i !== index);
        await fetchWithParams('api/v0',
        {
                notif: "update",
                todoItems: updatedTasks
        })
      };

    return ( 
        <div className="flex flex-col text-sm self-start gap-x-2 p-4">
            <div className="text-lg font-bold pb-2 underline self-start">
                HMD Todo List
            </div>
            <div className="pb-4 self-start">
                {notifData?.todoItems && notifData?.todoItems.map(([taskItem, taskStatus]: Task, index: number) => (
                    <div key={index} style={{ textDecoration: taskStatus !== "False" ? 'line-through' : 'none' }} className="flex flex-row pl-3">
                        <input
                        type="checkbox"
                        checked={taskStatus !== "False"}
                        onChange={() => toggleTaskStatus(index)}
                        />
                        <button 
                            onClick={() => deleteTask(index)} 
                            className="pl-1 pr-2 text-sm hover:text-slate-700">
                            <X className="h-4 w-4"/>
                        </button>
                        <p className={`${taskStatus !== "False" ? "text-muted-foreground" : ""}`}>{taskItem}</p>
                    </div>
                    ))
                }
                {(notifData?.todoItems || []).length === 0 && (
                    <div className="text-muted-foreground">
                        All Tasks Are Currently Complete...Good Work!
                    </div>
                )}
            </div>
            <TodoAreaForm onFormSubmit={onFormSubmit} />
        </div>
     );
}
 
export default TodoLister