import React, { useState } from "react";
import CreatableSelect from 'react-select/creatable';
import {Slider, Form, Listbox, ListboxItem, Button, Select, SelectItem} from "@heroui/react";
import { MoveUpIcon, MoveDownIcon } from "lucide-react";

const ListboxWrapper = ({children}) => (
    <div className="w-[260px] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
      {children}
    </div>
  );
    

const FilterPanel = ({ breeds, filters, setFilters }) => {
    const updateBreedSelection = (selectedItems) => {
      setFilters({
        ...filters,
        breeds: new Set(selectedItems)
      });
    };

    const updateAgeRange = (value) => {
      setFilters({
        ...filters,
        minAge: value[0],
        maxAge: value[1],
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

    const sortCategories = [
      {key: "breed", label: "Breed"},
      {key: "name", label: "Name"},
      {key: "age", label: "Age"}
    ];

    return <Form>
                  <p>
                    
                  </p>
                <div className="flex gap-2 w-full">
                    <ListboxWrapper>
                        <h2>Breeds</h2>
                        <Listbox
                            className="max-h-60 overflow-y-auto"
                            items={breeds}
                            aria-label="Multiple selection example"
                            selectedKeys={filters.breeds}
                            selectionMode="multiple"
                            variant="flat"
                            onSelectionChange={updateBreedSelection}>
                                {(item) => (
                                    <ListboxItem key={item.label}>{item.label}</ListboxItem>
                                )}
                        </Listbox>
                    </ListboxWrapper>
                    {/* <p className="text-small text-default-500">Selected value: {selectedValue}</p> */}

                    <CreatableSelect 
                      isClearable 
                      isMulti 
                      components={{ DropdownIndicator: null }} 
                      placeholder="Enter a zipcode and press enter..."
                    />
                
                    <Slider
                        defaultValue={[filters.minAge, filters.maxAge]}
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
                    
                </div>

                
            </Form>;

};

export default FilterPanel;