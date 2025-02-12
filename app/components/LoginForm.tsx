import React, { useState } from "react";
import {Button, Form, Input} from "@heroui/react";

const LoginForm = ({ handleLogin }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleLoginFormSubmit = (e) => {
        e.preventDefault();
        if (name.trim() !== "" && email.trim() !== "") {
            handleLogin(name.trim(), email.trim())
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

export default LoginForm;