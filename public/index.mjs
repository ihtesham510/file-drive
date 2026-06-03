import { betterAuth, HIDE_METADATA } from 'better-auth'
import { APIError, createAuthEndpoint } from 'better-auth/api'
import * as z$3 from 'zod'
import z$1, { z } from 'zod'
import 'dotenv/config'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { trpcServer } from '@hono/trpc-server'
import { zValidator } from '@hono/zod-validator'
import { initTRPC, TRPCError } from '@trpc/server'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { organization } from 'better-auth/plugins'
import {
	and,
	Column,
	eq,
	getTableColumns,
	getViewSelectedFields,
	inArray,
	is,
	isTable,
	isView,
	relations,
	SQL,
} from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import {
	boolean,
	index,
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from 'drizzle-orm/pg-core'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { proxy } from 'hono/proxy'
import { z as z$2 } from 'zod/v4'

//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty
var __exportAll = (all, no_symbols) => {
	const target = {}
	for (var name in all)
		__defProp(target, name, {
			get: all[name],
			enumerable: true,
		})
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: 'Module' })
	return target
}
import(
	/* @vite-ignore */
	/* webpackIgnore: true */
	'node:async_hooks'
)
	.then(mod => mod.AsyncLocalStorage)
	.catch(err => {
		if ('AsyncLocalStorage' in globalThis) return globalThis.AsyncLocalStorage
		if (typeof window !== 'undefined') return null
		console.warn(
			'[better-auth] Warning: AsyncLocalStorage is not available in this environment. Some features may not work as expected.',
		)
		console.warn(
			'[better-auth] Please read more about this warning at https://better-auth.com/docs/installation#mount-handler',
		)
		console.warn(
			'[better-auth] If you are using Cloudflare Workers, please see: https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag',
		)
		throw err
	})
//#endregion
//#region ../../node_modules/.bun/better-call@1.3.2+3c5d820c62823f0b/node_modules/better-call/dist/error.mjs
function isErrorStackTraceLimitWritable() {
	const desc = Object.getOwnPropertyDescriptor(Error, 'stackTraceLimit')
	if (desc === void 0) return Object.isExtensible(Error)
	return Object.hasOwn(desc, 'writable') ? desc.writable : desc.set !== void 0
}
/**
 * Hide internal stack frames from the error stack trace.
 */
function hideInternalStackFrames(stack) {
	const lines = stack.split('\n    at ')
	if (lines.length <= 1) return stack
	lines.splice(1, 1)
	return lines.join('\n    at ')
}
/**
 * Creates a custom error class that hides stack frames.
 */
function makeErrorForHideStackFrame(Base, clazz) {
	class HideStackFramesError extends Base {
		#hiddenStack
		constructor(...args) {
			if (isErrorStackTraceLimitWritable()) {
				const limit = Error.stackTraceLimit
				Error.stackTraceLimit = 0
				super(...args)
				Error.stackTraceLimit = limit
			} else super(...args)
			const stack = /* @__PURE__ */ new Error().stack
			if (stack)
				this.#hiddenStack = hideInternalStackFrames(
					stack.replace(/^Error/, this.name),
				)
		}
		get errorStack() {
			return this.#hiddenStack
		}
	}
	Object.defineProperty(HideStackFramesError.prototype, 'constructor', {
		get() {
			return clazz
		},
		enumerable: false,
		configurable: true,
	})
	return HideStackFramesError
}
const statusCodes = {
	OK: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NO_CONTENT: 204,
	MULTIPLE_CHOICES: 300,
	MOVED_PERMANENTLY: 301,
	FOUND: 302,
	SEE_OTHER: 303,
	NOT_MODIFIED: 304,
	TEMPORARY_REDIRECT: 307,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	NOT_ACCEPTABLE: 406,
	PROXY_AUTHENTICATION_REQUIRED: 407,
	REQUEST_TIMEOUT: 408,
	CONFLICT: 409,
	GONE: 410,
	LENGTH_REQUIRED: 411,
	PRECONDITION_FAILED: 412,
	PAYLOAD_TOO_LARGE: 413,
	URI_TOO_LONG: 414,
	UNSUPPORTED_MEDIA_TYPE: 415,
	RANGE_NOT_SATISFIABLE: 416,
	EXPECTATION_FAILED: 417,
	"I'M_A_TEAPOT": 418,
	MISDIRECTED_REQUEST: 421,
	UNPROCESSABLE_ENTITY: 422,
	LOCKED: 423,
	FAILED_DEPENDENCY: 424,
	TOO_EARLY: 425,
	UPGRADE_REQUIRED: 426,
	PRECONDITION_REQUIRED: 428,
	TOO_MANY_REQUESTS: 429,
	REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
	UNAVAILABLE_FOR_LEGAL_REASONS: 451,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504,
	HTTP_VERSION_NOT_SUPPORTED: 505,
	VARIANT_ALSO_NEGOTIATES: 506,
	INSUFFICIENT_STORAGE: 507,
	LOOP_DETECTED: 508,
	NOT_EXTENDED: 510,
	NETWORK_AUTHENTICATION_REQUIRED: 511,
}
var InternalAPIError = class extends Error {
	constructor(
		status = 'INTERNAL_SERVER_ERROR',
		body = void 0,
		headers = {},
		statusCode = typeof status === 'number' ? status : statusCodes[status],
	) {
		super(body?.message, body?.cause ? { cause: body.cause } : void 0)
		this.status = status
		this.body = body
		this.headers = headers
		this.statusCode = statusCode
		this.name = 'APIError'
		this.status = status
		this.headers = headers
		this.statusCode = statusCode
		this.body = body
	}
}
var ValidationError = class extends InternalAPIError {
	constructor(message, issues) {
		super(400, {
			message,
			code: 'VALIDATION_ERROR',
		})
		this.message = message
		this.issues = issues
		this.issues = issues
	}
}
var BetterCallError = class extends Error {
	constructor(message) {
		super(message)
		this.name = 'BetterCallError'
	}
}
const kAPIErrorHeaderSymbol = Symbol.for('better-call:api-error-headers')
const APIError$1 = makeErrorForHideStackFrame(InternalAPIError, Error)
//#endregion
//#region ../../node_modules/.bun/better-call@1.3.2+3c5d820c62823f0b/node_modules/better-call/dist/utils.mjs
function isAPIError(error) {
	return error instanceof APIError$1 || error?.name === 'APIError'
}
function tryDecode(str) {
	try {
		return str.includes('%') ? decodeURIComponent(str) : str
	} catch {
		return str
	}
}
async function tryCatch(promise) {
	try {
		return {
			data: await promise,
			error: null,
		}
	} catch (error) {
		return {
			data: null,
			error,
		}
	}
}
/**
 * Check if an object is a `Request`
 * - `instanceof`: works for native Request instances
 * - `toString`: handles where instanceof check fails but the object is still a valid Request
 */
