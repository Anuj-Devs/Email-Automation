"use client"

import useSWR, { mutate as globalMutate } from "swr"

const defaultSerializer = {
  parse: (s) => (s ? JSON.parse(s) : undefined),
  stringify: (v) => JSON.stringify(v),
}

export function useLocalSWR(key, initial, serializer = defaultSerializer) {
  const fetcher = () => {
    if (typeof window === "undefined") return initial
    const raw = window.localStorage.getItem(key)
    const value = serializer.parse(raw)
    return value === undefined ? initial : value
  }

  const { data, error, isLoading, mutate } = useSWR(key, fetcher, {
    fallbackData: initial,
  })

  const setValue = async (updater) => {
    const next = typeof updater === "function" ? updater(data) : updater
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, serializer.stringify(next))
    }
    await mutate(next, false)
    await globalMutate(key)
  }

  return { data, setValue, error, isLoading }
}

export function useAuth() {
  return useLocalSWR("auth", null)
}

export function useEmailContents() {
  return useLocalSWR("emailContents", [])
}

export function useEmailConfigs() {
  return useLocalSWR("emailConfigs", [])
}

export function useSentEmails() {
  return useLocalSWR("sentEmails", [])
}
