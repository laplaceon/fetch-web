import DefaultLayout from "@/layouts/default";

import { getDogsByQuery, getDogsByIds, isLoggedIn, getMatchFromDogs } from "@/api";
import { FilterPanel } from "@/components/FilterPanel";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@heroui/button";
import { DogCard } from "@/components/DogCard";
import { Pagination } from "@heroui/pagination";
import { MatchDialog } from "@/components/MatchDialog";
import { useDisclosure } from "@heroui/modal";

import { StarIcon } from "lucide-react";

import { useState, useEffect } from "react";
import { Dog, Match } from "@/types";

interface Filters {
  breeds: string[];
  zipCodes: string[];
  ageMin: number;
  ageMax: number;
  sort: string;
}

export default function IndexPage() {
  const resultsPerPage = 25;
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    breeds: [],
    zipCodes: [],
    ageMin: 0,
    ageMax: 30,
    sort: "breed:asc",
  });
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState<Map<string, Dog>>(new Map());
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);

  useEffect(() => {
    const result = isLoggedIn();
    if (result?.email) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
  }, [])

  const updateSearchResults = async (breeds: string[], zipCodes: string[], ageMin: number, ageMax: number, sort: string) => {
    const result = await getDogsByQuery(resultsPerPage, sort, 0, [...breeds], zipCodes, ageMin, ageMax);
    const responseBody = await result.json();
    const dogs = await getDogsByIds(responseBody.resultIds);
    setDogs(await dogs.json());
    setTotalPages(Math.ceil(responseBody.total / resultsPerPage));
  }

  const updateCurrentPage = async (page: number) => {
    const result = await getDogsByQuery(resultsPerPage, filters.sort, (page - 1) * resultsPerPage, [...filters.breeds], filters.zipCodes, filters.ageMin, filters.ageMax);
    const responseBody = await result.json();
    const dogs = await getDogsByIds(responseBody.resultIds);
    setDogs(await dogs.json());
  }

  const updateFilters = async ({
    breeds,
    zipCodes,
    ageMin,
    ageMax,
    sort
  }: Filters) => {
    setFilters({
      breeds: breeds,
      zipCodes: zipCodes,
      ageMin: ageMin,
      ageMax: ageMax,
      sort: sort
    })
    await updateSearchResults(breeds, zipCodes, ageMin, ageMax, sort);
    
  }

  const toggleFavorite = (dog: Dog) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Map(prevFavorites);
      
      if (newFavorites.has(dog.id)) {
        newFavorites.delete(dog.id);
      } else {
        newFavorites.set(dog.id, dog);
      }

      return newFavorites;
    });
  };

  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const handleMatch = async () => {
    const response = await getMatchFromDogs(Array.from(favorites.keys()));
    if (response.status === 200) {
      const match: Match = await response.json();
      if (favorites.has(match.match)) {
        const matchedFavorite = favorites.get(match.match);
        setMatchedDog(matchedFavorite!);
      }
      onOpen();
    }
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 pb-8 md:pb-10">
        {!userLoggedIn ? (
          <LoginForm />
        ) : (
          <div className="w-full max-w-5xl">
            <div className="w-full p-6 shadow-md mb-6">
              <FilterPanel onFiltersUpdate={updateFilters} />
            </div>

            {dogs.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dogs.map((dog) => (
                    <DogCard
                      key={dog.id}
                      dog={dog}
                      isFavorite={favorites.has(dog.id)}
                      toggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>

                <div className="flex justify-center mt-8">
                  <Pagination showControls initialPage={1} total={totalPages} onChange={updateCurrentPage} />
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 mt-6">No results found. Try adjusting the filters.</p>
            )}
          </div>
        )}
      </section>
      {(favorites.size > 0) && <Button radius="lg" size="lg" startContent={<StarIcon />} className="fixed bottom-10 right-10" onPress={handleMatch}>Get matched</Button>}
      {(matchedDog !== null) && <MatchDialog dog={matchedDog} isOpen={isOpen} onOpenChange={onOpenChange} />}
      
    </DefaultLayout>
  );
}