function isRequest(obj) {
	return (
		obj instanceof Request ||
		Object.prototype.toString.call(obj) === '[object Request]'
	)
}
//#endregion
//#region ../../node_modules/.bun/better-call@1.3.2+3c5d820c62823f0b/node_modules/better-call/dist/to-response.mjs
function isJSONSerializable(value) {
	if (value === void 0) return false
	const t = typeof value
	if (t === 'string' || t === 'number' || t === 'boolean' || t === null)
		return true
	if (t !== 'object') return false
	if (Array.isArray(value)) return true
	if (value.buffer) return false
	return (
		(value.constructor && value.constructor.name === 'Object') ||
		typeof value.toJSON === 'function'
	)
}
function safeStringify(obj, replacer, space) {
	let id = 0
	const seen = /* @__PURE__ */ new WeakMap()
	const safeReplacer = (key, value) => {
		if (typeof value === 'bigint') return value.toString()
		if (typeof value === 'object' && value !== null) {
			if (seen.has(value)) return `[Circular ref-${seen.get(value)}]`
			seen.set(value, id++)
		}
		if (replacer) return replacer(key, value)
		return value
	}
	return JSON.stringify(obj, safeReplacer, space)
}
function isJSONResponse(value) {
	if (!value || typeof value !== 'object') return false
	return '_flag' in value && value._flag === 'json'
}
function toResponse(data, init) {
	if (data instanceof Response) {
		if (init?.headers instanceof Headers)
			init.headers.forEach((value, key) => {
				data.headers.set(key, value)
			})
		return data
	}
	if (isJSONResponse(data)) {
		const body = data.body
		const routerResponse = data.routerResponse
		if (routerResponse instanceof Response) return routerResponse
		const headers = new Headers()
		if (routerResponse?.headers) {
			const headers = new Headers(routerResponse.headers)
			for (const [key, value] of headers.entries()) headers.set(key, value)
		}
		if (data.headers)
			for (const [key, value] of new Headers(data.headers).entries())
				headers.set(key, value)
		if (init?.headers)
			for (const [key, value] of new Headers(init.headers).entries())
				headers.set(key, value)
		headers.set('Content-Type', 'application/json')
		return new Response(JSON.stringify(body), {
			...routerResponse,
			headers,
			status: data.status ?? init?.status ?? routerResponse?.status,
			statusText: init?.statusText ?? routerResponse?.statusText,
		})
	}
	if (isAPIError(data))
		return toResponse(data.body, {
			status: init?.status ?? data.statusCode,
			statusText: data.status.toString(),
			headers: init?.headers || data.headers,
		})
	let body = data
	const headers = new Headers(init?.headers)
	if (!data) {
		if (data === null) body = JSON.stringify(null)
		headers.set('content-type', 'application/json')
	} else if (typeof data === 'string') {
		body = data
		headers.set('Content-Type', 'text/plain')
	} else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
		body = data
		headers.set('Content-Type', 'application/octet-stream')
	} else if (data instanceof Blob) {
		body = data
		headers.set('Content-Type', data.type || 'application/octet-stream')
	} else if (data instanceof FormData) body = data
	else if (data instanceof URLSearchParams) {
		body = data
		headers.set('Content-Type', 'application/x-www-form-urlencoded')
	} else if (data instanceof ReadableStream) {
		body = data
		headers.set('Content-Type', 'application/octet-stream')
	} else if (isJSONSerializable(data)) {
		body = safeStringify(data)
		headers.set('Content-Type', 'application/json')
	}
	return new Response(body, {
		...init,
		headers,
	})
}
//#endregion
//#region ../../node_modules/.bun/@better-auth+utils@0.3.1/node_modules/@better-auth/utils/dist/index.mjs
function getWebcryptoSubtle() {
	const cr = typeof globalThis !== 'undefined' && globalThis.crypto
	if (cr && typeof cr.subtle === 'object' && cr.subtle != null) return cr.subtle
	throw new Error('crypto.subtle must be defined')
}
//#endregion
//#region ../../node_modules/.bun/better-call@1.3.2+3c5d820c62823f0b/node_modules/better-call/dist/crypto.mjs
const algorithm = {
	name: 'HMAC',
	hash: 'SHA-256',
}
const getCryptoKey = async secret => {
	const secretBuf =
		typeof secret === 'string' ? new TextEncoder().encode(secret) : secret
	return await getWebcryptoSubtle().importKey(
		'raw',
		secretBuf,
		algorithm,
		false,
		['sign', 'verify'],
	)
}
const verifySignature = async (base64Signature, value, secret) => {
	try {
		const signatureBinStr = atob(base64Signature)
		const signature = new Uint8Array(signatureBinStr.length)
		for (let i = 0, len = signatureBinStr.length; i < len; i++)
			signature[i] = signatureBinStr.charCodeAt(i)
		return await getWebcryptoSubtle().verify(
			algorithm,
			secret,
			signature,
			new TextEncoder().encode(value),
		)
	} catch (e) {
		return false
	}
}
const makeSignature = async (value, secret) => {
	const key = await getCryptoKey(secret)
	const signature = await getWebcryptoSubtle().sign(
		algorithm.name,
		key,
		new TextEncoder().encode(value),
	)
	return btoa(String.fromCharCode(...new Uint8Array(signature)))
}
const signCookieValue = async (value, secret) => {
	const signature = await makeSignature(value, secret)
	value = `${value}.${signature}`
	value = encodeURIComponent(value)
	return value
}
//#endregion
//#region ../../node_modules/.bun/better-call@1.3.2+3c5d820c62823f0b/node_modules/better-call/dist/cookies.mjs
const getCookieKey = (key, prefix) => {
	let finalKey = key
	if (prefix)
		if (prefix === 'secure') finalKey = '__Secure-' + key
		else if (prefix === 'host') finalKey = '__Host-' + key
		else return
	return finalKey
}
/**
 * Parse an HTTP Cookie header string and returning an object of all cookie
 * name-value pairs.
 *
 * Inspired by https://github.com/unjs/cookie-es/blob/main/src/cookie/parse.ts
 *
 * @param str the string representing a `Cookie` header value
 */
