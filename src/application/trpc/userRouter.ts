import { coerce, number, object, string } from "valibot";
import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import {
  UserCreateInput,
  UserUpdateInput,
} from "../../domain/schemas/UserSchema";
import {
  userAddCredit,
  userCreate,
  userGet,
  userGetAll,
  userGetAllRole,
  userGetByUsername,
  userUpdate,
} from "../../domain/services/userService";
import { utilFailedResponse } from "../../domain/services/utilService";
import { userDbGet, userDbUpdate } from "../../domain/repositories/userRepo";
import { CommonPaginationInput } from "../../domain/schemas/CommonSchema";

export default trpcRouterCreate({
  get: trpcProcedureUser.input(object({ userId: number() })).query((opts) => {
    return userGet(opts.input, opts.ctx.env);
  }),

  getByUsername: trpcProcedureAdmin
    .input(object({ username: string() }))
    .query((opts) => {
      return userGetByUsername(opts.input, opts.ctx.env);
    }),

  getAll: trpcProcedureAdmin.input(CommonPaginationInput).query((opts) => {
    return userGetAll(opts.input, opts.ctx.env);
  }),

  getAllRole: trpcProcedureAdmin.input(CommonPaginationInput).query((opts) => {
    const { page = 1, size = 10 } = opts.input;
    return userGetAllRole({ page, size }, opts.ctx.env);
  }),

  create: trpcProcedureAdmin.input(UserCreateInput).mutation((opts) => {
    const { confirmPassword, password } = opts.input;

    if (confirmPassword !== password) {
      throw utilFailedResponse("Password not match", 400);
    }

    return userCreate(opts.input, opts.ctx.env);
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

  addCredit: trpcProcedureAdmin
    .input(
      object({
        userId: coerce(number(), Number),
        amount: coerce(number(), Number),
      })
    )
    .mutation((opts) => {
      const senderId = opts.ctx.userId;
      const receiverId = opts.input.userId;
      return userAddCredit(
        { amount: opts.input.amount, senderId, receiverId },
        opts.ctx.env
      );
    }),
});
