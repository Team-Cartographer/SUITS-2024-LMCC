import React from 'react';
import { Chart } from "react-google-charts";
import { SpecItem } from "@/lib/types";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

interface GeoSamplerParams { 
    spec1Items: SpecItem[];
    spec2Items: SpecItem[];
    EVA1SpecItem: SpecItem | null;
    EVA2SpecItem: SpecItem | null;
    setEva1CompletedItems: React.Dispatch<React.SetStateAction<SpecItem[]>>;
    setEva2CompletedItems: React.Dispatch<React.SetStateAction<SpecItem[]>>;
}

const GeoSampler = ({
    spec1Items, 
    spec2Items, 
    EVA1SpecItem, 
    EVA2SpecItem,
    setEva1CompletedItems,
    setEva2CompletedItems,
}: GeoSamplerParams) => {
  return (
    <div className="flex flex-col h-full max-h-[600px] text-sm overflow-y-auto p-4 border border-gray-200 rounded-lg pt-6">
        <div className="space-y-4">
            <div className="space-y-2">
                <p className={`${EVA1SpecItem?.id !== 0 ? 'text-green-500' : 'text-red-500'}`}>
                    EVA 1 Data:
                </p>
                <div className="flex-1 overflow-auto max-h-[300px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Sample Name</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Display?</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {spec1Items.map((specItem, index) => (
                            <TableRow key={index}>
                                <TableCell>{specItem.name}</TableCell>
                                <TableCell>{specItem.id}</TableCell>
                                <TableCell>
                                    <input 
                                        type="checkbox" 
                                        onChange={(e) => {
                                            setEva1CompletedItems(prevItems => [...prevItems, specItem])
                                            e.target.disabled = true 
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="w-full">
                                    <Accordion type="multiple">
                                        <AccordionItem value={`item-${index}`}>
                                            <AccordionTrigger>
                                                Display {specItem.name} Geological Makeup 
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <Chart
                                                    chartType="BarChart"
                                                    width="100%"
                                                    height="200px"
                                                    data={[['Element', 'Value'], ...Object.entries(specItem.data)]}
                                                    options={{ title: specItem.name, legend: { position: 'none' }}}
                                                    loader={<div>Loading Chart</div>}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="space-y-2">
                <p className={`${EVA2SpecItem?.id !== 0 ? 'text-green-500' : 'text-red-500'}`}>
                    EVA 2 Data:
                </p>
                <div className="flex-1 overflow-auto max-h-[300px]">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]">Sample Name</TableHead>
                                <TableHead>ID</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Display?</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {spec2Items.map((specItem, index) => (
                            <TableRow key={index}>
                                <TableCell>{specItem.name}</TableCell>
                                <TableCell>{specItem.id}</TableCell>
                                <TableCell>
                                    <input 
                                        type="checkbox" 
                                        onChange={(e) => {
                                            setEva2CompletedItems(prevItems => [...prevItems, specItem])
                                            e.target.disabled = true; 
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="w-full">
                                    <Accordion type="multiple">
                                        <AccordionItem value={`item-${index}`}>
                                            <AccordionTrigger>
                                                Display {specItem.name} Geological Makeup 
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <Chart
                                                    chartType="BarChart"
                                                    width="100%"
                                                    height="200px"
                                                    data={[['Element', 'Value'], ...Object.entries(specItem.data)]}
                                                    options={{ title: specItem.name, legend: { position: 'none' }}}
                                                    loader={<div>Loading Chart</div>}
                                                />
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default GeoSampler;
