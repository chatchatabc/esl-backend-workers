import { number, object, parse, pick } from "valibot";
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
  get: trpcProcedureUser
    .input((input) => parse(UserGetInput, input))
    .query((opts) => {
      const { id: userId } = opts.input;
      return userGet({ userId }, opts.ctx.env);
    }),

  getAll: trpcProcedureAdmin
    .input((input) => parse(CommonPaginationInput, input))
    .query((opts) => {
      return userGetAll(opts.input, opts.ctx.env);
    }),

  create: trpcProcedureAdmin
    .input((input) => parse(UserCreateInput, input))
    .mutation((opts) => {
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

  update: trpcProcedureAdmin
    .input((input) => parse(UserUpdateInput, input))
    .mutation((opts) => {
      return userUpdate(opts.input, opts.ctx.env);
    }),

  verifyPhone: trpcProcedureAdmin
    .input(pick(UserUpdateSchema, ["id", "phoneVerifiedAt"]))
    .mutation((opts) => {
      const { id } = opts.input;
      return userUpdate({ id, phoneVerifiedAt: Date.now() }, opts.ctx.env);
    }),

  revokePhoneVerification: trpcProcedureAdmin
    .input((input) =>
      parse(object({ id: number("ID must be a number") }), input)
    )
    .mutation(async (opts) => {
      const { id: userId } = opts.input;
      return userUpdate({ id: userId, phoneVerifiedAt: null }, opts.ctx.env);
    }),

  userGetProfile: trpcProcedureUser.query((opts) => {
    const { user } = opts.ctx;
    return user;
  }),
});
