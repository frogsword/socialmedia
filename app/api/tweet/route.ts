import prisma from "../../../utils/connect"
import { getAuthSession } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"

//make tweet - home page
export const POST = async(req) => {
    const session = await getAuthSession()
    const request = await req.json()

    if (!session) {
        return new NextResponse(
            JSON.stringify({ status: 401 })
        )
    }

    try {
        const tweetBody = request.body
        const username = request.username

        const tweet = await prisma.tweet.create({
            data: {
                body: tweetBody, 
                userId: session.user.id,
                userPfp: session.user.image,
                userName: username || session.user.name,
                parentId: []
            }
        })

        return new NextResponse(
            JSON.stringify(tweet.id, {status: 200})
        )
    }
    catch (err) {
        return new NextResponse(
            JSON.stringify({ status: 500 })
        )
    }
}

//get all parent tweets - home page
export const GET = async() => {
    try {
        const userTweets = await prisma.tweet.findMany({
            where: {
                parentId: {
                    isEmpty: true
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        
        return new NextResponse(
            JSON.stringify(userTweets, { status: 200 })
        )
    } 
    catch(err) {}
}