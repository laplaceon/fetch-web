import React, { useEffect, useState } from "react";
import CreatableSelect from 'react-select/creatable';
import { MoveUpIcon, MoveDownIcon } from "lucide-react";

import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";

import { getBreeds, getLocationsByZipcodes, getLocationsByQuery } from "@/api";

export const FilterPanel = ({ filters, setFilters }) => {
    const sortCategories = [
      {key: "breed", label: "Breed"},
      {key: "name", label: "Name"},
      {key: "age", label: "Age"}
    ];
    const stateOptions = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

    const [locations, setLocations] = useState();
    const [breeds, setBreeds] = useState([]);

    useEffect(() => {
        // Get breeds
        if (breeds.length === 0) {
          (async () => {
            const apiGetBreedsResponse = await getBreeds();
            if (apiGetBreedsResponse.status === 200) {
              setBreeds((await apiGetBreedsResponse.json()).map((breedName: string) => ({
                key: breedName,
                label: breedName
              })));
            }
          })()
        }
    })

    const searchByCityName = (cityName: string) => {
      console.log(cityName)
    }

    const searchByState = (states: string[]) => {
      console.log(states)
    }

    const updateBreedSelection = (selectedItems) => {
      setFilters({
        ...filters,
        breeds: new Set(selectedItems)
      });
    };

    const updateAgeRange = (ageRange: number[]) => {
      setFilters({
        ...filters,
        ageMin: ageRange[0],
        ageMax: ageRange[1],
      })
    };

    const updateSortCategory = (selectedItems) => {
      const splitParams = filters.sort.split(":")
      setFilters({
        ...filters,
        sort: `${selectedItems.currentKey}:${splitParams[1]}`
      })
    }

    const toggleSortOrder = () => {
      const splitParams = filters.sort.split(":")
      if (splitParams[1] === "asc") {
        setFilters({
          ...filters,
          sort: `${splitParams[0]}:desc`
        })
      } else {
        setFilters({
          ...filters,
          sort: `${splitParams[0]}:asc`
        })
      }
      
    }

    return (
      <div className="w-full p-4 shadow-md flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Breed</h3>
        <Select
          className="w-full"
          label="Select breeds"
          placeholder="Select breeds..."
          selectionMode="multiple"
          showScrollIndicators
          onSelectionChange={updateBreedSelection}
        >
          {breeds.map((breed) => (
            <SelectItem key={breed.key}>{breed.label}</SelectItem>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Location</h3>
          <Input label="City" placeholder="Enter city name" />
        </div>

        <div className="flex items-end gap-4">
          <Select className="w-1/2" label="State" placeholder="Select states..." selectionMode="multiple" showScrollIndicators>
            {stateOptions.map((state) => (
              <SelectItem key={state}>{state}</SelectItem>
            ))}
          </Select>

          <CreatableSelect
            className="w-1/2"
            isClearable
            isMulti
            components={{ DropdownIndicator: null }}
            placeholder="Enter a zip code..."
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Age Range</h3>
        <Slider
          defaultValue={[filters.ageMin, filters.ageMax]}
          label="Select age range"
          maxValue={30}
          minValue={0}
          step={1}
          onChangeEnd={updateAgeRange}
        />
      </div>

      <div className="flex items-center gap-4">
        <h3 className="text-lg font-semibold">Sort by:</h3>
        <Select defaultSelectedKeys={["breed"]} onSelectionChange={updateSortCategory}>
          {sortCategories.map((sortCategory) => (
            <SelectItem key={sortCategory.key}>{sortCategory.label}</SelectItem>
          ))}
        </Select>
        <Button isIconOnly onPress={toggleSortOrder}>
          {filters.sort.split(":")[1] === "asc" ? <MoveUpIcon /> : <MoveDownIcon />}
        </Button>
      </div>
    </div>
    )

};