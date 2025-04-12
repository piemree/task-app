"use client"

import type React from "react"

import { store } from "@/lib/redux/store"
import { Provider } from "react-redux"
import { useEffect } from "react"
import { getProfile } from "@/lib/redux/slices/authSlice"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (token) {
      store.dispatch(getProfile())
    }
  }, [])

  return <Provider store={store}>{children}</Provider>
}
