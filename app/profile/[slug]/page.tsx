import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Tweet from "../../../ui/Tweet"
import ProfileHeader from "../../../ui/ProfileHeader"
import { Input, Popover, PopoverTrigger, PopoverContent, Button} from "@nextui-org/react";
import { headers } from "next/headers"
// import { getAuthSession } from "../../api/auth/[...nextauth]/route"
import getAuthSession from "../../../utils/auth"
import { redirect } from 'next/navigation'
import styles from "../../../styles/profile.module.css"

const getProfile = async(slug) => {
    const res = await fetch(`http://localhost:3000/api/user/${slug}`, {
        cache: "no-store"
    })

    return res.json()
}

const getTweets = async(slug) => {
  const res = await fetch(`http://localhost:3000/api/user/${slug}/tweets`, {
    cache: 'no-store'
  })

  return res.json()
}

const getUserLikedTweets = async(slug) => {
  const res = await fetch(`http://localhost:3000/api/user/${slug}`, {
    cache: 'no-store'
  })

  const response = res.json()
  return response
}

export default async function Profile({ params }: any) {
    const { slug } = params
    const session = await getAuthSession()
    const profile = await getProfile(slug)
    const tweets = await getTweets(slug)
    const userProfile = await getUserLikedTweets(session?.user.id)
    const likedTweets = userProfile?.likedTweets || []
    const userIsFollowing = userProfile?.following.includes(profile.id)

    return (
      <main className={styles.main}>
        <ProfileHeader profile={profile} user={userProfile} userIsFollowing={userIsFollowing} />

        <div className="user-tweets">
        {tweets.map((tweet) => {
            if (!tweet.isDeleted) {
                return (
                    <Tweet key={tweet.id} tweet={tweet} likedTweets={likedTweets} />
                )
            }
          })}
        </div>
      </main>
    );
  }