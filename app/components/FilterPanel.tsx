import React, { useEffect, useState } from "react";
import CreatableSelect from 'react-select/creatable';
import {Slider, Button, Select, SelectItem, Input} from "@heroui/react";
import { MoveUpIcon, MoveDownIcon } from "lucide-react";

import { getBreeds, getLocationsByZipcodes, getLocationsByQuery } from "../api";

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
      <div className="flex gap-2 w-full">
          <Select
            className="max-w-xs"
            label="Breeds"
            placeholder="Select breeds to filter results by"
            selectionMode="multiple"
            showScrollIndicators
            onSelectionChange={updateBreedSelection}>
              {breeds.map((breed) => (
                <SelectItem key={breed.key}>{breed.label}</SelectItem>
              ))}
          </Select>

          <CreatableSelect 
            isClearable 
            isMulti 
            components={{ DropdownIndicator: null }} 
            placeholder="Enter a zipcode and press enter..."
          />
      
          <Slider
              defaultValue={[filters.ageMin, filters.ageMax]}
              label="Age Range"
              maxValue={30}
              minValue={0}
              step={1}
              onChangeEnd={updateAgeRange}
          />

          <Select 
              defaultSelectedKeys={["breed"]}
              onSelectionChange={updateSortCategory}
          >
            {sortCategories.map((sortCategory) => (
              <SelectItem key={sortCategory.key}>{sortCategory.label}</SelectItem>
            ))}
          </Select>

          <Button isIconOnly onPress={toggleSortOrder}>
              {filters.sort.split(":")[1] === "asc" ? <MoveUpIcon /> : <MoveDownIcon />}
          </Button>

          <Input label="City" placeholder="City Name" type="city_name" onValue={searchByCityName} />

          <Select
            className="max-w-xs"
            label="US States"
            placeholder="Select states to filter results by"
            selectionMode="multiple"
            showScrollIndicators
            onSelectionChange={searchByState}>
              {stateOptions.map((stateOption) => (
                <SelectItem key={stateOption}>{stateOption}</SelectItem>
              ))}
          </Select>
      </div>
    )

};