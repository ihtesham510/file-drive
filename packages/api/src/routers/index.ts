import { protectedProcedure, publicProcedure, router } from '../index'
import { favoritesRouter } from './favorites'
import { fileRouter } from './files'
import { todoRouter } from './todo'
import { trashRouter } from './trash'

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
	trash: trashRouter,
	favorites: favoritesRouter,
})
export type AppRouter = typeof appRouter
