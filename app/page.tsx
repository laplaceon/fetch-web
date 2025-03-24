"use client"

import { login, logout, getDogsByQuery, getDogsByIds } from "@/app/api";
import { User } from "@/app/types"; 

import { useState, useEffect } from "react";

import { Button, Pagination } from "@heroui/react";

import { NavHeader } from "@/app/components/NavHeader";
import { LoginForm } from "@/app/components/LoginForm";
import { FilterPanel } from "@/app/components/FilterPanel";
import { DogCard } from "@/app/components/DogCard";

export default function Home() {
  const [user, setUser] = useState(null);
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

  const handleLogin = async (name: string, email: string) => {
    const apiLoginResponse = await login(name, email);
    if (apiLoginResponse.status === 200) {
      const newUser: User = {"name": name, "email": email};
      setUser(newUser);
    } else {

    }
  };

  const handleLogout = async () => {
    logout();
    setUser(null);
  };

  return (
    <div>
      <NavHeader user={user} handleLogout={handleLogout} />
      
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {!user ? <LoginForm handleLogin={handleLogin} /> :
          <div>
            <FilterPanel filters={filters} setFilters={setFilters} />
            <Button onPress={updateSearchResults}>Search</Button>
            {dogs.length > 0 && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {dogs.map((dog) => (
                  <DogCard key={dog.id} dog={dog} isFavorite={favorites.has(dog.id)} toggleFavorite={toggleFavorite} />
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
    </div>
    
  );
}
