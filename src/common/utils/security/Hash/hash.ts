import {hash , compare} from "bcrypt"

export const Hash = async ( plainText : string , saltRound : number = Number(process.env.SALT_ROUND)): Promise<string> => { 

    return hash(plainText ,saltRound )
}

