// import { ,BadRequestException, NestMiddleware } from "@nestjs/common";



// export class authontacationMiddleware implements NestMiddleware {

//     use(req: any, res: any, next: any) {
//         const { authorization }  = req.headers
//         if (!authorization) {
//             throw new BadRequestException("Authorization header missing")
//     }
//         const [ prefix, token ]  = authorization!.split(" ")  || []
    
//         if (!prefix || !token) {
//             throw new BadRequestException("Invalid prefix or token")
//         }
//         const signature = await GetSignature(tokenType ,prefix)
//         if (!signature) {
//             throw new BadRequestException("Invalid signature")
//         }
//         const decoded = await DecodedTokenAndFetchUser(token , signature)
//         if (!decoded) {
//             throw new BadRequestException("Invalid decoded")
//         }
//         req.user = decoded?.user
//         req.decoded = decoded?.decoded
    
//         return next();
//     }
// }
    
