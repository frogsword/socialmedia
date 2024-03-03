import { getAuthSession } from "./api/auth/[...nextauth]/route"
import Tweet from "../ui/Tweet"
import PostForm from "../ui/PostForm"
import styles from "../styles/home.module.css"

const getTweets = async() => {
  const res = await fetch(`http://localhost:3000/api/tweet`, {
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

export default async function Home() {
  const session = await getAuthSession()
  const tweets = await getTweets()
  const userProfile = await getUserLikedTweets(session?.user.id)
  const likedTweets = userProfile?.likedTweets || []

  
  return (
    <main className={styles.main}>
      {session && (
        <PostForm username={userProfile?.username} />
      )}

      {/* <Timeline /> */}
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
