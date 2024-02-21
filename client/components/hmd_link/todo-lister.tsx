"use client";

import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer";
import { useEffect, useState } from "react";
import { TodoAreaForm } from "./forms/todo-list-form";
import * as z from "zod"
import { X } from "lucide-react";

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

    const fetchPanicData = async () => {
        try {
            const notificationData = await fetchWithoutParams<PanicData>(
                `api/v0?get=notif`,
            )
            if (notificationData) { 
                setNotifData(notificationData); 
                console.log(notificationData.todoItems);
            } else { 
                throw Error('could not get notification data'); 
            }
        } catch (err) {
            console.error("Error fetching panic data:", err);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(fetchPanicData, 400); 
        return () => clearInterval(intervalId);
      });

    
    const onFormSubmit = async (formData: z.infer<typeof FormSchema>) => {
        sendTodoItem(formData.todoitem);
    }

    const sendTodoItem = async (new_item: string) => {
        const current_list = notifData?.todoItems
        if (current_list) {
            await fetchWithParams('api/v0',
            {
                notif: "update",
                todoItems: current_list.concat([new_item, "False"])
            })
        }
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
        <div className="flex flex-col text-sm self-start gap-x-2">
            <div className="text-lg font-bold pb-2">
                HMD Todo List
            </div>
            <div className="pb-2">
                {notifData?.todoItems.map(([taskItem, taskStatus]: Task, index: number) => (
                    <div key={index} style={{ textDecoration: taskStatus !== "False" ? 'line-through' : 'none' }} className="flex flex-row">
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
            </div>
            <TodoAreaForm onFormSubmit={onFormSubmit} />
        </div>
     );
}
 
export default TodoLister