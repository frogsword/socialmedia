import { NextResponse } from "next/server";
import prisma from "../../../../utils/connect"
import getAuthSession from "../../../../utils/auth"

//find specific user
export const GET = async(req: Request, { params }: any) => {
    const { slug } = params

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: slug
            }
        })
        
        return new NextResponse(
            JSON.stringify(user)
        )
    } 
    catch(err) {}
}

//update username
export const POST = async(req: Request, { params }: any) => {
    const { slug } = params
    const session = await getAuthSession()
    const newUsername = await req.json()

    if (!session) {
        return new NextResponse(
            JSON.stringify({ status: 401 })
        )
    }

    await prisma.user.update({
        where: {
            id: slug
        },
        data: {
            username: newUsername
        }
    })

    await prisma.tweet.updateMany({
        where: {
            userId: slug
        },
        data: {
            userName: newUsername
        }
    })

    return new NextResponse(
        JSON.stringify({status: 200})
    )
}

//update followers
export const PUT = async(req: Request, { params }: any) => {
    const { slug } = params
    const session = await getAuthSession()
    const request = await req.json()

    const following = request.following
    const followers = request.followers

    if (!session) {
        return new NextResponse(
            JSON.stringify({ status: 401 })
        )
    }

    //update followers[] for followed account
    await prisma.user.update({
        where: {
            id: request.profileId
        },
        data: {
            followers: {
                set: followers
            }
        }
    })

    //update following[] for follower account
    await prisma.user.update({
        where: {
            id: session?.user?.id
        },
        data: {
            following: {
                set: following
            }
        }
    })

    return new NextResponse(
        JSON.stringify({status: 200})
    )
}

