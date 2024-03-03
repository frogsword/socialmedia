'use client'

import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useSession } from "next-auth/react";
import { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from 'next/navigation'
import styles from "../styles/home.module.css"

export default function ReplyForm(data: any) {
    const session = useSession()
    const router = useRouter()
    const username = data?.username
    const id = data?.parentTweetId

    const [tweet, setTweet] = useState("")
    const [disabled, setDisabled] = useState(false)

    async function createTweet(event: FormEvent<HTMLFormElement>) {   
        event.preventDefault   
        if (!tweet || !session) {
          return
        }

        const userTweet = tweet
        setDisabled(true)
        setTweet("")

        const res = await fetch(`https://socialmedia-sigma-indol.vercel.app/api/tweet/${id}`, {
          body: JSON.stringify({
            body: userTweet,
            username: username
          }),
          method: "POST",
        })
        
        router.replace("/")   

        setDisabled(false)
    }

    return (
        <div>
        {session && (
            <form onSubmit={createTweet} className={styles.form}>
              <Textarea
                name="body"
                size="lg"
                key='underlined'
                variant='underlined'
                labelPlacement="outside"
                placeholder="Write A Reply..."
                className="col-span-12 md:col-span-6 mb-6 md:mb-0"
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
                required
              />
              <Button className={styles.formBtn} color="primary" variant="ghost" type="submit" isDisabled={disabled}>
              Reply
              </Button> 
            </form>
        )}
        </div>
    )
}