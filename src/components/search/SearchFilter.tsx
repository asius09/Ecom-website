"use client";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useState } from "react";

interface SearchFilterProps {
  onFilterChange: (filters: { priceRange: [number, number] }) => void;
}

export function SearchFilter({ onFilterChange }: SearchFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
    onFilterChange({ priceRange: [value[0], value[1]] });
  };

  const clearFilters = () => {
    setPriceRange([0, 1000]);
    onFilterChange({ priceRange: [0, 1000] });
  };

  return (
    <Card className="w-72">
      <CardHeader>
        <h3 className="text-lg font-semibold">Filter by Price</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Slider
              defaultValue={[0, 1000]}
              max={1000}
              step={10}
              onValueChange={handlePriceChange}
              value={priceRange}
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          Clear Filters
        </Button>
      </CardFooter>
    </Card>
  );
}
