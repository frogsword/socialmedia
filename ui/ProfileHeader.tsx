'use client'

import { Input, Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import Image from "next/image"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react"
import styles from "../styles/profile.module.css"
import { FormEvent } from "react";

export default function ProfileHeader(data) {
    const { data: session, status } = useSession()
    const profile = data.profile
    const userProfile = data.user

    const isFollowing = data.userIsFollowing
    const [userIsFollowing, setUserIsFollowing] = useState(isFollowing)
    
    let profileFollowerCount = profile.followers.length
    const [followerCount, setFollowerCount] = useState(profileFollowerCount)

    let followers = profile.followers
    let following = userProfile?.following

    let profUsername = profile.username
    const [username, setUsername] = useState(profUsername)

    const [disabled, setDisabled] = useState(false)

    const [input, setInput] = useState("")

    const handleFollowClick = async() => {
        followers.push(userProfile.id)
        following.push(profile.id)

        setUserIsFollowing(true)
        setFollowerCount(profileFollowerCount += 1)
        updateFollowers(following, followers, session?.user.id)
    }
      
    const handleUnfollowClick = () => {
        const i = followers.indexOf(userProfile.id)
        const j = following.indexOf(profile.id)
      
        followers.splice(i, 1)
        following.splice(j, 1)

        setUserIsFollowing(false)
        setFollowerCount(profileFollowerCount -= 1)
        updateFollowers(following, followers, session?.user.id)
    }
      
    const updateFollowers = async(following, followers, slug) => {  
        const res = await fetch(`http://localhost:3000/api/user/${slug}`, {
          body: JSON.stringify({
            following: following, 
            followers: followers,
            profileId: profile.id,
          }),
          method: "PUT",
        })
    }


    const updateUsername = async(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!input) {
            return
        }

        setDisabled(true)
        setUsername(input)
        const newUsername = input
        setInput("")
      
        const res = await fetch(`http://localhost:3000/api/user/${session.user.id}`, {
          body: JSON.stringify(newUsername),
          method: "POST",
        }) 

        setDisabled(false)
    }

    //format date
    let date = new Date(profile.createdAt)
    let newDate = date.toString() 
    newDate = newDate.slice(4, 16)

    return (
        <div className={styles.profileHeader}>

            <div className={styles.profileTopRow}>
                <Image
                    className="h-50 w-50 rounded-full"
                    src={profile.image || 'https://avatar.vercel.sh/leerob'}
                    height={100}
                    width={100}
                    alt={`avatar`}
                />

                <div>
                    {((!userIsFollowing) && (session) && (session?.user.id != profile?.id)) && (
                    <Button color="primary" variant="solid" onClick={() => handleFollowClick()}>
                            Follow
                    </Button>
                    )}

                    {((userIsFollowing) && (session) && (session?.user.id != profile?.id)) && (
                    <Button color="danger" variant="bordered" onClick={() => handleUnfollowClick()}>
                            Unfollow
                    </Button>
                    )}

                    {session?.user.id === profile.id && (
                        <Popover key={"danger"} placement="top" color={"danger"}>
                            <PopoverTrigger>
                                <Button color={"danger"} className="capitalize">
                                    Edit Username
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <form onSubmit={updateUsername}>
                                        <Input
                                            key="danger"
                                            name="username"
                                            type="text"
                                            color="danger"
                                            placeholder="Enter New Username"
                                            className="max-w-[220px]"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                        />
                                        <Button color="primary" type="submit" isDisabled={disabled}>
                                            Submit
                                        </Button>
                                </form>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>

            <div className={styles.profileMiddleRow}>
                <h2 className={styles.username}><b>{username || profile.name}</b></h2>
            </div>

            <div className={styles.profileBottomRow}>
                <span><b>{followerCount}</b> <span className={styles.followInfoText}>Followers</span></span>
                <span><b>{profile.following.length}</b> <span className={styles.followInfoText}>Following</span></span>
                <span className={styles.date}>Joined {newDate}</span>
            </div>

            

        </div>
    )
}