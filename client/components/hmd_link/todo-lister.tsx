"use client";


import { TodoAreaForm } from "./forms/todo-list-form";
import * as z from "zod"
import { X } from "lucide-react";
import { useNetwork } from "@/hooks/context/network-context";

type Task = [string, string]

const FormSchema = z.object({
    todoitem: z
      .string()
  })

const TodoLister = () => {
    
    const { getTodoData, updateTodoItems, updateTodoItemsViaList } = useNetwork(); 
    const todoData = getTodoData();

    
    const onFormSubmit = async (formData: z.infer<typeof FormSchema>) => {
        updateTodoItems(formData.todoitem);
    }

    const toggleTaskStatus = async (index: number) => {
        const updatedTasks = todoData?.todoItems.map((task, i) => {
            if (i === index) {
              const currentStatus = task[1] === "True"; // true if "true", false otherwise
              const toggledStatus = !currentStatus; // Toggle the boolean value
              return [task[0], toggledStatus ? "True" : "False"]; // Convert boolean back to string
            }
            return task;
          });
        updateTodoItemsViaList(updatedTasks);
      };

    const deleteTask = async (index: number) => {
        const updatedTasks = todoData?.todoItems.filter((_, i) => i !== index);
        updateTodoItemsViaList(updatedTasks);
      };

    return ( 
        <div className="flex flex-col text-sm self-start gap-x-2 p-4">
            <div className="text-lg font-bold pb-2 underline self-start">
                Todo List
            </div>
            <div className="pb-4 self-start text-base">
                {todoData?.todoItems && todoData?.todoItems.map(([taskItem, taskStatus]: Task, index: number) => (
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
                {(todoData?.todoItems || []).length === 0 && (
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