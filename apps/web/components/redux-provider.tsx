"use client";

import type React from "react";

import { getProfile } from "@/lib/redux/slices/authSlice";
import { store } from "@/lib/redux/store";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { SocketProvider } from "./socket-provider";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		// Check if user is logged in
		const token = localStorage.getItem("token");
		if (token) {
			store.dispatch(getProfile());
		}
	}, []);

	return (
		<Provider store={store}>
			<SocketProvider>{children}</SocketProvider>
		</Provider>
	);
}
