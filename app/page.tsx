"use client"

import { User, login, logout, getBreeds } from "./api";

import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import FilterPanel from "./components/FilterPanel";
import {Button, Pagination} from "@heroui/react";

import DogCard from "./components/DogCard";
import { getDogsByQuery, getDogsByIds } from "./api";


export default function Home() {
  const [user, setUser] = useState(null);
  const [breeds, setBreeds] = useState([]);
  const [filters, setFilters] = useState({
    breeds: new Set([]),
    zipCodes: [],
    minAge: 0,
    maxAge: 30,
    sort: "breed:asc",
    resultsPerPage: 10,
  });
  const [dogs, setDogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [resultsPerPage, setResultsPerPage] = useState(25);

  const updateSearchResults = async () => {
    const result = await getDogsByQuery(resultsPerPage, filters.sort, (currentPage - 1) * resultsPerPage, [...filters.breeds]);
    const responseBody = await result.json();
    const dogs = await getDogsByIds(responseBody.resultIds);
    setDogs(await dogs.json());
  }

  const updateCurrentPage = async (page: number) => {
    setCurrentPage(page);
    await updateSearchResults();
  }

  const handleLogin = async (name: string, email: string) => {
    const apiLoginResponse = await login(name, email);
    if (apiLoginResponse.status === 200) {
      const newUser: User = {"name": name, "email": email};
      setUser(newUser);

      // Get breeds
      const apiGetBreedsResponse = await getBreeds();
      if (apiGetBreedsResponse.status === 200) {
        setBreeds((await apiGetBreedsResponse.json()).map(x => ({
          key: x,
          label: x
        })));
      }
    } else {

    }
  };

  const handleLogout = async () => {
    logout();
    setUser(null);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {!user ? <LoginForm handleLogin={handleLogin} /> :
          <div>
            <Button onPress={handleLogout}>
              Log out
            </Button>
            <FilterPanel breeds={breeds} filters={filters} setFilters={setFilters} />
            <Button onPress={updateSearchResults}>Search</Button>
            {dogs.length > 0 && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dogs.map((dog) => (
                  <DogCard key={dog.id} dog={dog} />
                ))}
              </div>
            )}
            <Pagination showControls initialPage={1} total={totalPages} onChange={updateCurrentPage} />
          </div>
        }
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
