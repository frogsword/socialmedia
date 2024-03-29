import prisma from "../../../../../utils/connect"
// import { getAuthSession } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"

//get all tweets from user - profile page
export const GET = async(req: Request, { params }: any) => {
    const { slug } = params
    try {
        const tweets = await prisma.tweet.findMany({
            where: {
                userId: {
                    equals: slug
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        
        return new NextResponse(
            JSON.stringify(tweets)
        )
    } 
    catch(err) {}
}