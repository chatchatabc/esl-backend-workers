import { number, object, pick } from "valibot";
import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import {
  UserCreateInput,
  UserGetInput,
  UserUpdateInput,
  UserUpdateSchema,
} from "../../domain/schemas/UserSchema";
import {
  userCreate,
  userGet,
  userGetAll,
  userUpdate,
} from "../../domain/services/userService";
import { utilFailedResponse } from "../../domain/services/utilService";
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

  create: trpcProcedureAdmin.input(UserCreateInput).mutation((opts) => {
    const { confirmPassword, ...data } = opts.input;
    const { env, user } = opts.ctx;

    if (confirmPassword !== data.password) {
      throw utilFailedResponse("Password not match", 400);
    }

    if (data.roleId === 2) {
      return studentCreate({ ...data, bio: "" }, env, user.id);
    } else if (data.roleId === 3) {
      return teacherCreate({ ...data, bio: "" }, env, user.id);
    } else {
      return userCreate(data, env, user.id);
    }
  }),

  update: trpcProcedureAdmin.input(UserUpdateInput).mutation((opts) => {
    return userUpdate(opts.input, opts.ctx.env);
  }),

  verifyPhone: trpcProcedureAdmin
    .input(pick(UserUpdateSchema, ["id", "phoneVerifiedAt"]))
    .mutation((opts) => {
      const { id } = opts.input;
      return userUpdate({ id, phoneVerifiedAt: Date.now() }, opts.ctx.env);
    }),

  revokePhoneVerification: trpcProcedureAdmin
    .input(object({ id: number("ID must be a number") }))
    .mutation(async (opts) => {
      const { id: userId } = opts.input;
      return userUpdate({ id: userId, phoneVerifiedAt: null }, opts.ctx.env);
    }),

  getProfile: trpcProcedureUser.query((opts) => {
    const { user } = opts.ctx;
    return userGet({ userId: user.id }, opts.ctx.env);
  }),
});
