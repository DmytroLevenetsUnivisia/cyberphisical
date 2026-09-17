"use client";

import {FormEvent, useState} from "react";

export default function Login() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitted(true);
    }

    return (
        <main className="mx-auto mt-16 w-full max-w-sm px-4">
            <div className="mb-4 flex gap-2">
                <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 rounded border p-2 ${
                        isSignUp ? "bg-cyan-700 text-white" : "bg-gray-200 text-black"
                    }`}
                >
                    Log in
                </button>
                <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 rounded border p-2 ${
                        !isSignUp ? "bg-cyan-700 text-white" : "bg-gray-200 text-black"
                    }`}
                >
                    Sign up
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                {isSignUp && (
                    <input
                        required
                        name="name"
                        placeholder="Name"
                        className="w-full rounded border p-2"
                    />
                )}
                <input
                    required
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full rounded border p-2"
                />
                <input
                    required
                    minLength={6}
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full rounded border p-2"
                />
                {isSignUp && (
                    <input
                        required
                        minLength={6}
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        className="w-full rounded border p-2"
                    />
                )}
                <button
                    type="submit"
                    className="w-full rounded bg-cyan-700 p-2 text-white"
                >
                    {isSignUp ? "Create account" : "Log in"}
                </button>
                {submitted && (
                    <p className="text-center text-sm text-green-600">
                        Demo submitted
                    </p>
                )}
            </form>
        </main>
    );
}