function parseCookies(str) {
	if (typeof str !== 'string')
		throw new TypeError('argument str must be a string')
	const cookies = /* @__PURE__ */ new Map()
	let index = 0
	while (index < str.length) {
		const eqIdx = str.indexOf('=', index)
		if (eqIdx === -1) break
		let endIdx = str.indexOf(';', index)
		if (endIdx === -1) endIdx = str.length
		else if (endIdx < eqIdx) {
			index = str.lastIndexOf(';', eqIdx - 1) + 1
			continue
		}
		const key = str.slice(index, eqIdx).trim()
		if (!cookies.has(key)) {
			let val = str.slice(eqIdx + 1, endIdx).trim()
			if (val.codePointAt(0) === 34) val = val.slice(1, -1)
			cookies.set(key, tryDecode(val))
		}
		index = endIdx + 1
	}
	return cookies
}
const _serialize = (key, value, opt = {}) => {
	let cookie
	if (opt?.prefix === 'secure') cookie = `${`__Secure-${key}`}=${value}`
	else if (opt?.prefix === 'host') cookie = `${`__Host-${key}`}=${value}`
	else cookie = `${key}=${value}`
	if (key.startsWith('__Secure-') && !opt.secure) opt.secure = true
	if (key.startsWith('__Host-')) {
		if (!opt.secure) opt.secure = true
		if (opt.path !== '/') opt.path = '/'
		if (opt.domain) opt.domain = void 0
	}
	if (opt && typeof opt.maxAge === 'number' && opt.maxAge >= 0) {
		if (opt.maxAge > 3456e4)
			throw new Error(
				'Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.',
			)
		cookie += `; Max-Age=${Math.floor(opt.maxAge)}`
	}
	if (opt.domain && opt.prefix !== 'host') cookie += `; Domain=${opt.domain}`
	if (opt.path) cookie += `; Path=${opt.path}`
	if (opt.expires) {
		if (opt.expires.getTime() - Date.now() > 3456e7)
			throw new Error(
				'Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.',
			)
		cookie += `; Expires=${opt.expires.toUTCString()}`
	}
	if (opt.httpOnly) cookie += '; HttpOnly'
	if (opt.secure) cookie += '; Secure'
	if (opt.sameSite)
		cookie += `; SameSite=${opt.sameSite.charAt(0).toUpperCase() + opt.sameSite.slice(1)}`
	if (opt.partitioned) {
		if (!opt.secure) opt.secure = true
		cookie += '; Partitioned'
	}
	return cookie
}
const serializeCookie = (key, value, opt) => {
	value = encodeURIComponent(value)
	return _serialize(key, value, opt)
}
const serializeSignedCookie = async (key, value, secret, opt) => {
	value = await signCookieValue(value, secret)
	return _serialize(key, value, opt)
}
//#endregion
//#region ../../node_modules/.bun/better-call@1.3.2+3c5d820c62823f0b/node_modules/better-call/dist/validator.mjs
/**
 * Runs validation on body and query
 * @returns error and data object
 */
