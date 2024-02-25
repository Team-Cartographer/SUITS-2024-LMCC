"use client";

/**
 * @author @areich128
 * @function GeoSampler
 */

import { fetchWithParams, fetchWithoutParams } from "@/api/fetchServer";
import { useState } from "react";
import { useEffect } from "react";

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

const GeoSampler = () => {
  const [idValue, setIdValue] = useState(0);
    
  const fetchSampleID = async () => {
    try {
        const specData = await fetchWithoutParams<SpecData>("mission/spec");
        console.log('API Response:', specData);

        if (specData) {
            console.log(specData.spec["eva1"].id);
            setIdValue(specData.spec["eva1"].id);
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
        <h1 className="text-2xl font-bold mb-4">Sample ID</h1>
        <p className={`text-3xl ${idValue !== 0 ? 'text-red-500' : 'text-green-500'}`}>
            {idValue}
        </p>
    </div>
  );
};

export default GeoSampler;
