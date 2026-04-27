import { protectedProcedure, publicProcedure, router } from '../index'
import { fileRouter } from './files'
import { todoRouter } from './todo'

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return 'OK'
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: 'This is private',
			user: ctx.session.user,
		}
	}),
	todo: todoRouter,
	files: fileRouter,
})
export type AppRouter = typeof appRouter
