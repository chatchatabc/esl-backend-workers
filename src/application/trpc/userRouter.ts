import { number, object } from "valibot";
import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import {
  UserCreateInput,
  UserGetInput,
  UserUpdateInput,
} from "../../domain/schemas/UserSchema";
import {
  userCreate,
  userGet,
  userGetAll,
  userGetAllRole,
  userUpdate,
} from "../../domain/services/userService";
import { utilFailedResponse } from "../../domain/services/utilService";
import { userDbGet, userDbUpdate } from "../../domain/repositories/userRepo";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";
import { studentCreate } from "../../domain/services/studentService";
import { teacherCreate } from "../../domain/services/teacherService";

export default trpcRouterCreate({
  get: trpcProcedureUser.input(UserGetInput).query((opts) => {
    const { id: userId, username } = opts.input;
    return userGet({ userId, username }, opts.ctx.env);
  }),

  getAll: trpcProcedureAdmin.input(CommonPaginationInput).query((opts) => {
    return userGetAll(opts.input, opts.ctx.env);
  }),

  getAllRole: trpcProcedureAdmin.input(CommonPaginationInput).query((opts) => {
    const { page = 1, size = 10 } = opts.input;
    return userGetAllRole({ page, size }, opts.ctx.env);
  }),

  create: trpcProcedureAdmin.input(UserCreateInput).mutation((opts) => {
    const { confirmPassword, ...data } = opts.input;
    const { env, userId } = opts.ctx;

    if (confirmPassword !== data.password) {
      throw utilFailedResponse("Password not match", 400);
    }

    if (data.roleId === 2) {
      return studentCreate({ ...data, bio: "" }, env, userId);
    } else if (data.roleId === 3) {
      return teacherCreate({ ...data, bio: "" }, env, userId);
    } else {
      return userCreate(data, env, userId);
    }
  }),

  update: trpcProcedureAdmin.input(UserUpdateInput).mutation((opts) => {
    return userUpdate(opts.input, opts.ctx.env);
  }),

  verifyPhone: trpcProcedureAdmin
    .input(object({ userId: number() }))
    .mutation(async (opts) => {
      const user = await userDbGet(opts.input, opts.ctx.env);
      if (!user) {
        throw utilFailedResponse("User not found", 400);
      } else if (user.phoneVerifiedAt) {
        throw utilFailedResponse("Phone already verified", 400);
      }
      user.phoneVerifiedAt = Date.now();

      const save = await userDbUpdate(user, opts.ctx.env);
      if (!save) {
        throw utilFailedResponse("Failed to save", 400);
      }

      return true;
    }),

  revokePhoneVerification: trpcProcedureAdmin
    .input(object({ userId: number() }))
    .mutation(async (opts) => {
      const user = await userDbGet(opts.input, opts.ctx.env);
      if (!user) {
        throw utilFailedResponse("User not found", 400);
      } else if (!user.phoneVerifiedAt) {
        throw utilFailedResponse("Phone already verified", 400);
      }
      user.phoneVerifiedAt = null;

      const save = await userDbUpdate(user, opts.ctx.env);
      if (!save) {
        throw utilFailedResponse("Failed to save", 400);
      }

      return true;
    }),
});
