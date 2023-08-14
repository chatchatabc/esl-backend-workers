import {
  trpcProcedureAdmin,
  trpcProcedureUser,
  trpcRouterCreate,
} from "../../domain/infra/trpc";
import { CommonPaginationInput } from "../../domain/models/CommonModel";
import { UserCreateInput } from "../../domain/models/UserModel";
import {
  userCreate,
  userGet,
  userGetAll,
  userGetAllRole,
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

  create: trpcProcedureAdmin
    .input((values: any = {}) => {
      const { username, password, roleId, credit, confirmPassword, status } =
        values;

      if (
        !username ||
        !password ||
        !roleId ||
        !credit ||
        !confirmPassword ||
        !status
      ) {
        throw utilFailedResponse("Missing values", 400);
      } else if (values.password !== values.confirmPassword) {
        throw utilFailedResponse("Password not match", 400);
      }

      return values as UserCreateInput;
    })
    .mutation((opts) => {
      const data = {
        ...opts.input,
        confirmPassword: undefined,
      };

      return userCreate(data, opts.ctx.env);
    }),
});
