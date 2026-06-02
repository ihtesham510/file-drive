import type { AppRouter } from '@file-drive/api/routers/index'
import type { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

export type TrpcProxy = ReturnType<typeof createTRPCOptionsProxy<AppRouter>>
