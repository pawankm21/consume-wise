import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function SearchBar() {
    return (
        <div className="flex justify-center m-2 place-items-center p-1">
            <Button variant="outline" className="rounded p-2 border-gray-300 m-2 bg-orange-400 text-white hover:bg-orange-600 ">
                <SearchIcon className="w-5 h-5" />
            </Button>
            <Input
                type="text"
                placeholder="Search"
                className="w-full max-w-md rounded  text-orange-600 border-orange-400 border-2 shadow shadow-orange-200"
                name="search"
            />
        </div>
    )
}