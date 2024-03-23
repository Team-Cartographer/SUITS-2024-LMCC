/* eslint-disable react-hooks/exhaustive-deps */
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
    const [Spec1Items, setSpec1Items] = useState<SpecItem[]>([]);
    const [Spec2Items, setSpec2Items] = useState<SpecItem[]>([]);
    const [currentId1, setCurrentId1] = useState<number>(0);
    const [currentId2, setCurrentId2] = useState<number>(0);
    const networkProvider = useNetwork();
    const [id1Value, setId1Value] = useState(0);
    const [id2Value, setId2Value] = useState(0);
    const [id1Name, setId1Name] = useState('');
    const [id2Name, setId2Name] = useState('');
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
            setId1Value(specData.eva1?.id || 0);
            setId2Value(specData.eva2?.id || 0);
            setEVA1SpecItem(specData.eva1);
            setEVA2SpecItem(specData.eva2);

            if (specData.eva1?.id && specData.eva1.id !== id1Value) {
                setId1Value(specData.eva1.id); 
                setEVA1SpecItem(specData.eva1);
                setCurrentId1(specData.eva1.id);
            }
            if (specData.eva2?.id && specData.eva2.id !== id2Value) {
                setId2Value(specData.eva2.id); 
                setEVA2SpecItem(specData.eva2);
                setCurrentId2(specData.eva2.id);
            }
            //for the time being, only changing eva1 as a proof of concept. 
            //REMEMBER TO CHANGE FOR EVA2 EVENTUALLY

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const addTodoItems = async () => {
        if (EVA1SpecItem && EVA1SpecItem.name !== undefined && EVA1SpecItem.id !== undefined && EVA1SpecItem.id !== 0) {
            const updated = [`(EVA 1) Pick up Spec Item: ${EVA1SpecItem.name} (ID: ${EVA1SpecItem.id})`, "False"];
    
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
        if (EVA2SpecItem && EVA2SpecItem.name !== undefined && EVA2SpecItem.id !== undefined && EVA2SpecItem.id !== 0) {
            const updated = [`(EVA 2) Pick up Spec Item: ${EVA2SpecItem.name} (ID: ${EVA2SpecItem.id})`, "False"];
    
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

    useEffect(() => {
        if ((currentId1 !== 0) && (EVA1SpecItem?.data) && (EVA1SpecItem?.name)){
            const newSpecItem: SpecItem = {
                data: EVA1SpecItem?.data,
                id: EVA1SpecItem?.id,
                name: EVA1SpecItem?.name
            }
            setSpec1Items(prevSpecItem => [...prevSpecItem, newSpecItem])
        }
    }, [currentId1]);

    useEffect(() => {
        if ((currentId2 !== 0) && (EVA2SpecItem?.data) && (EVA2SpecItem?.name)){
            const newSpecItem: SpecItem = {
                data: EVA2SpecItem?.data,
                id: EVA2SpecItem?.id,
                name: EVA2SpecItem?.name
            }
            setSpec2Items(prevSpecItem => [...prevSpecItem, newSpecItem])
        }
    }, [currentId2]);

    const chart1Data = EVA1SpecItem?[['Element', 'Value'], ...Object.entries(EVA1SpecItem.data)]
        : [];

    const chart2Data = EVA2SpecItem?[['Element', 'Value'], ...Object.entries(EVA2SpecItem.data)]
        : [];

    const options1 = {
        title: EVA1SpecItem?.name || '',
        legend: { position: 'none' }
    };

    const options2 = {
        title: EVA2SpecItem?.name || '',
        legend: { position: 'none' }
    };

    const columns = [
        {
            type: 'number',
            label: 'Value'
        },
    ];


  return (
    <div style={{ height: '620px', width: '800px' }} className="flex flex-col container mx-auto mt-8">
        <p style={{ marginTop: '-50px' }} className={`text-l ${id1Value !== 0 ? 'text-green-500' : 'text-red-500'}`}>
            EVA 1 Data:
        </p>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px]">Sample Name</TableHead>
                    <TableHead>Sample ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Display?</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Spec1Items.map((specItem, index) => (
                <TableRow key={index}>
                    <TableCell className="w-[50px]">{specItem.name}</TableCell>
                    <TableCell className="w-[50px]">{specItem.id}</TableCell>
                    <TableCell className="w-[50px]">Collected</TableCell>
                    <Accordion type="multiple">
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger>
                                Display {specItem.name} data
                            </AccordionTrigger>
                            <AccordionContent>
                                <Chart
                                    chartType="BarChart"
                                    width="100%"
                                    height="300px"
                                    data={[['Element', 'Value'], ...Object.entries(specItem.data)]}
                                    options={{ title: specItem.name, legend: { position: 'none' }}}
                                    loader={<div>Loading Chart</div>}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </TableRow>
                ))}
            </TableBody>
        </Table>
        <div style={{ height: '60px' }}></div>
        <p className={`text-l ${id2Value !== 0 ? 'text-green-500' : 'text-red-500'}`}>
            EVA 2 Data:
        </p>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px]">Sample Name</TableHead>
                    <TableHead>Sample ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Display?</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {Spec2Items.map((specItem, index) => (
                <TableRow key={index}>
                    <TableCell className="w-[50px]">{specItem.name}</TableCell>
                    <TableCell className="w-[50px]">{specItem.id}</TableCell>
                    <TableCell className="w-[50px]">Collected</TableCell>
                    <Accordion type="multiple">
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger>
                                Display {specItem.name} data
                            </AccordionTrigger>
                            <AccordionContent>
                                <Chart
                                    chartType="BarChart"
                                    width="100%"
                                    height="300px"
                                    data={[['Element', 'Value'], ...Object.entries(specItem.data)]}
                                    options={{ title: specItem.name, legend: { position: 'none' }}}
                                    loader={<div>Loading Chart</div>}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </TableRow>
                ))}
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

{/*
    <TableCell className="font-medium">{EVA1SpecItem?.name}</TableCell>
    <TableCell>{EVA1SpecItem?.id}</TableCell>
    <TableCell>Collected</TableCell>
    <TableCell className="text-right"><Switch />
    </TableCell>
    */}

    // <h1 style={{ textAlign: 'center'  }} className="text-2xl font-bold mb-4">Geological Sampling </h1>
