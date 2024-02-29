"use client";

/**
 * @author @areich128
 * @function GeoSampler
 */

import { fetchWithParams } from "@/api/fetchServer";
import { useState } from "react";
import { useEffect } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"  
import { Chart } from "react-google-charts";
import { useNetwork } from "@/hooks/context/network-context";

declare module 'react-google-charts' {
    export class Chart extends React.Component<any, any> {}
  }

import { SpecItem } from "@/hooks/types"


const GeoSampler = () => {
  const networkProvider = useNetwork();
  const [idValue, setIdValue] = useState(0);
  const [EVA1SpecItem, setEVA1SpecItem] = useState<SpecItem | null>(null);
  const [EVA2SpecItem, setEVA2SpecItem] = useState<SpecItem | null>(null);
  const [switchState, setSwitchState] = useState<boolean>(false);
  const [todoItems, setTodoItems] = useState<[string, string][]>();
    
    const handleSwitchChange = () => {
        setSwitchState((prevChecked) => !prevChecked);
    };

    const fetchSampleID = async () => {
        try {
            const specData = networkProvider.getSpecData()
            setIdValue(specData.eva1?.id || 0);
            setEVA1SpecItem(specData.eva1);
            setEVA2SpecItem(specData.eva2);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const addTodoItems = async () => {
        if (EVA1SpecItem && EVA1SpecItem.name !== undefined && EVA1SpecItem.id !== undefined) {
            const updated = [`Pick up Spec Item: ${EVA1SpecItem.name} (ID: ${EVA1SpecItem.id})`, "False"];
    
            const itemExists = todoItems && todoItems.some(item => 
                item[0] === updated[0]
            );
    
            if (!itemExists) {
                await fetchWithParams('api/v0', {
                    notif: "update",
                    todoItems: [...(todoItems || []), updated]
                });
            }
        }
    }
    

    useEffect(() => {
        const intervalID = setInterval(() => {
            fetchSampleID();
            setTodoItems(networkProvider.getNotifData().todoItems)
            addTodoItems();
        }, 100);

        return () => clearInterval(intervalID);
    });

    const chartData = EVA1SpecItem?[['Element', 'Value'], ...Object.entries(EVA1SpecItem.data)]
        : [];

    const options = {
        title: EVA1SpecItem?.name || '',
        legend: { position: 'none' }
    };

    const columns = [
        {
            type: 'number',
            label: 'Value'
        },
    ];


  return (
    <div className="container mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-4">Geological Sampling</h1>
        <h2 className="text-1xl font-bold mb-4">Sample Name, ID</h2>
        <p className={`text-l ${idValue !== 0 ? 'text-green-500' : 'text-red-500'}`}>
            {EVA1SpecItem?.name}, {EVA1SpecItem?.id}
        </p>
        <Table>
            <TableCaption>Caption is here for now.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px]">Sample Name</TableHead>
                    <TableHead>Sample ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Display?</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="w-[50px]">{EVA1SpecItem?.name}</TableCell>
                    <TableCell className="w-[50px]">{EVA1SpecItem?.id}</TableCell>
                    <TableCell className="w-[50px]">Collected</TableCell>
                    <Accordion type="multiple">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                Display {EVA1SpecItem?.name} data
                            </AccordionTrigger>
                            <AccordionContent>
                                <Chart
                                    chartType="BarChart"
                                    width="100%"
                                    height="300px"
                                    data={chartData}
                                    options={options}
                                    loader={<div>Loading Chart</div>}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                {/*
                    <TableCell className="font-medium">{EVA1SpecItem?.name}</TableCell>
                    <TableCell>{EVA1SpecItem?.id}</TableCell>
                    <TableCell>Collected</TableCell>
                    <TableCell className="text-right"><Switch />
                    </TableCell>
                    */}
                </TableRow>
            </TableBody>
        </Table>
    </div>
  );
};

export default GeoSampler;

{/*
<TableCell className="text-right"><Switch checked={field.value} onCheckedChange={field.onChange} />
</TableCell>
*/}
