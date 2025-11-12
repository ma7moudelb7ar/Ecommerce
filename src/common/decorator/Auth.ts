import { SetMetadata } from "@nestjs/common";

export interface AuthOptions {
  roles?: string[];
  tokenType?: string;
}

export const Auth = (options: AuthOptions) => SetMetadata("auth", options);
