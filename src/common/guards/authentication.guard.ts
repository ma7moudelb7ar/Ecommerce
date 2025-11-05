import {BadRequestException,CanActivate,ExecutionContext,Injectable,UnauthorizedException,} from '@nestjs/common';
import { TokenService } from '../utils/security/token/tokenService';
import { TokenType } from '../enum';
  @Injectable()
  export class AuthenticationGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      let req: any;
      let authorization = '';
  
     
      if (context.getType() === 'http') {
        req = context.switchToHttp().getRequest();
        authorization =
          (req.headers?.authorization as string) ||
          (req.headers?.Authorization as string) ||
          '';
      }
      
      else if (context.getType() === 'ws') {
        const client: any = context.switchToWs().getClient();
        authorization =
          client?.handshake?.headers?.authorization ||
          client?.handshake?.headers?.Authorization ||
          '';
        req = client?.handshake;
      }
      
      else if (context.getType() === 'rpc') {
        const rpcCtx: any = context.switchToRpc().getContext();
        authorization = rpcCtx?.get?.('authorization') || '';
        req = rpcCtx;
      }
  
      try {
        const [prefix, token] = (authorization || '').split(' ').filter(Boolean) as [string, string];
  
        if (!prefix || !token) {
          throw new BadRequestException('Token not found');
        }
  
        const signature = await this.tokenService.GetSignature(TokenType.access,prefix);
        if (!signature) {
          throw new BadRequestException('Invalid signature');
        }
  
        
        const { user, decoded } = await this.tokenService.DecodedTokenAndFetchUser(token, signature);
  
        if (!user) {
          throw new UnauthorizedException('Invalid token or user not found');
        }
  
        if (req) {
          req.user = user;
          req.decoded = decoded;
        }
  
        return true;
      } catch (err) {
        
        if (err instanceof BadRequestException || err instanceof UnauthorizedException) {
          throw err;
        }
        throw new UnauthorizedException('Unauthorized');
      }
    }
  }
  