async function runValidation(options, context = {}) {
	const request = {
		body: context.body,
		query: context.query,
	}
	if (options.body) {
		const result = await options.body['~standard'].validate(context.body)
		if (result.issues)
			return {
				data: null,
				error: fromError(result.issues, 'body'),
			}
		request.body = result.value
	}
	if (options.query) {
		const result = await options.query['~standard'].validate(context.query)
		if (result.issues)
			return {
				data: null,
				error: fromError(result.issues, 'query'),
			}
		request.query = result.value
	}
	if (options.requireHeaders && !context.headers)
		return {
			data: null,
			error: {
				message: 'Headers is required',
				issues: [],
			},
		}
	if (options.requireRequest && !context.request)
		return {
			data: null,
			error: {
				message: 'Request is required',
				issues: [],
			},
		}
	return {
		data: request,
		error: null,
	}
}
function fromError(error, validating) {
	return {
		message: error
			.map(e => {
				return `[${e.path?.length ? `${validating}.` + e.path.map(x => (typeof x === 'object' ? x.key : x)).join('.') : validating}] ${e.message}`
			})
			.join('; '),
		issues: error,
	}
}
//#endregion
//#region ../../node_modules/.bun/better-call@1.3.2+3c5d820c62823f0b/node_modules/better-call/dist/context.mjs
const createInternalContext = async (context, { options, path }) => {
	const headers = new Headers()
	let responseStatus = void 0
	const { data, error } = await runValidation(options, context)
	if (error) throw new ValidationError(error.message, error.issues)
	const requestHeaders =
		'headers' in context
			? context.headers instanceof Headers
				? context.headers
				: new Headers(context.headers)
			: 'request' in context && isRequest(context.request)
				? context.request.headers
				: null
	const requestCookies = requestHeaders?.get('cookie')
	const parsedCookies = requestCookies ? parseCookies(requestCookies) : void 0
	const internalContext = {
		...context,
		body: data.body,
		query: data.query,
		path: context.path || path || 'virtual:',
		context: 'context' in context && context.context ? context.context : {},
		returned: void 0,
		headers: context?.headers,
		request: context?.request,
		params: 'params' in context ? context.params : void 0,
		method:
			context.method ??
			(Array.isArray(options.method)
				? options.method[0]
				: options.method === '*'
					? 'GET'
					: options.method),
		setHeader: (key, value) => {
			headers.set(key, value)
		},
		getHeader: key => {
			if (!requestHeaders) return null
			return requestHeaders.get(key)
		},
		getCookie: (key, prefix) => {
			const finalKey = getCookieKey(key, prefix)
			if (!finalKey) return null
			return parsedCookies?.get(finalKey) || null
		},
		getSignedCookie: async (key, secret, prefix) => {
			const finalKey = getCookieKey(key, prefix)
			if (!finalKey) return null
			const value = parsedCookies?.get(finalKey)
			if (!value) return null
			const signatureStartPos = value.lastIndexOf('.')
			if (signatureStartPos < 1) return null
			const signedValue = value.substring(0, signatureStartPos)
			const signature = value.substring(signatureStartPos + 1)
			if (signature.length !== 44 || !signature.endsWith('=')) return null
			return (await verifySignature(
				signature,
				signedValue,
				await getCryptoKey(secret),
			))
				? signedValue
				: false
		},
		setCookie: (key, value, options) => {
			const cookie = serializeCookie(key, value, options)
			headers.append('set-cookie', cookie)
			return cookie
		},
		setSignedCookie: async (key, value, secret, options) => {
			const cookie = await serializeSignedCookie(key, value, secret, options)
			headers.append('set-cookie', cookie)
			return cookie
		},
		redirect: url => {
			headers.set('location', url)
			return new APIError$1('FOUND', void 0, headers)
		},
		error: (status, body, headers) => {
			return new APIError$1(status, body, headers)
		},
		setStatus: status => {
			responseStatus = status
		},
		json: (json, routerResponse) => {
			if (!context.asResponse) return json
			return {
				body: routerResponse?.body || json,
				routerResponse,
				_flag: 'json',
			}
		},
		responseHeaders: headers,
		get responseStatus() {
			return responseStatus
		},
	}
	for (const middleware of options.use || []) {
		const response = await middleware({
			...internalContext,
			returnHeaders: true,
			asResponse: false,
		})
		if (response.response)
			Object.assign(internalContext.context, response.response)
		/**
		 * Apply headers from the middleware to the endpoint headers
		 */
		if (response.headers)
			response.headers.forEach((value, key) => {
				internalContext.responseHeaders.set(key, value)
			})
	}
	return internalContext
}
//#endregion
//#region ../../node_modules/.bun/better-call@1.3.2+3c5d820c62823f0b/node_modules/better-call/dist/endpoint.mjs
function createEndpoint(pathOrOptions, handlerOrOptions, handlerOrNever) {
	const path = typeof pathOrOptions === 'string' ? pathOrOptions : void 0
	const options =
		typeof handlerOrOptions === 'object' ? handlerOrOptions : pathOrOptions
	const handler =
		typeof handlerOrOptions === 'function' ? handlerOrOptions : handlerOrNever
	if ((options.method === 'GET' || options.method === 'HEAD') && options.body)
		throw new BetterCallError('Body is not allowed with GET or HEAD methods')
	if (path && /\/{2,}/.test(path))
		throw new BetterCallError('Path cannot contain consecutive slashes')
	const internalHandler = async (...inputCtx) => {
		const context = inputCtx[0] || {}
		const { data: internalContext, error: validationError } = await tryCatch(
			createInternalContext(context, {
				options,
				path,
			}),
		)
		if (validationError) {
			if (!(validationError instanceof ValidationError)) throw validationError
			if (options.onValidationError)
				await options.onValidationError({
					message: validationError.message,
					issues: validationError.issues,
				})
			throw new APIError$1(400, {
				message: validationError.message,
				code: 'VALIDATION_ERROR',
			})
		}
		const response = await handler(internalContext).catch(async e => {
			if (isAPIError(e)) {
				const onAPIError = options.onAPIError
				if (onAPIError) await onAPIError(e)
				if (context.asResponse) return e
			}
			throw e
		})
		const headers = internalContext.responseHeaders
		const status = internalContext.responseStatus
		return context.asResponse
			? toResponse(response, {
					headers,
					status,
				})
			: context.returnHeaders
				? context.returnStatus
					? {
							headers,
							response,
							status,
						}
					: {
							headers,
							response,
						}
				: context.returnStatus
					? {
							response,
							status,
						}
					: response
	}
	internalHandler.options = options
	internalHandler.path = path
	return internalHandler
}
createEndpoint.create = opts => {
	return (path, options, handler) => {
		return createEndpoint(
			path,
			{
				...options,
				use: [...(options?.use || []), ...(opts?.use || [])],
			},
			handler,
		)
	}
}
//#endregion
//#region ../../node_modules/.bun/better-call@1.3.2+3c5d820c62823f0b/node_modules/better-call/dist/middleware.mjs
function createMiddleware(optionsOrHandler, handler) {
	const internalHandler = async inputCtx => {
		const context = inputCtx
		const _handler =
			typeof optionsOrHandler === 'function' ? optionsOrHandler : handler
		const internalContext = await createInternalContext(context, {
			options: typeof optionsOrHandler === 'function' ? {} : optionsOrHandler,
			path: '/',
		})
		if (!_handler) throw new Error('handler must be defined')
		try {
			const response = await _handler(internalContext)
			const headers = internalContext.responseHeaders
			return context.returnHeaders
				? {
						headers,
						response,
					}
				: response
		} catch (e) {
			if (isAPIError(e))
				Object.defineProperty(e, kAPIErrorHeaderSymbol, {
					enumerable: false,
					configurable: false,
					get() {
						return internalContext.responseHeaders
					},
				})
			throw e
		}
	}
	internalHandler.options =
		typeof optionsOrHandler === 'function' ? {} : optionsOrHandler
	return internalHandler
}
createMiddleware.create = opts => {
	function fn(optionsOrHandler, handler) {
		if (typeof optionsOrHandler === 'function')
			return createMiddleware({ use: opts?.use }, optionsOrHandler)
		if (!handler) throw new Error('Middleware handler is required')
		return createMiddleware(
			{
				...optionsOrHandler,
				method: '*',
				use: [...(opts?.use || []), ...(optionsOrHandler.use || [])],
			},
			handler,
		)
	}
	return fn
}
//#endregion
//#region ../../node_modules/.bun/@better-auth+core@1.5.5+4487f4f11a98ab19/node_modules/@better-auth/core/dist/api/index.mjs
const optionsMiddleware = createMiddleware(async () => {
	/**
	 * This will be passed on the instance of
	 * the context. Used to infer the type
	 * here.
	 */
	return {}
})
const createAuthMiddleware = createMiddleware.create({
	use: [
		optionsMiddleware,
		createMiddleware(async () => {
			return {}
		}),
	],
})
//#endregion
//#region ../../node_modules/.bun/@better-auth+expo@1.5.5+f0111e2b98ef3aae/node_modules/@better-auth/expo/dist/index.js
const expoAuthorizationProxy = createAuthEndpoint(
	'/expo-authorization-proxy',
	{
		method: 'GET',
		query: z$3.object({
			authorizationURL: z$3.string(),
			oauthState: z$3.string().optional(),
		}),
		metadata: HIDE_METADATA,
	},
	async ctx => {
		const { oauthState } = ctx.query
		if (oauthState) {
			const oauthStateCookie = ctx.context.createAuthCookie('oauth_state', {
				maxAge: 600,
			})
			ctx.setCookie(
				oauthStateCookie.name,
				oauthState,
				oauthStateCookie.attributes,
			)
			return ctx.redirect(ctx.query.authorizationURL)
		}
		const { authorizationURL } = ctx.query
		const state = new URL(authorizationURL).searchParams.get('state')
		if (!state)
			throw new APIError('BAD_REQUEST', { message: 'Unexpected error' })
		const stateCookie = ctx.context.createAuthCookie('state', { maxAge: 300 })
		await ctx.setSignedCookie(
			stateCookie.name,
			state,
			ctx.context.secret,
			stateCookie.attributes,
		)
		return ctx.redirect(ctx.query.authorizationURL)
	},
)
const expo = options => {
	return {
		id: 'expo',
		init: ctx => {
			return {
				options: {
					trustedOrigins:
						process.env.NODE_ENV === 'development' ? ['exp://'] : [],
				},
			}
		},
		async onRequest(request, ctx) {
			if (options?.disableOriginOverride || request.headers.get('origin'))
				return
			/**
			 * To bypass origin check from expo, we need to set the origin
			 * header to the expo-origin header
			 */
			const expoOrigin = request.headers.get('expo-origin')
			if (!expoOrigin) return
			try {
				request.headers.set('origin', expoOrigin)
				return { request }
			} catch {
				const newHeaders = new Headers(request.headers)
				newHeaders.set('origin', expoOrigin)
				return { request: new Request(request, { headers: newHeaders }) }
			}
		},
		hooks: {
			after: [
				{
					matcher(context) {
						return !!(
							context.path?.startsWith('/callback') ||
							context.path?.startsWith('/oauth2/callback') ||
							context.path?.startsWith('/magic-link/verify') ||
							context.path?.startsWith('/verify-email')
						)
					},
					handler: createAuthMiddleware(async ctx => {
						const headers = ctx.context.responseHeaders
						const location = headers?.get('location')
						if (!location) return
						if (location.includes('/oauth-proxy-callback')) return
						let redirectURL
						try {
							redirectURL = new URL(location)
						} catch {
							return
						}
						if (
							redirectURL.protocol === 'http:' ||
							redirectURL.protocol === 'https:'
						)
							return
						if (!ctx.context.isTrustedOrigin(location)) return
						const cookie = headers?.get('set-cookie')
						if (!cookie) return
						redirectURL.searchParams.set('cookie', cookie)
						ctx.setHeader('location', redirectURL.toString())
					}),
				},
			],
		},
		endpoints: { expoAuthorizationProxy },
		options,
	}
}
//#endregion
//#region ../../node_modules/.bun/@t3-oss+env-core@0.13.11+dcb9db7a51b27bde/node_modules/@t3-oss/env-core/dist/standard.js
function ensureSynchronous(value, message) {
	if (value instanceof Promise) throw new Error(message)
}
function parseWithDictionary(dictionary, value) {
	const result = {}
	const issues = []
	for (const key in dictionary) {
		const propResult = dictionary[key]['~standard'].validate(value[key])
		ensureSynchronous(
			propResult,
			`Validation must be synchronous, but ${key} returned a Promise.`,
		)
		if (propResult.issues) {
			issues.push(
				...propResult.issues.map(issue => ({
					...issue,
					message: issue.message,
					path: [key, ...(issue.path ?? [])],
				})),
			)
			continue
		}
		result[key] = propResult.value
	}
	if (issues.length) return { issues }
	return { value: result }
}
//#endregion
//#region ../../node_modules/.bun/@t3-oss+env-core@0.13.11+dcb9db7a51b27bde/node_modules/@t3-oss/env-core/dist/index.js
/**
 * Create a new environment variable schema.
 */
