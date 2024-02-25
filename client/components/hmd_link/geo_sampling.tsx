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

import { DataTable } from "@/components/ui/data_table";
import { ColumnDef } from "@tanstack/react-table"

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
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Display?</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">{EVA1SpecItem?.name}</TableCell>
                    <TableCell>{EVA1SpecItem?.id}</TableCell>
                    <TableCell>TBD</TableCell>
                    {/*
                    <TableCell className="text-right"><Switch checked={switchState} onChange={handleSwitchChange} />
                    */}
                    <TableCell className="text-right"><Switch />
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>

        <Table>
            <TableCaption>Sample Composition Data</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[150px]">Sample Name</TableHead>
                    <TableHead>Mineral</TableHead>
                    <TableHead>Composition</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium">{EVA1SpecItem?.name}</TableCell>
                    <TableCell>SiO2</TableCell>
                    <TableCell>{EVA1SpecItem?.data.SiO2}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">{EVA1SpecItem?.name}</TableCell>
                    <TableCell>Al2O3</TableCell>
                    <TableCell>{EVA1SpecItem?.data.Al2O3}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">{EVA1SpecItem?.name}</TableCell>
                    <TableCell>MnO</TableCell>
                    <TableCell>{EVA1SpecItem?.data.MnO}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">{EVA1SpecItem?.name}</TableCell>
                    <TableCell>CaO</TableCell>
                    <TableCell>{EVA1SpecItem?.data.CaO}</TableCell>
                </TableRow>

                <TableRow>
                    <TableCell className="font-medium">{EVA1SpecItem?.name}</TableCell>
                    <TableCell>P2O3</TableCell>
                    <TableCell>{EVA1SpecItem?.data.P2O3}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">{EVA1SpecItem?.name}</TableCell>
                    <TableCell>TiO2</TableCell>
                    <TableCell>{EVA1SpecItem?.data.TiO2}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">{EVA1SpecItem?.name}</TableCell>
                    <TableCell>FeO</TableCell>
                    <TableCell>{EVA1SpecItem?.data.FeO}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">{EVA1SpecItem?.name}</TableCell>
                    <TableCell>MgO</TableCell>
                    <TableCell>{EVA1SpecItem?.data.MgO}</TableCell>
                </TableRow>

                <TableRow>
                    <TableCell className="font-medium">{EVA1SpecItem?.name}</TableCell>
                    <TableCell>K2O</TableCell>
                    <TableCell>{EVA1SpecItem?.data.K2O}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell className="font-medium">{EVA1SpecItem?.name}</TableCell>
                    <TableCell>Other</TableCell>
                    <TableCell>{EVA1SpecItem?.data.other}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    </div>
  );
};

export default GeoSampler;
