import prisma from "../../../../utils/connect"
import { getAuthSession } from "../../auth/[...nextauth]/route"
import { NextResponse } from "next/server"

//get specific tweet - tweet page
export const GET = async(req, { params }) => {
    const { slug } = params

        try {
            const tweet = await prisma.tweet.findUnique({
                where: {
                    id: slug
                },
            })
    
            const parents = await prisma.tweet.findMany({
                where: {
                    id: {
                        in: tweet.parentId
                    }
                }
            })
    
            const replies = await prisma.tweet.findMany({
                where: {
                    parentId: {
                        has: tweet.id
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
            let children = []
            if (replies.length > 0) {
                replies.forEach((e) => {
                    if (e.parentId[0] == slug) {
                        children.push(e)
                    }
                });
            }
            return new NextResponse(
                JSON.stringify({parents, tweet, children})
            )
        } 
        catch(err) {}
}

//delete tweet
export const DELETE = async(req, { params }) => {
    const { slug } = params

    const session = await getAuthSession()

    if (!session) {
        return new NextResponse(
            JSON.stringify({ status: 401 })
        )
    }

    try {
        await prisma.tweet.update({
            where: {
                id: slug
            },
            data: {
                isDeleted: true
            }
        })

        return new NextResponse(
            JSON.stringify({ status: 200 })
        )
    }
    catch (err) {
        return new NextResponse(
            JSON.stringify({ status: 500 })
        )
    }

}

//make reply to tweet
export const POST = async(req, { params }) => {
    const { slug } = params
    const request = await req.json()
    const session = await getAuthSession()

    if (!session) {
        return new NextResponse(
            JSON.stringify({ status: 401 })
        )
    }

    try {
        const tweetBody = request.body
        const username = request.username

        //get parent tweet for parentId array
        const parentTweet = await prisma.tweet.findUnique({
            where: {
                id: slug
            },
            select: {
                parentId: true
            }
        })
        const parentTweetList = parentTweet.parentId

        //make tweet
        const tweet = await prisma.tweet.create({
            data: {
                body: tweetBody, 
                userId: session.user.id,
                userPfp: session.user.image,
                userName: username || session.user.name,
                parentId: [slug, ...parentTweetList]
            }
        })

        //add tweet to parentTweet replies
        await prisma.tweet.update({
            where: {
                id: slug
            },
            data: {
                replyId: {
                    increment: 1
                }
            }
        })

        return new NextResponse(
            JSON.stringify({status: 200})
        )
    }
    catch (err) {
        return new NextResponse(
            JSON.stringify({ status: 500 })
        )
    }
}

//update likes
export const PUT = async(req, { params }) => {
    const { slug } = params
    const session = await getAuthSession()
    let likedTweets = await req.json()

    if (!session) {
        return new NextResponse(
            JSON.stringify({ status: 403 })
        )
    }

    //if slug not in user likedtweets, like tweet
    if (!likedTweets.includes(slug)) {
        try {
            await prisma.tweet.update({
                where: {
                    id: slug
                },
                data: {
                    likeCount: {
                        increment: 1
                    }
                }
            })
    
            const user = await prisma.user.update({
                where: {
                    id: session?.user.id
                },
                data: {
                    likedTweets: {
                        push: slug
                    }
                }
            })
    
            return new NextResponse(
                JSON.stringify(user.likedTweets, { status: 200 })
            )
        }
        catch(err) {
            return new NextResponse(
                JSON.stringify({ status: 500 })
            )
        }
    }

    //if slug is in user likedtweets, unlike tweet
    if (likedTweets.includes(slug)) {
        const index = likedTweets.indexOf(slug)
        likedTweets.splice(index, 1)

        try {
            await prisma.tweet.update({
                where: {
                    id: slug
                },
                data: {
                    likeCount: {
                        increment: -1
                    }
                }
            })
    
            const user = await prisma.user.update({
                where: {
                    id: session?.user.id
                },
                data: {
                    likedTweets: {
                        set: likedTweets
                    }
                }
            })
    
            return new NextResponse(
                JSON.stringify(user.likedTweets, { status: 200 })
            )
        }
        catch(err) {
            return new NextResponse(
                JSON.stringify(user.likedTweets, { status: 500 })
            )
        }
    }
}
