import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/models/CommonModel";
import {
  UserCreateInput,
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

export default trpcRouterCreate({
  get: trpcProcedureUser
    .input((values: any = {}) => {
      if (!values.userId) {
        throw utilFailedResponse("Missing values", 400);
      }

      return {
        userId: values.userId,
      } as { userId: number };
    })
    .query((opts) => {
      const { userId } = opts.input;
      return userGet({ userId }, opts.ctx.env);
    }),

  getAll: trpcProcedureAdmin
    .input((values: any = {}) => {
      return {
        page: values.page,
        size: values.size,
      } as CommonPaginationInput;
    })
    .query((opts) => {
      const { page = 1, size = 10 } = opts.input;
      return userGetAll({ page, size }, opts.ctx.env);
    }),

  getAllRole: trpcProcedureAdmin
    .input((values: any = {}) => {
      return {
        page: values.page,
        size: values.size,
      } as CommonPaginationInput;
    })
    .query((opts) => {
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
});
