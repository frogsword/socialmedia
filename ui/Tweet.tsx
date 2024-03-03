'use client'

import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button"
import {useState} from "react"
import { Heart } from "./assets/heart"
import { Comment } from "./assets/comment"
import { HeartFill } from "./assets/heart-fill"
import Image from "next/image"
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import styles from "../styles/tweet.module.css"

export default function Tweet(data: any) {
    const { data: session, status } = useSession()
    let tweet = data?.tweet
    let likedTweets = data?.likedTweets
    const [likeCount, setLikeCount] = useState(tweet.likeCount)
    const [liked, setLiked] = useState(likedTweets.includes(tweet.id))
    const [userLikedTweets, setUserLikedTweets] = useState(likedTweets)
    const [disabled, setDisabled] = useState(false)
    const router = useRouter()
    const tweetRoute = `/tweet/${tweet.id}`

    const handleLikeClick = async() => {
        if (!session) {
            return
        }
        
        setDisabled(true)
        setLiked(!liked)
        liked ? setLikeCount(tweet.likeCount -= 1) : setLikeCount(tweet.likeCount += 1)
        
            await fetch(`https://socialmedia-sigma-indol.vercel.app/api/tweet/${tweet.id}`, {
                method: 'PUT',
                body: JSON.stringify(userLikedTweets)
            })
            .then((res) => res.json())
            .then((res) => setUserLikedTweets(res))

        setDisabled(false)
    }

    const deleteTweet = async(id: any) => {
        if (!session) {
            return
        }

        await fetch(`https://socialmedia-sigma-indol.vercel.app/api/tweet/${id}`, {
            cache: 'no-store',
            method: 'DELETE',
        })

        router.replace("/")   
    }

    //format date
    let date = new Date(tweet.createdAt)
    let newDate = date.toString() 
    let newTime = newDate   
    newDate = newDate.slice(4, 16)
    newTime = newTime.slice(16, 21)

    return (
        <div className={styles.tweetMain} onClick={() => router.replace(tweetRoute)}>
            <div className={styles.imgContainer}>
                <Image onClick={() => router.replace(`/profile/${tweet.userId}`)}
                        className="h-10 w-10 rounded-full"
                        src={tweet.userPfp || 'https://avatar.vercel.sh/leerob'}
                        height={36}
                        width={36}
                        alt={`avatar`}
                />
            </div>

            <div className={styles.tweetContent}>

                <div className={styles.tweetTopRow}>
                    <div>
                        <b className={styles.profileRouteElement} onClick={() => router.replace(`/profile/${tweet?.userId}`)}>{tweet?.userName}</b>   
                        <span className={styles.tweetDate}> {newTime} · {newDate}</span>
                    </div>

                    <div>
                        {session?.user?.id === tweet?.userId && (
                        <Dropdown>
                            <DropdownTrigger>
                                <Button isIconOnly 
                                variant="light" 
                                >
                                <b>· · ·</b>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu 
                                aria-label="Action event example" 
                                onAction={(key) => deleteTweet(key)}
                            >
                                <DropdownItem key={tweet.id} className="text-danger" color="danger">
                                    Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        )}
                    </div>
                </div>

                <div className={styles.tweetBody}>
                    {tweet?.body}
                </div>
                
                <div className={styles.tweetBottomRow}>
                    {(session) && (
                        <div className={styles.like}>
                            <Button size="sm" isDisabled={disabled} isIconOnly aria-label="Like" onClick={() => handleLikeClick()}
                            >
                                {liked && (
                                    <HeartFill />
                                )}
                                {!liked && (
                                    <Heart />
                                )}
                            </Button>
                            <div>{tweet?.likeCount}</div>
                        </div>
                    )}
                    {(!session) && (
                        <div className={styles.like}> 
                            <Heart /> 
                            {tweet?.likeCount}
                        </div>
                    )}
      
                    <div className={styles.comment}>
                        <Comment />
                        <div>{tweet?.replyId}</div>
                    </div>
                </div>

            </div>
        </div>
    )
}