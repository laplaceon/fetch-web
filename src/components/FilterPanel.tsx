import { useEffect, useState } from "react";

import { MoveUpIcon, MoveDownIcon, XIcon, PlusIcon } from "lucide-react";

import { Select, SelectItem } from "@heroui/select";
import { Slider } from "@heroui/slider";
import { Button } from "@heroui/button";
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem } from "@heroui/dropdown"
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";

import { getBreeds, getLocationsByCityAndState } from "@/api";

import { LocationAggregate } from "@/types";

interface FilterPanelProps {
  onFiltersUpdate: (filters: {
    breeds: string[],
    zipCodes: string[],
    ageMin: number,
    ageMax: number,
    sort: string
  }) => void;
}

export const FilterPanel = ({ onFiltersUpdate }: FilterPanelProps) => {
    const sortCategories = [
      {key: "breed", label: "Breed"},
      {key: "name", label: "Name"},
      {key: "age", label: "Age"}
    ];
    
    const [breeds, setBreeds] = useState<string[]>([]);

    const [selectedBreeds, setSelectedBreeds] = useState<Set<string>>(new Set());
    const [ageRange, setAgeRange] = useState([0, 30])

    const [sortCategory, setSortCategory] = useState("breed");
    const [sortDirection, setSortDirection] = useState(true); // true = asc, false = desc

    const stateOptions = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

    const [locations, setLocations] = useState<Map<string, LocationAggregate>>(new Map());
    const [locationResults, setLocationResults] = useState<Map<string, LocationAggregate>>(new Map());

    const [cityQuery, setCityQuery] = useState("");
    const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Get breeds
        if (breeds.length === 0) {
          (async () => {
            const apiGetBreedsResponse = await getBreeds();
            if (apiGetBreedsResponse.status === 200) {
              setBreeds((await apiGetBreedsResponse.json()));
            }
          })()
        }
    })

    useEffect(() => {
      onFiltersUpdate({
        breeds: [...selectedBreeds],
        zipCodes: [...locations.values()].flatMap(location => location.zip_codes),
        ageMin: ageRange[0],
        ageMax: ageRange[1],
        sort: `${sortCategory}:${sortDirection ? "asc" : "desc"}`
      });
    }, [selectedBreeds, locations, ageRange, sortCategory, sortDirection]);

    useEffect(() => {
        fetchLocations();
    }, [cityQuery, selectedStates])

    const fetchLocations = async () => {
        if (!cityQuery && selectedStates.size === 0 && locationResults.size === 0) return;
        const response = await getLocationsByCityAndState(cityQuery, Array.from(selectedStates));
        if (response.status === 200) {
            const body = await response.json();
            const newLocationResults: Map<string, LocationAggregate> = new Map();
            for (let i = 1; i < body.results.length; i++) {
                const key = body.results[i].city + ", " + body.results[i].state;
                if (!newLocationResults.has(key)) {
                    newLocationResults.set(key, {
                        name: key,
                        zip_codes: [body.results[i].zip_code]
                    })
                } else {
                    newLocationResults.get(key)!.zip_codes.push(body.results[i].zip_code);
                }
            }
            setLocationResults(newLocationResults);
            
        }
      };
  
      const toggleLocationSelection = (locationResult: LocationAggregate) => {
        const newLocations = new Map(locations);
        if (locations.has(locationResult.name)) {
            newLocations.delete(locationResult.name);
        } else {
            newLocations.set(locationResult.name, locationResult);
        }
        setLocations(newLocations);
      };

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
            onSelectionChange={async (selectedItems) => {setSelectedBreeds(new Set([...selectedItems].map(String)))}}
          >
            {breeds.map((breed) => (
              <SelectItem key={breed}>{breed}</SelectItem>
            ))}
          </Select>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Age Range</h3>
          <Slider
            defaultValue={ageRange}
            label="Select age range"
            maxValue={30}
            minValue={0}
            step={1}
            onChangeEnd={(value) => {setAgeRange(Array.isArray(value) ? value : [value, value])}}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <Input label="City" placeholder="Enter city name" onValueChange={setCityQuery} />
            </div>

            <div className="flex items-end gap-4">
            <Select 
              className="w-1/2" 
              label="State" 
              placeholder="Select states..." 
              selectionMode="multiple" 
              showScrollIndicators
              onSelectionChange={(selectedItems) => {setSelectedStates(new Set([...selectedItems].map(String)))}}
            >
                {stateOptions.map((state) => (
                <SelectItem key={state}>{state}</SelectItem>
                ))}
            </Select>

            <Dropdown>
              <DropdownTrigger>
                <Button color="primary" variant="solid" className="p-6">{locationResults.size} results available</Button>
              </DropdownTrigger>
              <DropdownMenu classNames={{list: "grid grid-cols-3 w-[400px] gap-3 text-center"}}
                itemClasses={{
                    base: "gap-4"
                }} aria-label="Dynamic Actions" items={Array.from(locationResults.values())}>
                {(location) => (
                  <DropdownItem
                    key={location.name}
                    className="gap-3 "
                    onPress={() => toggleLocationSelection(location)}
                    startContent={locations.has(location.name) ? <XIcon className="text-red-50" /> : <PlusIcon  className="text-green-50" />}
                  >
                    <span>{location.name}</span>
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>

          
            {/* <CreatableSelect
                className="w-1/2"
                isClearable
                isMulti
                components={{ DropdownIndicator: null }}
                placeholder="Enter a zip code..."
            /> */}
            </div>
        </div>



        <div className="flex gap-2">
            <h3 className="text-lg font-semibold mb-2">Selected Locations</h3>
            {Array.from(locations.values()).map((location) => (
              <Chip key={location.name} size="lg" onClose={() => toggleLocationSelection(location)}>
                  {location.name}
                </Chip>
            ))}
        </div>
        

        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Sort by:</h3>
          <Select defaultSelectedKeys={[sortCategory]} onSelectionChange={(selectedItems) => {
            if (selectedItems.currentKey !== undefined) {
              setSortCategory(selectedItems.currentKey)}
            }
          }>
            {sortCategories.map((sortCategory) => (
              <SelectItem key={sortCategory.key}>{sortCategory.label}</SelectItem>
            ))}
          </Select>
          <Button isIconOnly onPress={() => {setSortDirection(!sortDirection);}}>
            {sortDirection ? <MoveUpIcon /> : <MoveDownIcon />}
          </Button>
        </div>
      </div>
    )

};