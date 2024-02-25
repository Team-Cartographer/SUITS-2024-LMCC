"use client";

/**
 * @author @areich128
 * @function GeoSampler
 */

import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer";
import { useState } from "react";
import { useEffect } from "react";
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
    </div>
  );
};

export default GeoSampler;
