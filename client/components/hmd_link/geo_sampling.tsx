"use client";

/**
 * @author @areich128
 * @function GeoSampler
 */

import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer";
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
import { Switch } from "@/components/ui/switch"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"  
import { Chart } from "react-google-charts";

declare module 'react-google-charts' {
    export class Chart extends React.Component<any, any> {}
  }

interface SpecData {
    Al2O3: number;
    CaO: number;
    FeO: number;
    K2O: number;
    MgO: number;
    MnO: number;
    P2O3: number;
    SiO2: number;
    TiO2: number;
    other: number;
  }
  
  interface SpecItem {
    data: SpecData;
    id: number;
    name: string;
  }
  
  interface Spec {
    [key: string]: SpecItem;
  }
  
  interface SpecData {
    spec: Spec;
  }

let EVA1SpecItem: SpecItem | null;
let EVA2SpecItem: SpecItem | null;


const GeoSampler = () => {
  const [idValue, setIdValue] = useState(0);
  const [EVA1SpecItem, setEVA1SpecItem] = useState<SpecItem | null>(null);
  const [EVA2SpecItem, setEVA2SpecItem] = useState<SpecItem | null>(null);
  const [switchState, setSwitchState] = useState<boolean>(false);
    
    const handleSwitchChange = () => {
        setSwitchState((prevChecked) => !prevChecked);
    };

    const fetchSampleID = async () => {
        try {
            const specData = await fetchWithoutParams<SpecData>("mission/spec");
            console.log('API Response:', specData);

            if (specData) {
                console.log(specData.spec["eva1"].id);
                setIdValue(specData.spec["eva1"].id);

                setEVA1SpecItem({
                    data: specData.spec["eva1"].data,
                    id: specData.spec["eva1"].id,
                    name: specData.spec["eva1"].name
                })
                
                setEVA2SpecItem({
                    data: specData.spec["eva2"].data,
                    id: specData.spec["eva2"].id,
                    name: specData.spec["eva2"].name
                })

            }

            

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    

    useEffect(() => {
        fetchSampleID();
        const intervalID = setInterval(fetchSampleID, 500);

        return () => clearInterval(intervalID);
    }, []);

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
                    <Accordion type="multiple" collapsible>
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
