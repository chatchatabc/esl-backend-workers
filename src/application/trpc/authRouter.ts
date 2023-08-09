import { trpcProcedure, trpcRouterCreate } from ".";
import { UserLogin, UserRegisterInput } from "../../domain/models/UserModel";
import {
  authCreateJsonWebToken,
  authLogin,
  authRegister,
} from "../../domain/services/authService";
import { utilFailedResponse } from "../../domain/services/utilService";

export default trpcRouterCreate({
  register: trpcProcedure
    .input((values: any = {}) => {
      if (!values.username || !values.password || !values.confirmPassword) {
        throw utilFailedResponse("Missing fields for register", 400);
      }

      return {
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
      } as UserRegisterInput;
    })
    .mutation(async (opts) => {
      const user = await authRegister(opts.input, opts.ctx.env);
      if (!user) {
        throw utilFailedResponse("Failed to register user", 400);
      }

      const token = authCreateJsonWebToken(user.id);
      opts.ctx.resHeaders.append(
        "Set-Cookie",
        `token=${token}; Path=/; SameSite=None; Secure; HttpOnly`
      );

      return user;
    }),

  login: trpcProcedure
    .input((values: any = {}) => {
      if (!values.username || !values.password) {
        throw utilFailedResponse("Missing fields for login", 400);
      }
      return {
        username: values.username as string,
        password: values.password as string,
      };
    })
    .mutation(async (opts) => {
      const user = await authLogin(opts.input, opts.ctx.env);
      const token = authCreateJsonWebToken(user.id);
      opts.ctx.resHeaders.append(
        "Set-Cookie",
        `token=${token}; Path=/; SameSite=None; Secure; HttpOnly`
      );
      return user;
    }),
});
