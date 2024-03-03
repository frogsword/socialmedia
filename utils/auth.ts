import { getServerSession } from "next-auth"
import authOptions from "./options"

const getAuthSession = () => getServerSession(authOptions)

export default getAuthSession;