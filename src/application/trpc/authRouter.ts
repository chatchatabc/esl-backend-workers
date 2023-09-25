import {
  trpcProcedure,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { authCreateJsonWebToken } from "../../domain/services/authService";
import { userCreate, userGet } from "../../domain/services/userService";
import {
  utilFailedResponse,
  utilHashHmac256,
} from "../../domain/services/utilService";
import {
  AuthLoginInput,
  AuthRegisterInput,
} from "../../domain/schemas/AuthSchema";
import { userDbGet } from "../../domain/repositories/userRepo";
import { UserCreate } from "../../domain/models/UserModel";

export default trpcRouterCreate({
  register: trpcProcedure.input(AuthRegisterInput).mutation(async (opts) => {
    const { username, password, confirmPassword } = opts.input;

    if (password !== confirmPassword) {
      throw utilFailedResponse("Password does not match", 400);
    }

    const userCreateData: UserCreate = {
      username,
      password: utilHashHmac256(password),
      roleId: 2,
      status: 1,
      credits: 0,
    };

    await userCreate(userCreateData, opts.ctx.env, 1);
    const user = await userGet(opts.input, opts.ctx.env);

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

  logout: trpcProcedureUser.mutation((opts) => {
    opts.ctx.resHeaders.append(
      "Set-Cookie",
      `token=; Path=/; SameSite=None; Secure; HttpOnly; Max-Age=0`
    );
    return true;
  }),
});
