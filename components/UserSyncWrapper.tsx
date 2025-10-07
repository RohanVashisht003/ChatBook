"use client"

import { createToken } from "@/actions/createToken"
import { api } from "@/convex/_generated/api"
import streamClient from "@/lib/stream"
import { useUser } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import NextTopLoader from "nextjs-toploader"
import { useCallback, useEffect, useRef, useState } from "react"




const UserSyncWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded: isUserLoaded } = useUser()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const createOrUpdateUser = useMutation(api.users.upsertUser)




  const userSync = useCallback((async () => {

    if (!user?.id) {
      return
    }
    try {
      setIsLoading(true)
      setError(null)

      const tokenProvider = async () => {
        if (!user?.id) {
          throw new Error("User is not auhenticated")
        }
        const token = await createToken(user.id)
        return token
      }

      await createOrUpdateUser(
        {
          userId: user.id,
          name: user.fullName || user.firstName || user.emailAddresses[0].emailAddress || "Unknown User",
          email: user.emailAddresses[0].emailAddress || "",
          imageUrl: user.imageUrl || "",
        }
      )
      // Avoid reconnecting the same user repeatedly
      if ((streamClient as any).userID === user.id) {
        return
      }
      await streamClient.connectUser({
        id: user.id,
        name:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0]?.emailAddress || "Unknown User",
        image: user.imageUrl || "",
      }, tokenProvider)
    }
    catch (error) {
      setError(error instanceof Error ? error.message : "Failed to sync")
    }
    finally {
      setIsLoading(false)
    }
  }), [user, createOrUpdateUser])

  const disconnectUser = useCallback(async () => {
    try {
      await streamClient.disconnectUser()
    }
    catch (err) {
      console.log("Failed to disconnect user")
    }
  }, [])

  useEffect(() => {
    if (!isUserLoaded) {
      return
    }
    if (user) {
      userSync()
    }
    else {
      disconnectUser()
      setIsLoading(false)
    }
  }, [isUserLoaded, user, userSync, disconnectUser])

  if (!isUserLoaded || isLoading) {
    return (
      <NextTopLoader />
    )
  }
  if (error) {
    return (
      <div>
        <p>Sync Error</p>
        <p>{error}</p>
        <p>Please try restarting the app</p>

      </div>
    )
  }
  return (
    <>{children}</>
  )
}

export default UserSyncWrapper