function createEnv(opts) {
	const runtimeEnv = opts.runtimeEnvStrict ?? opts.runtimeEnv ?? process.env
	if (opts.emptyStringAsUndefined ?? false) {
		for (const [key, value] of Object.entries(runtimeEnv))
			if (value === '') delete runtimeEnv[key]
	}
	if (opts.skipValidation) {
		if (opts.extends)
			for (const preset of opts.extends) preset.skipValidation = true
		return runtimeEnv
	}
	const _client = typeof opts.client === 'object' ? opts.client : {}
	const _server = typeof opts.server === 'object' ? opts.server : {}
	const _shared = typeof opts.shared === 'object' ? opts.shared : {}
	const isServer =
		opts.isServer ?? (typeof window === 'undefined' || 'Deno' in window)
	const finalSchemaShape = isServer
		? {
				..._server,
				..._shared,
				..._client,
			}
		: {
				..._client,
				..._shared,
			}
	const parsed =
		opts
			.createFinalSchema?.(finalSchemaShape, isServer)
			?.['~standard'].validate(runtimeEnv) ??
		parseWithDictionary(finalSchemaShape, runtimeEnv)
	ensureSynchronous(parsed, 'Validation must be synchronous')
	const onValidationError =
		opts.onValidationError ??
		(issues => {
			console.error('❌ Invalid environment variables:', issues)
			throw new Error('Invalid environment variables')
		})
	const onInvalidAccess =
		opts.onInvalidAccess ??
		(() => {
			throw new Error(
				'❌ Attempted to access a server-side environment variable on the client',
			)
		})
	if (parsed.issues) return onValidationError(parsed.issues)
	const isServerAccess = prop => {
		if (!opts.clientPrefix) return true
		return !prop.startsWith(opts.clientPrefix) && !(prop in _shared)
	}
	const isValidServerAccess = prop => {
		return isServer || !isServerAccess(prop)
	}
	const ignoreProp = prop => {
		return prop === '__esModule' || prop === '$$typeof'
	}
	const extendedObj = (opts.extends ?? []).reduce((acc, curr) => {
		return Object.assign(acc, curr)
	}, {})
	const fullObj = Object.assign(extendedObj, parsed.value)
	return new Proxy(fullObj, {
		get(target, prop) {
			if (typeof prop !== 'string') return void 0
			if (ignoreProp(prop)) return void 0
			if (!isValidServerAccess(prop)) return onInvalidAccess(prop)
			return Reflect.get(target, prop)
		},
	})
}
//#endregion
//#region ../../packages/env/src/server.ts
const env$1 = createEnv({
	server: {
		DATABASE_URL: z.string().min(1),
		BETTER_AUTH_SECRET: z.string().min(32),
		BETTER_AUTH_URL: z.url(),
		CORS_ORIGIN: z.url(),
		REGION: z.string().min(1).default('us-east-1'),
		S3URL: z.string().min(1),
		ACCESSKEY_ID: z.string().min(1),
		SECRET_ACCESS_KEY: z.string().min(1),
		NODE_ENV: z
			.enum(['development', 'production', 'test'])
			.default('development'),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
//#endregion
//#region ../../packages/db/src/schema/auth.ts
var auth_exports = /* @__PURE__ */ __exportAll({
	account: () => account,
	session: () => session,
	user: () => user,
	verification: () => verification,
})
const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})
const session = pgTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: timestamp('expires_at').notNull(),
		token: text('token').notNull().unique(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
	},
	table => [index('session_userId_idx').on(table.userId)],
)
const account = pgTable(
	'account',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at'),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
		scope: text('scope'),
		password: text('password'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	table => [index('account_userId_idx').on(table.userId)],
)
const verification = pgTable(
	'verification',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	table => [index('verification_identifier_idx').on(table.identifier)],
)
//#endregion
//#region ../../packages/db/src/schema/favorites.ts
const favorites = pgTable('favorites', {
	id: uuid('id').defaultRandom().primaryKey(),
	file: uuid('file').notNull(),
	user: text('user').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})
//#endregion
//#region ../../packages/db/src/schema/files.ts
const file = pgTable('file', {
	id: uuid('id').defaultRandom().primaryKey(),
	user: text('user').notNull(),
	name: text('name').notNull(),
	type: text('type').notNull(),
	key: text('key').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})
//#endregion
//#region ../../packages/db/src/schema/organization.ts
const organization$1 = pgTable(
	'organization',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		slug: text('slug').notNull().unique(),
		logo: text('logo'),
		createdAt: timestamp('created_at').notNull(),
		metadata: text('metadata'),
	},
	table => [uniqueIndex('organization_slug_uidx').on(table.slug)],
)
const member = pgTable(
	'member',
	{
		id: text('id').primaryKey(),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization$1.id, { onDelete: 'cascade' }),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		role: text('role').default('member').notNull(),
		createdAt: timestamp('created_at').notNull(),
	},
	table => [
		index('member_organizationId_idx').on(table.organizationId),
		index('member_userId_idx').on(table.userId),
	],
)
const invitation = pgTable(
	'invitation',
	{
		id: text('id').primaryKey(),
		organizationId: text('organization_id')
			.notNull()
			.references(() => organization$1.id, { onDelete: 'cascade' }),
		email: text('email').notNull(),
		role: text('role'),
		status: text('status').default('pending').notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		inviterId: text('inviter_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
	},
	table => [
		index('invitation_organizationId_idx').on(table.organizationId),
		index('invitation_email_idx').on(table.email),
	],
)
//#endregion
//#region ../../packages/db/src/schema/trash.ts
const trash = pgTable('trash', {
	id: uuid('id').defaultRandom().primaryKey(),
	file: uuid('file').notNull(),
	user: text('user').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})
//#endregion
//#region ../../packages/db/src/schema/relations.ts
const fileRelations = relations(file, ({ one }) => ({
	user: one(user, {
		fields: [file.user],
		references: [user.id],
	}),
}))
const trashRelations = relations(trash, ({ one }) => ({
	user: one(user, {
		fields: [trash.user],
		references: [user.id],
	}),
	file: one(file, {
		fields: [trash.file],
		references: [file.id],
	}),
}))
const favoritesRelations = relations(favorites, ({ one }) => ({
	user: one(user, {
		fields: [favorites.user],
		references: [user.id],
	}),
	file: one(file, {
		fields: [favorites.file],
		references: [file.id],
	}),
}))
const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	files: many(file),
}))
const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}))
const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}))
const organizationRelations = relations(organization$1, ({ many }) => ({
	members: many(member),
	invitations: many(invitation),
}))
const memberRelations = relations(member, ({ one }) => ({
	organization: one(organization$1, {
		fields: [member.organizationId],
		references: [organization$1.id],
	}),
	user: one(user, {
		fields: [member.userId],
		references: [user.id],
	}),
}))
const invitationRelations = relations(invitation, ({ one }) => ({
	organization: one(organization$1, {
		fields: [invitation.organizationId],
		references: [organization$1.id],
	}),
	user: one(user, {
		fields: [invitation.inviterId],
		references: [user.id],
	}),
}))
//#endregion
//#region ../../packages/db/src/schema/todo.ts
const todo = pgTable('todo', {
	id: serial('id').primaryKey(),
	text: text('text').notNull(),
	completed: boolean('completed').default(false).notNull(),
})
//#endregion
//#region ../../packages/db/src/schema/index.ts
var schema_exports = /* @__PURE__ */ __exportAll({
	account: () => account,
	accountRelations: () => accountRelations,
	favorites: () => favorites,
	favoritesRelations: () => favoritesRelations,
	file: () => file,
	fileRelations: () => fileRelations,
	invitation: () => invitation,
	invitationRelations: () => invitationRelations,
	member: () => member,
	memberRelations: () => memberRelations,
	organization: () => organization$1,
	organizationRelations: () => organizationRelations,
	session: () => session,
	sessionRelations: () => sessionRelations,
	todo: () => todo,
	trash: () => trash,
	trashRelations: () => trashRelations,
	user: () => user,
	userRelations: () => userRelations,
	verification: () => verification,
})
//#endregion
//#region ../../packages/db/src/index.ts
function createDb() {
	return drizzle(env$1.DATABASE_URL, { schema: schema_exports })
}
const db = createDb()
//#endregion
//#region ../../packages/auth/src/index.ts
function createAuth() {
	return betterAuth({
		database: drizzleAdapter(createDb(), {
			provider: 'pg',
			schema: auth_exports,
		}),
		trustedOrigins: [
			env$1.CORS_ORIGIN,
			'file-drive://',
			...(env$1.NODE_ENV === 'development'
				? [
						'exp://',
						'exp://**',
						'exp://192.168.*.*:*/**',
						'http://localhost:8081',
					]
				: []),
		],
		emailAndPassword: { enabled: true },
		secret: env$1.BETTER_AUTH_SECRET,
		baseURL: env$1.BETTER_AUTH_URL,
		advanced: {
			defaultCookieAttributes: {
				sameSite: 'none',
				secure: true,
				httpOnly: true,
			},
		},
		plugins: [expo(), organization()],
	})
}
const auth = createAuth()
//#endregion
//#region ../../packages/api/src/context.ts
async function createContext({ context }) {
	return {
		auth: null,
		session: await auth.api.getSession({ headers: context.req.raw.headers }),
	}
}
//#endregion
//#region ../../packages/api/src/index.ts
const t = initTRPC.context().create()
const router = t.router
const publicProcedure = t.procedure
const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session)
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Authentication required',
			cause: 'No session',
		})
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
			userId: ctx.session.user.id,
		},
	})
})
//#endregion
//#region ../../packages/api/src/routers/favorites.ts
const favoritesRouter = router({
	list_ids: protectedProcedure.query(async ({ ctx: { userId } }) => {
		return (
			await db
				.select({ file: favorites.file })
				.from(favorites)
				.where(eq(favorites.user, userId))
		).map(file => file.file)
	}),
	list_files: protectedProcedure.query(async ({ ctx: { userId } }) => {
		return await db
			.select()
			.from(favorites)
			.innerJoin(file, eq(favorites.file, file.id))
			.where(eq(favorites.user, userId))
	}),
	add: protectedProcedure
		.input(z$1.string())
		.mutation(async ({ ctx: { userId }, input }) => {
			if (
				(
					await db
						.select({ file: favorites.file })
						.from(favorites)
						.where(and(eq(favorites.user, userId), eq(favorites.file, input)))
						.limit(1)
				)[0]
			)
				return
			return await db.insert(favorites).values({
				user: userId,
				file: input,
			})
		}),
	remove: protectedProcedure
		.input(z$1.object({ ids: z$1.array(z$1.string()) }))
		.mutation(async ({ ctx: { userId }, input: { ids } }) => {
			return await Promise.all(
				ids.map(async id => {
					return await db
						.delete(favorites)
						.where(and(eq(favorites.file, id), eq(favorites.user, userId)))
				}),
			)
		}),
})
//#endregion
//#region ../../node_modules/.bun/drizzle-zod@0.8.3+e082846ef4c7016e/node_modules/drizzle-zod/index.mjs
const CONSTANTS = {
	INT8_MIN: -128,
	INT8_MAX: 127,
	INT8_UNSIGNED_MAX: 255,
	INT16_MIN: -32768,
	INT16_MAX: 32767,
	INT16_UNSIGNED_MAX: 65535,
	INT24_MIN: -8388608,
	INT24_MAX: 8388607,
	INT24_UNSIGNED_MAX: 16777215,
	INT32_MIN: -2147483648,
	INT32_MAX: 2147483647,
	INT32_UNSIGNED_MAX: 4294967295,
	INT48_MIN: -0x800000000000,
	INT48_MAX: 0x7fffffffffff,
	INT48_UNSIGNED_MAX: 0xffffffffffff,
	INT64_MIN: -9223372036854775808n,
	INT64_MAX: 9223372036854775807n,
	INT64_UNSIGNED_MAX: 18446744073709551615n,
}
function isColumnType(column, columnTypes) {
	return columnTypes.includes(column.columnType)
}
function isWithEnum(column) {
	return (
		'enumValues' in column &&
		Array.isArray(column.enumValues) &&
		column.enumValues.length > 0
	)
}
const literalSchema = z$2.union([
	z$2.string(),
	z$2.number(),
	z$2.boolean(),
	z$2.null(),
])
const jsonSchema = z$2.union([
	literalSchema,
	z$2.record(z$2.string(), z$2.any()),
	z$2.array(z$2.any()),
])
const bufferSchema = z$2.custom(v => v instanceof Buffer)
function columnToSchema(column, factory) {
	const z$1 = factory?.zodInstance ?? z$2
	const coerce = factory?.coerce ?? {}
	let schema
	if (isWithEnum(column))
		schema = column.enumValues.length
			? z$1.enum(column.enumValues)
			: z$1.string()
	if (!schema) {
		if (isColumnType(column, ['PgGeometry', 'PgPointTuple']))
			schema = z$1.tuple([z$1.number(), z$1.number()])
		else if (isColumnType(column, ['PgGeometryObject', 'PgPointObject']))
			schema = z$1.object({
				x: z$1.number(),
				y: z$1.number(),
			})
		else if (isColumnType(column, ['PgHalfVector', 'PgVector'])) {
			schema = z$1.array(z$1.number())
			schema = column.dimensions ? schema.length(column.dimensions) : schema
		} else if (isColumnType(column, ['PgLine']))
			schema = z$1.tuple([z$1.number(), z$1.number(), z$1.number()])
		else if (isColumnType(column, ['PgLineABC']))
			schema = z$1.object({
				a: z$1.number(),
				b: z$1.number(),
				c: z$1.number(),
			})
		else if (isColumnType(column, ['PgArray'])) {
			schema = z$1.array(columnToSchema(column.baseColumn, factory))
			schema = column.size ? schema.length(column.size) : schema
		} else if (column.dataType === 'array') schema = z$1.array(z$1.any())
		else if (column.dataType === 'number')
			schema = numberColumnToSchema(column, z$1, coerce)
		else if (column.dataType === 'bigint')
			schema = bigintColumnToSchema(column, z$1, coerce)
		else if (column.dataType === 'boolean')
			schema =
				coerce === true || coerce.boolean ? z$1.coerce.boolean() : z$1.boolean()
		else if (column.dataType === 'date')
			schema = coerce === true || coerce.date ? z$1.coerce.date() : z$1.date()
		else if (column.dataType === 'string')
			schema = stringColumnToSchema(column, z$1, coerce)
		else if (column.dataType === 'json') schema = jsonSchema
		else if (column.dataType === 'custom') schema = z$1.any()
		else if (column.dataType === 'buffer') schema = bufferSchema
	}
	if (!schema) schema = z$1.any()
	return schema
}
function numberColumnToSchema(column, z, coerce) {
	let unsigned = column.getSQLType().includes('unsigned')
	let min
	let max
	let integer = false
	if (isColumnType(column, ['MySqlTinyInt', 'SingleStoreTinyInt'])) {
		min = unsigned ? 0 : CONSTANTS.INT8_MIN
		max = unsigned ? CONSTANTS.INT8_UNSIGNED_MAX : CONSTANTS.INT8_MAX
		integer = true
	} else if (
		isColumnType(column, [
			'PgSmallInt',
			'PgSmallSerial',
			'MySqlSmallInt',
			'SingleStoreSmallInt',
		])
	) {
		min = unsigned ? 0 : CONSTANTS.INT16_MIN
		max = unsigned ? CONSTANTS.INT16_UNSIGNED_MAX : CONSTANTS.INT16_MAX
		integer = true
	} else if (
		isColumnType(column, [
			'PgReal',
			'MySqlFloat',
			'MySqlMediumInt',
			'SingleStoreMediumInt',
			'SingleStoreFloat',
		])
	) {
		min = unsigned ? 0 : CONSTANTS.INT24_MIN
		max = unsigned ? CONSTANTS.INT24_UNSIGNED_MAX : CONSTANTS.INT24_MAX
		integer = isColumnType(column, ['MySqlMediumInt', 'SingleStoreMediumInt'])
	} else if (
		isColumnType(column, [
			'PgInteger',
			'PgSerial',
			'MySqlInt',
			'SingleStoreInt',
		])
	) {
		min = unsigned ? 0 : CONSTANTS.INT32_MIN
		max = unsigned ? CONSTANTS.INT32_UNSIGNED_MAX : CONSTANTS.INT32_MAX
		integer = true
	} else if (
		isColumnType(column, [
			'PgDoublePrecision',
			'MySqlReal',
			'MySqlDouble',
			'SingleStoreReal',
			'SingleStoreDouble',
			'SQLiteReal',
		])
	) {
		min = unsigned ? 0 : CONSTANTS.INT48_MIN
		max = unsigned ? CONSTANTS.INT48_UNSIGNED_MAX : CONSTANTS.INT48_MAX
	} else if (
		isColumnType(column, [
			'PgBigInt53',
			'PgBigSerial53',
			'MySqlBigInt53',
			'MySqlSerial',
			'SingleStoreBigInt53',
			'SingleStoreSerial',
			'SQLiteInteger',
		])
	) {
		unsigned =
			unsigned || isColumnType(column, ['MySqlSerial', 'SingleStoreSerial'])
		min = unsigned ? 0 : Number.MIN_SAFE_INTEGER
		max = Number.MAX_SAFE_INTEGER
		integer = true
	} else if (isColumnType(column, ['MySqlYear', 'SingleStoreYear'])) {
		min = 1901
		max = 2155
		integer = true
	} else {
		min = Number.MIN_SAFE_INTEGER
		max = Number.MAX_SAFE_INTEGER
	}
	let schema =
		coerce === true || coerce?.number
			? integer
				? z.coerce.number()
				: z.coerce.number().int()
			: integer
				? z.int()
				: z.number()
	schema = schema.gte(min).lte(max)
	return schema
}
function bigintColumnToSchema(column, z, coerce) {
	const unsigned = column.getSQLType().includes('unsigned')
	const min = unsigned ? 0n : CONSTANTS.INT64_MIN
	const max = unsigned ? CONSTANTS.INT64_UNSIGNED_MAX : CONSTANTS.INT64_MAX
	return (coerce === true || coerce?.bigint ? z.coerce.bigint() : z.bigint())
		.gte(min)
		.lte(max)
}
function stringColumnToSchema(column, z, coerce) {
	if (isColumnType(column, ['PgUUID'])) return z.uuid()
	let max
	let regex
	let fixed = false
	if (isColumnType(column, ['PgVarchar', 'SQLiteText'])) max = column.length
	else if (isColumnType(column, ['MySqlVarChar', 'SingleStoreVarChar']))
		max = column.length ?? CONSTANTS.INT16_UNSIGNED_MAX
	else if (isColumnType(column, ['MySqlText', 'SingleStoreText']))
		if (column.textType === 'longtext') max = CONSTANTS.INT32_UNSIGNED_MAX
		else if (column.textType === 'mediumtext')
			max = CONSTANTS.INT24_UNSIGNED_MAX
		else if (column.textType === 'text') max = CONSTANTS.INT16_UNSIGNED_MAX
		else max = CONSTANTS.INT8_UNSIGNED_MAX
	if (isColumnType(column, ['PgChar', 'MySqlChar', 'SingleStoreChar'])) {
		max = column.length
		fixed = true
	}
	if (isColumnType(column, ['PgBinaryVector'])) {
		regex = /^[01]+$/
		max = column.dimensions
	}
	let schema =
		coerce === true || coerce?.string ? z.coerce.string() : z.string()
	schema = regex ? schema.regex(regex) : schema
	return max && fixed ? schema.length(max) : max ? schema.max(max) : schema
}
function getColumns(tableLike) {
	return isTable(tableLike)
		? getTableColumns(tableLike)
		: getViewSelectedFields(tableLike)
}
function handleColumns(columns, refinements, conditions, factory) {
	const columnSchemas = {}
	for (const [key, selected] of Object.entries(columns)) {
		if (
			!is(selected, Column) &&
			!is(selected, SQL) &&
			!is(selected, SQL.Aliased) &&
			typeof selected === 'object'
		) {
			columnSchemas[key] = handleColumns(
				isTable(selected) || isView(selected) ? getColumns(selected) : selected,
				refinements[key] ?? {},
				conditions,
				factory,
			)
			continue
		}
		const refinement = refinements[key]
		if (refinement !== void 0 && typeof refinement !== 'function') {
			columnSchemas[key] = refinement
			continue
		}
		const column = is(selected, Column) ? selected : void 0
		const schema = column ? columnToSchema(column, factory) : z$2.any()
		const refined =
			typeof refinement === 'function' ? refinement(schema) : schema
		if (conditions.never(column)) continue
		columnSchemas[key] = refined
		if (column) {
			if (conditions.nullable(column))
				columnSchemas[key] = columnSchemas[key].nullable()
			if (conditions.optional(column))
				columnSchemas[key] = columnSchemas[key].optional()
		}
	}
	return z$2.object(columnSchemas)
}
const insertConditions = {
	never: column =>
		column?.generated?.type === 'always' ||
		column?.generatedIdentity?.type === 'always',
	optional: column => !column.notNull || (column.notNull && column.hasDefault),
	nullable: column => !column.notNull,
}
const createInsertSchema = (entity, refine) => {
	return handleColumns(getColumns(entity), refine ?? {}, insertConditions)
}
//#endregion
//#region ../../packages/api/src/routers/files.ts
const fileRouter = router({
	list: protectedProcedure.query(async ({ ctx: { userId } }) => {
		const trashFiles = (
			await db
				.select({ file: trash.file })
				.from(trash)
				.where(eq(trash.user, userId))
		).map(trash => trash.file)
		return (await db.select().from(file).where(eq(file.user, userId))).filter(
			file => !trashFiles.includes(file.id),
		)
	}),
	create: protectedProcedure
		.input(createInsertSchema(file).omit({ user: true }))
		.mutation(async ({ ctx: { userId }, input }) => {
			return await db.insert(file).values({
				...input,
				user: userId,
			})
		}),
	delete: protectedProcedure
		.input(z$1.object({ ids: z$1.array(z$1.string()) }))
		.mutation(async ({ ctx: { userId }, input }) => {
			return await db
				.delete(file)
				.where(and(inArray(file.id, input.ids), eq(file.user, userId)))
		}),
})
//#endregion
//#region ../../packages/api/src/routers/todo.ts
const todoRouter = router({
	getAll: publicProcedure.query(async () => {
		return await db.select().from(todo)
	}),
	create: publicProcedure
		.input(z$1.object({ text: z$1.string().min(1) }))
		.mutation(async ({ input }) => {
			return await db.insert(todo).values({ text: input.text })
		}),
	toggle: publicProcedure
		.input(
			z$1.object({
				id: z$1.number(),
				completed: z$1.boolean(),
			}),
		)
		.mutation(async ({ input }) => {
			return await db
				.update(todo)
				.set({ completed: input.completed })
				.where(eq(todo.id, input.id))
		}),
	delete: publicProcedure
		.input(z$1.object({ id: z$1.number() }))
		.mutation(async ({ input }) => {
			return await db.delete(todo).where(eq(todo.id, input.id))
		}),
})
//#endregion
//#region ../../packages/api/src/routers/trash.ts
const trashRouter = router({
	list_ids: protectedProcedure.query(async ({ ctx: { userId } }) => {
		return (
			await db
				.select({ file: trash.file })
				.from(trash)
				.where(eq(trash.user, userId))
		).map(file => file.file)
	}),
	list_files: protectedProcedure.query(async ({ ctx: { userId } }) => {
		return await db
			.select({ file })
			.from(trash)
			.innerJoin(file, eq(trash.file, file.id))
			.where(eq(trash.user, userId))
	}),
	add: protectedProcedure
		.input(z$1.object({ ids: z$1.array(z$1.string()) }))
		.mutation(async ({ ctx: { userId }, input: { ids } }) => {
			await new Promise(res => setTimeout(res, 3e3))
			return await Promise.all(
				ids.map(async id => {
					console.log('moving to trash', id)
					if (
						(
							await db.select().from(trash).where(eq(trash.file, id)).limit(1)
						)[0]
					) {
						console.log('file already exits in trash')
						return
					}
					return await db.insert(trash).values({
						file: id,
						user: userId,
					})
				}),
			)
		}),
	restore: protectedProcedure
		.input(z$1.object({ ids: z$1.array(z$1.string()) }))
		.mutation(async ({ ctx: { userId }, input: { ids } }) => {
			return await Promise.all(
				ids.map(
					async id =>
						await db
							.delete(trash)
							.where(and(eq(trash.file, id), eq(trash.user, userId))),
				),
			)
		}),
})
//#endregion
//#region ../../packages/api/src/routers/index.ts
const appRouter = router({
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
//#endregion
//#region src/proxy.ts
const app$2 = new Hono().get('/:path{.+}', c => {
	const filePath = c.req.param('path')
	return proxy(`${env$1.S3URL}/file-drive/${filePath}`, c.req)
})
//#endregion
//#region ../../packages/env/src/s3.ts
const env = createEnv({
	server: {
		REGION: z.string().min(1).default('auto'),
		S3URL: z.string().min(1),
		BUCKET: z.string().min(1),
		ACCESSKEY_ID: z.string().min(1),
		SECRET_ACCESS_KEY: z.string().min(1),
		NODE_ENV: z
			.enum(['development', 'production', 'test'])
			.default('development'),
	},
	runtimeEnv: process.env,
	emptyStringAsUndefined: true,
})
//#endregion
//#region ../../packages/s3/src/index.ts
const getS3Client = () =>
	new S3Client({
		region: env.REGION,
		endpoint: env.S3URL,
		credentials: {
			accessKeyId: env.ACCESSKEY_ID,
			secretAccessKey: env.SECRET_ACCESS_KEY,
		},
		forcePathStyle: true,
	})
async function uploadFile({
	userId,
	fileName,
	file,
	client,
	contentType,
	bucket,
}) {
	const key = `${userId}/${fileName}`
	await client.send(
		new PutObjectCommand({
			Bucket: bucket,
			Key: key,
			Body: file,
			ContentType: contentType,
		}),
	)
	return key
}
//#endregion
//#region src/upload.ts
const s3Client = getS3Client()
const app$1 = new Hono()
	.use('/', async (c, next) => {
		const token = c.req.header('Authorization')
		if (!token) return c.json({ error: 'unauthorized' }, 401)
		const session$1 = (
			await db.select().from(session).where(eq(session.token, token)).limit(1)
		)[0]
		c.set('userId', session$1?.userId ?? null)
		return await next()
	})
	.post(
		'/',
		zValidator(
			'header',
			z$1.object({
				contentType: z$1.string(),
				fileName: z$1.string(),
			}),
		),
		async c => {
			const userId = c.get('userId')
			if (!userId) return c.json({ error: 'unauthorized' }, 401)
			const arrayBuffer = await c.req.arrayBuffer()
			const { contentType, fileName } = c.req.valid('header')
			const key = await uploadFile({
				contentType,
				fileName,
				file: new Uint8Array(arrayBuffer),
				client: s3Client,
				userId,
				bucket: env.BUCKET,
			})
			return c.json({ key })
		},
	)
//#endregion
//#region src/index.ts
const app = new Hono()
	.use(logger())
	.use(
		'/api/*',
		cors({
			origin: env$1.CORS_ORIGIN,
			allowMethods: ['GET', 'POST', 'OPTIONS'],
			allowHeaders: ['Content-Type', 'Authorization'],
			credentials: true,
		}),
	)
	.on(['POST', 'GET'], '/api/auth/*', c => auth.handler(c.req.raw))
	.use(
		'/trpc/*',
		trpcServer({
			router: appRouter,
			createContext: (_opts, context) => {
				return createContext({ context })
			},
		}),
	)
	.route('/upload', app$1)
	.route('/file-drive', app$2)
	.get('*', serveStatic({ root: '../web/dist' }))
	.get('*', serveStatic({ path: '../web/dist/index.html' }))
Bun.serve({
	fetch: app.fetch,
	port: 3e3,
	hostname: '0.0.0.0',
})
