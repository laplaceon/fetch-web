"use client"

import { User, login, logout, getBreeds } from "./api";

import { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import FilterPanel from "./components/FilterPanel";
import {Form, Input, Button, Slider} from "@heroui/react";


export default function Home() {
  const [user, setUser] = useState(null);
  const [breeds, setBreeds] = useState([]);
  const [filters, setFilters] = useState({
    breeds: [],
    zipCodes: [],
    minAge: 0,
    maxAge: 30,
    sort: "breed:asc",
    resultsPerPage: 10,
  });

  const handleLogin = async (name: string, email: string) => {
    const apiLoginResponse = await login(name, email);
    if (apiLoginResponse.status === 200) {
      const newUser: User = {"name": name, "email": email};
      setUser(newUser);

      // Get breeds
      const apiGetBreedsResponse = await getBreeds();
      if (apiGetBreedsResponse.status === 200) {
        setBreeds(await apiGetBreedsResponse.json());
        console.log(breeds);
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
            <FilterPanel breeds={breeds} minAge={0} maxAge={30} />
          </div>
        }
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        
      </footer>
    </div>
  );
}
