import {
  trpcProcedure,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import {
  UserContactInformation,
  UserPersonalInformation,
} from "../../domain/models/UserModel";
import {
  authCreateJsonWebToken,
  authGetPhoneToken,
  authLogin,
  authRegister,
  authValidatePhoneToken,
} from "../../domain/services/authService";
import { userGet, userUpdateProfile } from "../../domain/services/userService";
import {
  utilFailedResponse,
  utilValidateChineseMobileNumber,
} from "../../domain/services/utilService";

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
      };
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
    .input((values: any = {}) => {
      if (!values.firstName || !values.lastName || !values.phone) {
        throw utilFailedResponse("Missing values", 400);
      }

      if (!utilValidateChineseMobileNumber(values.phone)) {
        throw utilFailedResponse("Invalid phone number", 400);
      }

      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: `+86${values.phone}`,
      } as UserPersonalInformation & UserContactInformation;

      return data;
    })
    .mutation((opts) => {
      const { userId = 0, env } = opts.ctx;

      return userUpdateProfile({ ...opts.input, userId }, env);
    }),

  getPhoneToken: trpcProcedure.query((opts) => {
    const { userId = 0, env } = opts.ctx;
    return authGetPhoneToken({ userId }, env);
  }),

  validatePhoneToken: trpcProcedure
    .input((values: any = {}) => {
      if (!values.token) {
        throw utilFailedResponse("Missing token", 400);
      }
      return values as { token: string };
    })
    .mutation((opts) => {
      const { userId = 0, env } = opts.ctx;
      const { token } = opts.input;
      return authValidatePhoneToken({ userId, token }, env);
    }),
});
