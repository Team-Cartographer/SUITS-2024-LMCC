import { useEffect, useState } from "react";
import Map from "../nav/map";
import { Button } from "../ui/button";
import ProcedureLists from "../hmd_link/procedure-lists";
import dynamic from "next/dynamic";
import { SpecItem } from "@/lib/types";
import { fetchWithParams } from "@/api/fetchServer";
import { useNetwork } from "@/hooks/context/network-context";

const NoSSR_GeoSampler = dynamic(() => import('@/components/hmd_link/geo_sampling'), { ssr: false })

interface WindowNames {
    [key: string]: JSX.Element;
  }

const windows = {
    "map": "Map",
    "lists": "Procedures",
    "geo": "Geological Sampling"
}

const ScreenOneContentManager = () => {
    const networkProvider = useNetwork();


    //////////////////////////////////////////////////////////////////////
    // GEO SAMPLER LOGIC /////////////////////////////////////////////////

    const [spec1Items, setSpec1Items] = useState<SpecItem[]>([]);
    const [spec2Items, setSpec2Items] = useState<SpecItem[]>([]);
    const specData = networkProvider.getSpecData(); 
    const todoItems = networkProvider.getTodoData().todoItems; 
    const [EVA1SpecItem, EVA2SpecItem] = [specData.eva1, specData.eva2]; 
    const [eva1CompletedItems, setEva1CompletedItems] = useState<SpecItem[]>([]);
    const [eva2CompletedItems, setEva2CompletedItems] = useState<SpecItem[]>([]);

    const addTodoItems = async () => {
        if (EVA1SpecItem && EVA1SpecItem.id !== 0 && !eva1CompletedItems.some(item => item.id === EVA1SpecItem.id)) {
            const updated = [`(EVA 1) Pick up Spec Item: ${EVA1SpecItem.name} (ID: ${EVA1SpecItem.id})`, "False"];
    
            const itemExists = todoItems && todoItems.some(item => 
                item[0] === updated[0]
            );
    
            if (!itemExists) {
                await fetchWithParams('api/v0', {
                    notif: "update_todo",
                    todoItems: [...(todoItems || []), updated]
                });
            }
        }
        if (EVA2SpecItem && EVA2SpecItem.id !== 0 && !eva2CompletedItems.some(item => item.id === EVA2SpecItem.id)) {
            const updated = [`(EVA 2) Pick up Spec Item: ${EVA2SpecItem.name} (ID: ${EVA2SpecItem.id})`, "False"];
    
            const itemExists = todoItems && todoItems.some(item => 
                item[0] === updated[0]
            );
    
            if (!itemExists) {
                await fetchWithParams('api/v0', {
                    notif: "update_todo",
                    todoItems: [...(todoItems || []), updated]
                });
            }
        }
    }

    useEffect(() => {
        if ((EVA1SpecItem?.id !== 0) && (EVA1SpecItem?.data) && (EVA1SpecItem?.name)){
            const newSpecItem: SpecItem = {
                data: EVA1SpecItem?.data,
                id: EVA1SpecItem?.id,
                name: EVA1SpecItem?.name
            }
            if (!spec1Items.some(item => item.id === EVA1SpecItem.id)) { 
                setSpec1Items(prevSpecItem => [...prevSpecItem, newSpecItem])
            }
        }
        if ((EVA2SpecItem?.id !== 0) && (EVA2SpecItem?.data) && (EVA2SpecItem?.name)){
            const newSpecItem: SpecItem = {
                data: EVA2SpecItem?.data,
                id: EVA2SpecItem?.id,
                name: EVA2SpecItem?.name
            }
            if (!spec2Items.some(item => item.id === EVA2SpecItem.id)) { 
                setSpec2Items(prevSpecItem => [...prevSpecItem, newSpecItem]) 
            }
        }
        addTodoItems(); 

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [EVA1SpecItem, EVA2SpecItem])


    //////////////////////////////////////////////////////////////////////
    return ( 
        <div className="grid grid-cols-1 grid-rows-2">
            <div className="flex flex-row">
                <Map />
                <ProcedureLists />
            </div>
                <NoSSR_GeoSampler 
                    spec1Items={spec1Items}
                    spec2Items={spec2Items}
                    EVA1SpecItem={EVA1SpecItem}
                    EVA2SpecItem={EVA2SpecItem}
                    setEva1CompletedItems={setEva1CompletedItems}
                    setEva2CompletedItems={setEva2CompletedItems}
                />
        </div>
     );
}
 
export default ScreenOneContentManager;