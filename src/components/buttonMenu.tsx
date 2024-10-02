"use client";

import { ForkKnife, History, Home, Scan } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getItemFromStorage } from "@/lib/utils";
import { usePathname ,useRouter} from "next/navigation";

const menuItems =  [
    { name: 'Home', path: '/' ,icon: <Home className="w-5 h-5" /> },
    { name: 'scanner', path: '/scanner', icon: <Scan className="w-5 h-5" /> },
    { name: 'Recipes', path: '/recipes', icon: <ForkKnife className="w-5 h-5" />},
    { name: 'History', path: '/history', icon: <History className="w-5 h-5" /> },
  ];
export default function ButtonMenu() {
    const pathName = usePathname();
    const router = useRouter()
    console.log(pathName)
  return (
    <div className="p-8 pt-12 bg-white  rounded-t-full md:rounded-none  shadow-black  shadow-2xl grid grid-flow-col gap-2">
        {menuItems.map((item) => (
          <Button
            key={item.name}
            className={` ${
              pathName===item.path
                ? "text-white"
                : "bg-transparent shadow-none text-orange-400 hover:text-white"
            }`}
            onClick={()=>router.push(item.path)}
          >
           
              {item.icon}
        
          </Button>
        ))}
  
    </div>
  );
}
