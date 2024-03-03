import Tweet from "../../../ui/Tweet"
import ReplyForm from "../../../ui/ReplyForm"
import {Button, Textarea} from "@nextui-org/react";
// import { getAuthSession } from "../../api/auth/[...nextauth]/route"
import getAuthSession from "../../../utils/auth"
import styles from "../../../styles/tweetPage.module.css"

const getTweets = async(slug) => {
  const res = await fetch(`http://localhost:3000/api/tweet/${slug}`, {
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

export default async function Profile({ params }) {
    const { slug } = params
    const session = await getAuthSession()
    const tweets = await getTweets(slug)
    const parents = tweets.parents
    const tweet = tweets.tweet
    const children = tweets.children
    const userProfile = await getUserLikedTweets(session?.user.id)
    const likedTweets = userProfile?.likedTweets || []

    return (
      <main className={styles.main}>

        <div className={styles.parentTweets}>
          {parents.map((tweet) => {
            if (!tweet.isDeleted) {
                return (
                  <div>
                    <Tweet key={tweet.id} tweet={tweet} likedTweets={likedTweets} />
                  </div>
                )
            }
          })} 
        </div>

        <div className={styles.mainTweet}>
          <Tweet key={tweet.id} tweet={tweet} likedTweets={likedTweets} />
        </div>

        {session && (
            <ReplyForm username={userProfile?.username} parentTweetId={tweet.id} />
        )}

        <div className={styles.replies}>
        {children.map((tweet) => {
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