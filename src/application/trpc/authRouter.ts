import { minLength, object, string } from "valibot";
import {
  trpcProcedure,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { UserRegister } from "../../domain/models/UserModel";
import { UserRegisterProfile } from "../../domain/schemas/UserSchema";
import {
  authCreateJsonWebToken,
  authGetPhoneToken,
  authValidatePhoneToken,
} from "../../domain/services/authService";
import { userGet, userUpdateProfile } from "../../domain/services/userService";
import {
  utilFailedResponse,
  utilHashHmac256,
} from "../../domain/services/utilService";
import { AuthLoginInput } from "../../domain/schemas/AuthSchema";
import { userDbGet } from "../../domain/repositories/userRepo";

export default trpcRouterCreate({
  register: trpcProcedure
    .input((values: any = {}) => {
      const { username, password, confirmPassword, ...other } = values;
      if (!username || !password || !confirmPassword) {
        throw utilFailedResponse("Missing fields for register", 400);
      } else if (password !== confirmPassword) {
        throw utilFailedResponse("Password not match", 400);
      } else if (other && Object.keys(other).length > 0) {
        throw utilFailedResponse("Unknown fields present", 400);
      }

      return values as UserRegister;
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

  login: trpcProcedure.input(AuthLoginInput).mutation(async (opts) => {
    const { username, password } = opts.input;
    const user = await userDbGet({ username }, opts.ctx.env);

    // Validate user
    if (!user) {
      throw utilFailedResponse("User not found", 404);
    } else if (user.password !== utilHashHmac256(password)) {
      throw utilFailedResponse("Invalid password", 400);
    }

    // Generate session token
    const token = authCreateJsonWebToken(user.id);
    opts.ctx.resHeaders.append(
      "Set-Cookie",
      `token=${token}; Path=/; SameSite=None; Secure; HttpOnly`
    );

    delete user.password;
    return user;
  }),

  logout: trpcProcedure.mutation((opts) => {
    opts.ctx.resHeaders.append(
      "Set-Cookie",
      `token=; Path=/; SameSite=None; Secure; HttpOnly; Max-Age=0`
    );
    return true;
  }),

  getProfile: trpcProcedureUser.query((opts) => {
    const { userId = 0, env } = opts.ctx;
    return userGet({ userId }, env);
  }),

  updateProfile: trpcProcedureUser
    .input(UserRegisterProfile)
    .mutation(async (opts) => {
      const { userId, env } = opts.ctx;

      const user = await userGet({ userId }, env);
      if (!user) {
        throw utilFailedResponse("User not found", 400);
      }

      const newData = {
        ...user,
        ...opts.input,
      };

      return userUpdateProfile(newData, env);
    }),

  getPhoneToken: trpcProcedureUser.query((opts) => {
    const { userId, env } = opts.ctx;
    return authGetPhoneToken({ userId }, env);
  }),

  validatePhoneToken: trpcProcedureUser
    .input(
      object({
        token: string("Token must be a string", [
          minLength(1, "Token is required"),
        ]),
      })
    )
    .mutation((opts) => {
      const { userId = 0, env } = opts.ctx;
      const { token } = opts.input;
      return authValidatePhoneToken({ userId, token }, env);
    }),
});
