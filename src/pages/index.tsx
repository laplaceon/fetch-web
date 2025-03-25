import DefaultLayout from "@/layouts/default";

import { getDogsByQuery, getDogsByIds, isLoggedIn } from "@/api";
import { FilterPanel } from "@/components/FilterPanel";
import { LoginForm } from "@/components/LoginForm";
import { Button } from "@heroui/button";
import { DogCard } from "@/components/DogCard";
import { Pagination } from "@heroui/pagination";

import { useState, useEffect } from "react";

export default function IndexPage() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [filters, setFilters] = useState({
    breeds: new Set([]),
    zipCodes: [],
    ageMin: 0,
    ageMax: 30,
    sort: "breed:asc",
  });
  const [dogs, setDogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [resultsPerPage, setResultsPerPage] = useState(25);
  const [favorites, setFavorites] = useState(new Set([]));

  useEffect(() => {
    const result = isLoggedIn();
    if (result?.email) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
  }, [])

  const updateSearchResults = async (updateTotal: boolean = true) => {
    const result = await getDogsByQuery(resultsPerPage, filters.sort, (currentPage - 1) * resultsPerPage, [...filters.breeds], filters.zipCodes, filters.ageMin, filters.ageMax);
    const responseBody = await result.json();
    const dogs = await getDogsByIds(responseBody.resultIds);
    setDogs(await dogs.json());
    if (updateTotal) {
      setTotalPages(Math.ceil(responseBody.total / resultsPerPage));
    }
  }

  const toggleFavorite = (id: string) => {
    const newFavorites = new Set(favorites);
    if (favorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }

    setFavorites(newFavorites);
  };

  const updateCurrentPage = async (page: number) => {
    setCurrentPage(page);
    await updateSearchResults(false);
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 pb-8 md:pb-10">
        {!userLoggedIn ? (
          <LoginForm />
        ) : (
          <div className="w-full max-w-5xl">
            <div className="w-full p-6 shadow-md mb-6">
              <FilterPanel filters={filters} setFilters={setFilters} />
              <div className="flex justify-end mt-4">
                <Button onPress={updateSearchResults}>Search</Button>
              </div>
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
    </DefaultLayout>
  );
}
