import { useState } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { User } from "@/types";

import { login } from "@/api";

export const LoginForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleLogin = async (name: string, email: string) => {
        const apiLoginResponse = await login(name, email);
        if (apiLoginResponse.status === 200) {
          const newUser: User = {"name": name, "email": email};
          sessionStorage.setItem("user", JSON.stringify(newUser));
          location.reload()
        } else {
    
        }
    }

    const handleLoginFormSubmit = async (e) => {
        e.preventDefault();
        if (name.trim() !== "" && email.trim() !== "") {
            await handleLogin(name.trim(), email.trim())
        } else {

        }
    }

    return (
        <Form className="w-full max-w-xs" validationBehavior="native" onSubmit={handleLoginFormSubmit}>
            <Input
                isRequired
                errorMessage="Please enter your name"
                label="Name"
                labelPlacement="inside"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <Input
                isRequired
                errorMessage="Please enter a valid email"
                label="Email"
                labelPlacement="inside"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit">
                Log in
            </Button>
        </Form>
    );
};