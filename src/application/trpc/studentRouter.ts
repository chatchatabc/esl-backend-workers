import { trpcProcedureAdmin, trpcRouterCreate } from "../../domain/infra/trpc";
import {
  StudentGetByUserInput,
  StudentGetInput,
} from "../../domain/schemas/StudentSchema";
import {
  studentGet,
  studentGetByUser,
} from "../../domain/services/studentService";

export default trpcRouterCreate({
  get: trpcProcedureAdmin.input(StudentGetInput).query((opts) => {
    return studentGet(opts.input, opts.ctx.env);
  }),
  getByUser: trpcProcedureAdmin.input(StudentGetByUserInput).query((opts) => {
    return studentGetByUser(opts.input, opts.ctx.env);
  }),
});
