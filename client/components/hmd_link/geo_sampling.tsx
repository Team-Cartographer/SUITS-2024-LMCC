"use client";

/**
 * @author @areich128
 * @function GeoSampler
 */

import { fetchWithParams } from "@/api/fetchServer";
import { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { useNetwork } from "@/hooks/context/network-context";
import { SpecItem } from "@/hooks/types"

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

interface GeoSamplerParams { 
    spec1Items: SpecItem[];
    spec2Items: SpecItem[];
    EVA1SpecItem: SpecItem | null;
    EVA2SpecItem: SpecItem | null;
}

const GeoSampler = ({
    spec1Items, 
    spec2Items, 
    EVA1SpecItem, 
    EVA2SpecItem
}: GeoSamplerParams) => {
  return (
    <div style={{ height: '620px', width: '800px' }} className="flex flex-col container mx-auto mt-8">
        <p style={{ marginTop: '-50px' }} className={`text-l ${EVA1SpecItem?.id !== 0 ? 'text-green-500' : 'text-red-500'}`}>
            EVA 1 Data:
        </p>
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
                    <TableCell className="w-[50px]">{specItem.name}</TableCell>
                    <TableCell className="w-[50px]">{specItem.id}</TableCell>
                    <TableCell className="w-[50px]">
                    <input type="checkbox" />
                    </TableCell>
                    <Accordion type="multiple">
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger>
                                Display {specItem.name} Geological Makeup 
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
        <p className={`text-l ${EVA2SpecItem?.id !== 0 ? 'text-green-500' : 'text-red-500'}`}>
            EVA 2 Data:
        </p>
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
                    <TableCell className="w-[50px]">{specItem.name}</TableCell>
                    <TableCell className="w-[50px]">{specItem.id}</TableCell>
                    <TableCell className="w-[50px]">
                        <input type="checkbox" />
                    </TableCell>
                    <Accordion type="multiple">
                        <AccordionItem value={`item-${index}`}>
                            <AccordionTrigger>
                                Display {specItem.name} Geological Makeup 
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
