import { FormEvent, useState } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Alert } from "@heroui/alert";

import { User } from "@/types";

import { login } from "@/api";

import { z } from "zod";


const loginSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email format"),
})

export const LoginForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<Array<string>>([]);

    const handleLogin = async (name: string, email: string) => {
        const apiLoginResponse = await login(name, email);
        if (apiLoginResponse.status === 200) {
          const newUser: User = {"name": name, "email": email};
          sessionStorage.setItem("user", JSON.stringify(newUser));
          location.reload()
        } else {
    
        }
    }

    const handleLoginFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const validationResult = loginSchema.safeParse({ name, email });

        if (validationResult.success) {
            await handleLogin(name, email)
        } else {
            const newErrors: Array<string> = [];
            validationResult.error.errors.forEach((err) => {
                newErrors.push(err.message);
            });

            setErrors(newErrors);
        }
    }

    return (
        <Form className="mt-16 w-full max-w-xs" validationBehavior="native" onSubmit={handleLoginFormSubmit}>
            {errors.length > 0 && <Alert color="danger" title={errors.join("\n")} />}
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