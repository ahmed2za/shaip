"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/api/auth/[...nextauth]";
exports.ids = ["pages/api/auth/[...nextauth]"];
exports.modules = {

/***/ "@next-auth/prisma-adapter":
/*!********************************************!*\
  !*** external "@next-auth/prisma-adapter" ***!
  \********************************************/
/***/ ((module) => {

module.exports = require("@next-auth/prisma-adapter");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "bcryptjs":
/*!***************************!*\
  !*** external "bcryptjs" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "next-auth":
/*!****************************!*\
  !*** external "next-auth" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("next-auth");

/***/ }),

/***/ "next-auth/providers/apple":
/*!********************************************!*\
  !*** external "next-auth/providers/apple" ***!
  \********************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers/apple");

/***/ }),

/***/ "next-auth/providers/credentials":
/*!**************************************************!*\
  !*** external "next-auth/providers/credentials" ***!
  \**************************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers/credentials");

/***/ }),

/***/ "next-auth/providers/facebook":
/*!***********************************************!*\
  !*** external "next-auth/providers/facebook" ***!
  \***********************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers/facebook");

/***/ }),

/***/ "next-auth/providers/google":
/*!*********************************************!*\
  !*** external "next-auth/providers/google" ***!
  \*********************************************/
/***/ ((module) => {

module.exports = require("next-auth/providers/google");

/***/ }),

/***/ "next/dist/compiled/next-server/pages-api.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages-api.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages-api.runtime.dev.js");

/***/ }),

/***/ "(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2F%5B...nextauth%5D&preferredRegion=&absolutePagePath=.%2Fsrc%5Cpages%5Capi%5Cauth%5C%5B...nextauth%5D.ts&middlewareConfigBase64=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2F%5B...nextauth%5D&preferredRegion=&absolutePagePath=.%2Fsrc%5Cpages%5Capi%5Cauth%5C%5B...nextauth%5D.ts&middlewareConfigBase64=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   config: () => (/* binding */ config),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__),\n/* harmony export */   routeModule: () => (/* binding */ routeModule)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/pages-api/module.compiled */ \"(api)/./node_modules/next/dist/server/future/route-modules/pages-api/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(api)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/build/templates/helpers */ \"(api)/./node_modules/next/dist/build/templates/helpers.js\");\n/* harmony import */ var _src_pages_api_auth_nextauth_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src\\pages\\api\\auth\\[...nextauth].ts */ \"(api)/./src/pages/api/auth/[...nextauth].ts\");\n\n\n\n// Import the userland code.\n\n// Re-export the handler (should be the default export).\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_src_pages_api_auth_nextauth_ts__WEBPACK_IMPORTED_MODULE_3__, \"default\"));\n// Re-export config.\nconst config = (0,next_dist_build_templates_helpers__WEBPACK_IMPORTED_MODULE_2__.hoist)(_src_pages_api_auth_nextauth_ts__WEBPACK_IMPORTED_MODULE_3__, \"config\");\n// Create and export the route module that will be consumed.\nconst routeModule = new next_dist_server_future_route_modules_pages_api_module_compiled__WEBPACK_IMPORTED_MODULE_0__.PagesAPIRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.PAGES_API,\n        page: \"/api/auth/[...nextauth]\",\n        pathname: \"/api/auth/[...nextauth]\",\n        // The following aren't used in production.\n        bundlePath: \"\",\n        filename: \"\"\n    },\n    userland: _src_pages_api_auth_nextauth_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n\n//# sourceMappingURL=pages-api.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LXJvdXRlLWxvYWRlci9pbmRleC5qcz9raW5kPVBBR0VTX0FQSSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCZwcmVmZXJyZWRSZWdpb249JmFic29sdXRlUGFnZVBhdGg9LiUyRnNyYyU1Q3BhZ2VzJTVDYXBpJTVDYXV0aCU1QyU1Qi4uLm5leHRhdXRoJTVELnRzJm1pZGRsZXdhcmVDb25maWdCYXNlNjQ9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNMO0FBQzFEO0FBQ3NFO0FBQ3RFO0FBQ0EsaUVBQWUsd0VBQUssQ0FBQyw0REFBUSxZQUFZLEVBQUM7QUFDMUM7QUFDTyxlQUFlLHdFQUFLLENBQUMsNERBQVE7QUFDcEM7QUFDTyx3QkFBd0IsZ0hBQW1CO0FBQ2xEO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLFlBQVk7QUFDWixDQUFDOztBQUVEIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWlzZGFxaWEvP2Q3M2EiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFnZXNBUElSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL3BhZ2VzLWFwaS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBob2lzdCB9IGZyb20gXCJuZXh0L2Rpc3QvYnVpbGQvdGVtcGxhdGVzL2hlbHBlcnNcIjtcbi8vIEltcG9ydCB0aGUgdXNlcmxhbmQgY29kZS5cbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIuL3NyY1xcXFxwYWdlc1xcXFxhcGlcXFxcYXV0aFxcXFxbLi4ubmV4dGF1dGhdLnRzXCI7XG4vLyBSZS1leHBvcnQgdGhlIGhhbmRsZXIgKHNob3VsZCBiZSB0aGUgZGVmYXVsdCBleHBvcnQpLlxuZXhwb3J0IGRlZmF1bHQgaG9pc3QodXNlcmxhbmQsIFwiZGVmYXVsdFwiKTtcbi8vIFJlLWV4cG9ydCBjb25maWcuXG5leHBvcnQgY29uc3QgY29uZmlnID0gaG9pc3QodXNlcmxhbmQsIFwiY29uZmlnXCIpO1xuLy8gQ3JlYXRlIGFuZCBleHBvcnQgdGhlIHJvdXRlIG1vZHVsZSB0aGF0IHdpbGwgYmUgY29uc3VtZWQuXG5leHBvcnQgY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgUGFnZXNBUElSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuUEFHRVNfQVBJLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdXCIsXG4gICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgYXJlbid0IHVzZWQgaW4gcHJvZHVjdGlvbi5cbiAgICAgICAgYnVuZGxlUGF0aDogXCJcIixcbiAgICAgICAgZmlsZW5hbWU6IFwiXCJcbiAgICB9LFxuICAgIHVzZXJsYW5kXG59KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFnZXMtYXBpLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2F%5B...nextauth%5D&preferredRegion=&absolutePagePath=.%2Fsrc%5Cpages%5Capi%5Cauth%5C%5B...nextauth%5D.ts&middlewareConfigBase64=e30%3D!\n");

/***/ }),

/***/ "(api)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nlet prisma;\nif (false) {} else {\n    if (!global.prisma) {\n        global.prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n            log: [\n                \"query\",\n                \"error\",\n                \"warn\"\n            ]\n        });\n    }\n    prisma = global.prisma;\n}\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBOEM7QUFNOUMsSUFBSUM7QUFFSixJQUFJQyxLQUF5QixFQUFjLEVBRTFDLE1BQU07SUFDTCxJQUFJLENBQUNDLE9BQU9GLE1BQU0sRUFBRTtRQUNsQkUsT0FBT0YsTUFBTSxHQUFHLElBQUlELHdEQUFZQSxDQUFDO1lBQy9CSSxLQUFLO2dCQUFDO2dCQUFTO2dCQUFTO2FBQU87UUFDakM7SUFDRjtJQUNBSCxTQUFTRSxPQUFPRixNQUFNO0FBQ3hCO0FBRWtCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbWlzZGFxaWEvLi9zcmMvbGliL3ByaXNtYS50cz8wMWQ3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcblxuZGVjbGFyZSBnbG9iYWwge1xuICB2YXIgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWQ7XG59XG5cbmxldCBwcmlzbWE6IFByaXNtYUNsaWVudDtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgcHJpc21hID0gbmV3IFByaXNtYUNsaWVudCgpO1xufSBlbHNlIHtcbiAgaWYgKCFnbG9iYWwucHJpc21hKSB7XG4gICAgZ2xvYmFsLnByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoe1xuICAgICAgbG9nOiBbJ3F1ZXJ5JywgJ2Vycm9yJywgJ3dhcm4nXSxcbiAgICB9KTtcbiAgfVxuICBwcmlzbWEgPSBnbG9iYWwucHJpc21hO1xufVxuXG5leHBvcnQgeyBwcmlzbWEgfTtcbiJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWEiLCJwcm9jZXNzIiwiZ2xvYmFsIiwibG9nIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(api)/./src/lib/prisma.ts\n");

/***/ }),

/***/ "(api)/./src/pages/api/auth/[...nextauth].ts":
/*!*********************************************!*\
  !*** ./src/pages/api/auth/[...nextauth].ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"next-auth\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @next-auth/prisma-adapter */ \"@next-auth/prisma-adapter\");\n/* harmony import */ var _next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth/providers/google */ \"next-auth/providers/google\");\n/* harmony import */ var next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_auth_providers_facebook__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next-auth/providers/facebook */ \"next-auth/providers/facebook\");\n/* harmony import */ var next_auth_providers_facebook__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_facebook__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var next_auth_providers_apple__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next-auth/providers/apple */ \"next-auth/providers/apple\");\n/* harmony import */ var next_auth_providers_apple__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_apple__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next-auth/providers/credentials */ \"next-auth/providers/credentials\");\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/lib/prisma */ \"(api)/./src/lib/prisma.ts\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! bcryptjs */ \"bcryptjs\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_7__);\n\n\n\n\n\n\n\n\nconst authOptions = {\n    adapter: (0,_next_auth_prisma_adapter__WEBPACK_IMPORTED_MODULE_1__.PrismaAdapter)(_lib_prisma__WEBPACK_IMPORTED_MODULE_6__.prisma),\n    providers: [\n        next_auth_providers_google__WEBPACK_IMPORTED_MODULE_2___default()({\n            clientId: process.env.GOOGLE_ID || \"\",\n            clientSecret: process.env.GOOGLE_SECRET || \"\",\n            profile (profile) {\n                return {\n                    id: profile.sub,\n                    name: profile.name,\n                    email: profile.email,\n                    image: profile.picture,\n                    provider: \"google\",\n                    role: \"USER\"\n                };\n            }\n        }),\n        next_auth_providers_facebook__WEBPACK_IMPORTED_MODULE_3___default()({\n            clientId: process.env.FACEBOOK_ID || \"\",\n            clientSecret: process.env.FACEBOOK_SECRET || \"\",\n            profile (profile) {\n                return {\n                    id: profile.id,\n                    name: profile.name,\n                    email: profile.email,\n                    image: profile.picture.data.url,\n                    provider: \"facebook\",\n                    role: \"USER\"\n                };\n            }\n        }),\n        next_auth_providers_apple__WEBPACK_IMPORTED_MODULE_4___default()({\n            clientId: process.env.APPLE_ID || \"\",\n            clientSecret: process.env.APPLE_SECRET || \"\"\n        }),\n        next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_5___default()({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"text\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    throw new Error(\"البريد الإلكتروني وكلمة المرور مطلوبان\");\n                }\n                const user = await _lib_prisma__WEBPACK_IMPORTED_MODULE_6__.prisma.user.findUnique({\n                    where: {\n                        email: credentials.email\n                    },\n                    select: {\n                        id: true,\n                        email: true,\n                        name: true,\n                        image: true,\n                        role: true,\n                        password: true\n                    }\n                });\n                if (!user || !user.password) {\n                    throw new Error(\"البريد الإلكتروني غير مسجل\");\n                }\n                const isValid = await bcryptjs__WEBPACK_IMPORTED_MODULE_7___default().compare(credentials.password, user.password);\n                if (!isValid) {\n                    throw new Error(\"كلمة المرور غير صحيحة\");\n                }\n                return {\n                    id: user.id,\n                    email: user.email,\n                    name: user.name,\n                    image: user.image,\n                    role: user.role\n                };\n            }\n        })\n    ],\n    pages: {\n        signIn: \"/auth/signin\",\n        signOut: \"/auth/signout\",\n        error: \"/auth/error\",\n        verifyRequest: \"/auth/verify-request\"\n    },\n    callbacks: {\n        async jwt ({ token, user, account }) {\n            if (user) {\n                token.role = user.role;\n                token.id = user.id;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (session.user) {\n                session.user.role = token.role;\n                session.user.id = token.id;\n            }\n            return session;\n        }\n    },\n    session: {\n        strategy: \"jwt\"\n    },\n    secret: process.env.NEXTAUTH_SECRET\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (next_auth__WEBPACK_IMPORTED_MODULE_0___default()(authOptions));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFwaSkvLi9zcmMvcGFnZXMvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFzRDtBQUNJO0FBQ0Y7QUFDSTtBQUNOO0FBQ1k7QUFDNUI7QUFDUjtBQTRCdkIsTUFBTVEsY0FBK0I7SUFDMUNDLFNBQVNSLHdFQUFhQSxDQUFDSywrQ0FBTUE7SUFDN0JJLFdBQVc7UUFDVFIsaUVBQWNBLENBQUM7WUFDYlMsVUFBVUMsUUFBUUMsR0FBRyxDQUFDQyxTQUFTLElBQUk7WUFDbkNDLGNBQWNILFFBQVFDLEdBQUcsQ0FBQ0csYUFBYSxJQUFJO1lBQzNDQyxTQUFRQSxPQUFPO2dCQUNiLE9BQU87b0JBQ0xDLElBQUlELFFBQVFFLEdBQUc7b0JBQ2ZDLE1BQU1ILFFBQVFHLElBQUk7b0JBQ2xCQyxPQUFPSixRQUFRSSxLQUFLO29CQUNwQkMsT0FBT0wsUUFBUU0sT0FBTztvQkFDdEJDLFVBQVU7b0JBQ1ZDLE1BQU07Z0JBQ1I7WUFDRjtRQUNGO1FBQ0F0QixtRUFBZ0JBLENBQUM7WUFDZlEsVUFBVUMsUUFBUUMsR0FBRyxDQUFDYSxXQUFXLElBQUk7WUFDckNYLGNBQWNILFFBQVFDLEdBQUcsQ0FBQ2MsZUFBZSxJQUFJO1lBQzdDVixTQUFRQSxPQUFPO2dCQUNiLE9BQU87b0JBQ0xDLElBQUlELFFBQVFDLEVBQUU7b0JBQ2RFLE1BQU1ILFFBQVFHLElBQUk7b0JBQ2xCQyxPQUFPSixRQUFRSSxLQUFLO29CQUNwQkMsT0FBT0wsUUFBUU0sT0FBTyxDQUFDSyxJQUFJLENBQUNDLEdBQUc7b0JBQy9CTCxVQUFVO29CQUNWQyxNQUFNO2dCQUNSO1lBQ0Y7UUFDRjtRQUNBckIsZ0VBQWFBLENBQUM7WUFDWk8sVUFBVUMsUUFBUUMsR0FBRyxDQUFDaUIsUUFBUSxJQUFJO1lBQ2xDZixjQUFjSCxRQUFRQyxHQUFHLENBQUNrQixZQUFZLElBQUk7UUFDNUM7UUFDQTFCLHNFQUFtQkEsQ0FBQztZQUNsQmUsTUFBTTtZQUNOWSxhQUFhO2dCQUNYWCxPQUFPO29CQUFFWSxPQUFPO29CQUFTQyxNQUFNO2dCQUFPO2dCQUN0Q0MsVUFBVTtvQkFBRUYsT0FBTztvQkFBWUMsTUFBTTtnQkFBVztZQUNsRDtZQUNBLE1BQU1FLFdBQVVKLFdBQVc7Z0JBQ3pCLElBQUksQ0FBQ0EsYUFBYVgsU0FBUyxDQUFDVyxhQUFhRyxVQUFVO29CQUNqRCxNQUFNLElBQUlFLE1BQU07Z0JBQ2xCO2dCQUVBLE1BQU1DLE9BQU8sTUFBTWhDLCtDQUFNQSxDQUFDZ0MsSUFBSSxDQUFDQyxVQUFVLENBQUM7b0JBQ3hDQyxPQUFPO3dCQUFFbkIsT0FBT1csWUFBWVgsS0FBSztvQkFBQztvQkFDbENvQixRQUFRO3dCQUNOdkIsSUFBSTt3QkFDSkcsT0FBTzt3QkFDUEQsTUFBTTt3QkFDTkUsT0FBTzt3QkFDUEcsTUFBTTt3QkFDTlUsVUFBVTtvQkFDWjtnQkFDRjtnQkFFQSxJQUFJLENBQUNHLFFBQVEsQ0FBQ0EsS0FBS0gsUUFBUSxFQUFFO29CQUMzQixNQUFNLElBQUlFLE1BQU07Z0JBQ2xCO2dCQUVBLE1BQU1LLFVBQVUsTUFBTW5DLHVEQUFjLENBQUN5QixZQUFZRyxRQUFRLEVBQUVHLEtBQUtILFFBQVE7Z0JBRXhFLElBQUksQ0FBQ08sU0FBUztvQkFDWixNQUFNLElBQUlMLE1BQU07Z0JBQ2xCO2dCQUVBLE9BQU87b0JBQ0xuQixJQUFJb0IsS0FBS3BCLEVBQUU7b0JBQ1hHLE9BQU9pQixLQUFLakIsS0FBSztvQkFDakJELE1BQU1rQixLQUFLbEIsSUFBSTtvQkFDZkUsT0FBT2dCLEtBQUtoQixLQUFLO29CQUNqQkcsTUFBTWEsS0FBS2IsSUFBSTtnQkFDakI7WUFDRjtRQUNGO0tBQ0Q7SUFDRG1CLE9BQU87UUFDTEMsUUFBUTtRQUNSQyxTQUFTO1FBQ1RDLE9BQU87UUFDUEMsZUFBZTtJQUNqQjtJQUNBQyxXQUFXO1FBQ1QsTUFBTUMsS0FBSSxFQUFFQyxLQUFLLEVBQUViLElBQUksRUFBRWMsT0FBTyxFQUFFO1lBQ2hDLElBQUlkLE1BQU07Z0JBQ1JhLE1BQU0xQixJQUFJLEdBQUdhLEtBQUtiLElBQUk7Z0JBQ3RCMEIsTUFBTWpDLEVBQUUsR0FBR29CLEtBQUtwQixFQUFFO1lBQ3BCO1lBQ0EsT0FBT2lDO1FBQ1Q7UUFDQSxNQUFNRSxTQUFRLEVBQUVBLE9BQU8sRUFBRUYsS0FBSyxFQUFFO1lBQzlCLElBQUlFLFFBQVFmLElBQUksRUFBRTtnQkFDZmUsUUFBUWYsSUFBSSxDQUFTYixJQUFJLEdBQUcwQixNQUFNMUIsSUFBSTtnQkFDdEM0QixRQUFRZixJQUFJLENBQVNwQixFQUFFLEdBQUdpQyxNQUFNakMsRUFBRTtZQUNyQztZQUNBLE9BQU9tQztRQUNUO0lBQ0Y7SUFDQUEsU0FBUztRQUNQQyxVQUFVO0lBQ1o7SUFDQUMsUUFBUTNDLFFBQVFDLEdBQUcsQ0FBQzJDLGVBQWU7QUFDckMsRUFBRTtBQUVGLGlFQUFleEQsZ0RBQVFBLENBQUNRLFlBQVlBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9taXNkYXFpYS8uL3NyYy9wYWdlcy9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdLnRzPzUwYTEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE5leHRBdXRoLCB7IE5leHRBdXRoT3B0aW9ucyB9IGZyb20gJ25leHQtYXV0aCc7XG5pbXBvcnQgeyBQcmlzbWFBZGFwdGVyIH0gZnJvbSAnQG5leHQtYXV0aC9wcmlzbWEtYWRhcHRlcic7XG5pbXBvcnQgR29vZ2xlUHJvdmlkZXIgZnJvbSAnbmV4dC1hdXRoL3Byb3ZpZGVycy9nb29nbGUnO1xuaW1wb3J0IEZhY2Vib29rUHJvdmlkZXIgZnJvbSAnbmV4dC1hdXRoL3Byb3ZpZGVycy9mYWNlYm9vayc7XG5pbXBvcnQgQXBwbGVQcm92aWRlciBmcm9tICduZXh0LWF1dGgvcHJvdmlkZXJzL2FwcGxlJztcbmltcG9ydCBDcmVkZW50aWFsc1Byb3ZpZGVyIGZyb20gJ25leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHMnO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJztcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnO1xuaW1wb3J0IHsgSldUIH0gZnJvbSAnbmV4dC1hdXRoL2p3dCc7XG5cbmludGVyZmFjZSBFeHRlbmRlZFRva2VuIGV4dGVuZHMgSldUIHtcbiAgaWQ/OiBzdHJpbmc7XG4gIHJvbGU/OiAnQURNSU4nIHwgJ0NPTVBBTlknIHwgJ1VTRVInO1xufVxuXG4vLyBFeHRlbmQgTmV4dEF1dGggc2Vzc2lvbiBhbmQgdXNlciB0eXBlc1xuZGVjbGFyZSBtb2R1bGUgJ25leHQtYXV0aCcge1xuICBpbnRlcmZhY2UgU2Vzc2lvbiB7XG4gICAgdXNlcjoge1xuICAgICAgaWQ/OiBzdHJpbmdcbiAgICAgIG5hbWU/OiBzdHJpbmcgfCBudWxsXG4gICAgICBlbWFpbD86IHN0cmluZyB8IG51bGxcbiAgICAgIGltYWdlPzogc3RyaW5nIHwgbnVsbFxuICAgICAgcm9sZT86ICdBRE1JTicgfCAnQ09NUEFOWScgfCAnVVNFUidcbiAgICAgIHByb3ZpZGVyPzogc3RyaW5nXG4gICAgfTtcbiAgfVxuXG4gIGludGVyZmFjZSBVc2VyIHtcbiAgICBpZDogc3RyaW5nO1xuICAgIHJvbGU6ICdBRE1JTicgfCAnQ09NUEFOWScgfCAnVVNFUic7XG4gICAgcHJvdmlkZXI/OiBzdHJpbmc7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zOiBOZXh0QXV0aE9wdGlvbnMgPSB7XG4gIGFkYXB0ZXI6IFByaXNtYUFkYXB0ZXIocHJpc21hKSBhcyBhbnksXG4gIHByb3ZpZGVyczogW1xuICAgIEdvb2dsZVByb3ZpZGVyKHtcbiAgICAgIGNsaWVudElkOiBwcm9jZXNzLmVudi5HT09HTEVfSUQgfHwgJycsXG4gICAgICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LkdPT0dMRV9TRUNSRVQgfHwgJycsXG4gICAgICBwcm9maWxlKHByb2ZpbGUpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBpZDogcHJvZmlsZS5zdWIsXG4gICAgICAgICAgbmFtZTogcHJvZmlsZS5uYW1lLFxuICAgICAgICAgIGVtYWlsOiBwcm9maWxlLmVtYWlsLFxuICAgICAgICAgIGltYWdlOiBwcm9maWxlLnBpY3R1cmUsXG4gICAgICAgICAgcHJvdmlkZXI6ICdnb29nbGUnLFxuICAgICAgICAgIHJvbGU6ICdVU0VSJyxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfSksXG4gICAgRmFjZWJvb2tQcm92aWRlcih7XG4gICAgICBjbGllbnRJZDogcHJvY2Vzcy5lbnYuRkFDRUJPT0tfSUQgfHwgJycsXG4gICAgICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LkZBQ0VCT09LX1NFQ1JFVCB8fCAnJyxcbiAgICAgIHByb2ZpbGUocHJvZmlsZSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiBwcm9maWxlLmlkLFxuICAgICAgICAgIG5hbWU6IHByb2ZpbGUubmFtZSxcbiAgICAgICAgICBlbWFpbDogcHJvZmlsZS5lbWFpbCxcbiAgICAgICAgICBpbWFnZTogcHJvZmlsZS5waWN0dXJlLmRhdGEudXJsLFxuICAgICAgICAgIHByb3ZpZGVyOiAnZmFjZWJvb2snLFxuICAgICAgICAgIHJvbGU6ICdVU0VSJyxcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgfSksXG4gICAgQXBwbGVQcm92aWRlcih7XG4gICAgICBjbGllbnRJZDogcHJvY2Vzcy5lbnYuQVBQTEVfSUQgfHwgJycsXG4gICAgICBjbGllbnRTZWNyZXQ6IHByb2Nlc3MuZW52LkFQUExFX1NFQ1JFVCB8fCAnJyxcbiAgICB9KSxcbiAgICBDcmVkZW50aWFsc1Byb3ZpZGVyKHtcbiAgICAgIG5hbWU6ICdjcmVkZW50aWFscycsXG4gICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICBlbWFpbDogeyBsYWJlbDogJ0VtYWlsJywgdHlwZTogJ3RleHQnIH0sXG4gICAgICAgIHBhc3N3b3JkOiB7IGxhYmVsOiAnUGFzc3dvcmQnLCB0eXBlOiAncGFzc3dvcmQnIH0sXG4gICAgICB9LFxuICAgICAgYXN5bmMgYXV0aG9yaXplKGNyZWRlbnRpYWxzKSB7XG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ9in2YTYqNix2YrYryDYp9mE2KXZhNmD2KrYsdmI2YbZiiDZiNmD2YTZhdipINin2YTZhdix2YjYsSDZhdi32YTZiNio2KfZhicpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xuICAgICAgICAgIHdoZXJlOiB7IGVtYWlsOiBjcmVkZW50aWFscy5lbWFpbCB9LFxuICAgICAgICAgIHNlbGVjdDoge1xuICAgICAgICAgICAgaWQ6IHRydWUsXG4gICAgICAgICAgICBlbWFpbDogdHJ1ZSxcbiAgICAgICAgICAgIG5hbWU6IHRydWUsXG4gICAgICAgICAgICBpbWFnZTogdHJ1ZSxcbiAgICAgICAgICAgIHJvbGU6IHRydWUsXG4gICAgICAgICAgICBwYXNzd29yZDogdHJ1ZVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKCF1c2VyIHx8ICF1c2VyLnBhc3N3b3JkKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCfYp9mE2KjYsdmK2K8g2KfZhNil2YTZg9iq2LHZiNmG2Yog2LrZitixINmF2LPYrNmEJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBpc1ZhbGlkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoY3JlZGVudGlhbHMucGFzc3dvcmQsIHVzZXIucGFzc3dvcmQpO1xuXG4gICAgICAgIGlmICghaXNWYWxpZCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcign2YPZhNmF2Kkg2KfZhNmF2LHZiNixINi62YrYsSDYtdit2YrYrdipJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgIGVtYWlsOiB1c2VyLmVtYWlsLFxuICAgICAgICAgIG5hbWU6IHVzZXIubmFtZSxcbiAgICAgICAgICBpbWFnZTogdXNlci5pbWFnZSxcbiAgICAgICAgICByb2xlOiB1c2VyLnJvbGUsXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBwYWdlczoge1xuICAgIHNpZ25JbjogJy9hdXRoL3NpZ25pbicsXG4gICAgc2lnbk91dDogJy9hdXRoL3NpZ25vdXQnLFxuICAgIGVycm9yOiAnL2F1dGgvZXJyb3InLFxuICAgIHZlcmlmeVJlcXVlc3Q6ICcvYXV0aC92ZXJpZnktcmVxdWVzdCcsXG4gIH0sXG4gIGNhbGxiYWNrczoge1xuICAgIGFzeW5jIGp3dCh7IHRva2VuLCB1c2VyLCBhY2NvdW50IH0pIHtcbiAgICAgIGlmICh1c2VyKSB7XG4gICAgICAgIHRva2VuLnJvbGUgPSB1c2VyLnJvbGU7XG4gICAgICAgIHRva2VuLmlkID0gdXNlci5pZDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b2tlbjtcbiAgICB9LFxuICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICBpZiAoc2Vzc2lvbi51c2VyKSB7XG4gICAgICAgIChzZXNzaW9uLnVzZXIgYXMgYW55KS5yb2xlID0gdG9rZW4ucm9sZTtcbiAgICAgICAgKHNlc3Npb24udXNlciBhcyBhbnkpLmlkID0gdG9rZW4uaWQ7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICB9LFxuICB9LFxuICBzZXNzaW9uOiB7XG4gICAgc3RyYXRlZ3k6ICdqd3QnLFxuICB9LFxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE5leHRBdXRoKGF1dGhPcHRpb25zKTtcbiJdLCJuYW1lcyI6WyJOZXh0QXV0aCIsIlByaXNtYUFkYXB0ZXIiLCJHb29nbGVQcm92aWRlciIsIkZhY2Vib29rUHJvdmlkZXIiLCJBcHBsZVByb3ZpZGVyIiwiQ3JlZGVudGlhbHNQcm92aWRlciIsInByaXNtYSIsImJjcnlwdCIsImF1dGhPcHRpb25zIiwiYWRhcHRlciIsInByb3ZpZGVycyIsImNsaWVudElkIiwicHJvY2VzcyIsImVudiIsIkdPT0dMRV9JRCIsImNsaWVudFNlY3JldCIsIkdPT0dMRV9TRUNSRVQiLCJwcm9maWxlIiwiaWQiLCJzdWIiLCJuYW1lIiwiZW1haWwiLCJpbWFnZSIsInBpY3R1cmUiLCJwcm92aWRlciIsInJvbGUiLCJGQUNFQk9PS19JRCIsIkZBQ0VCT09LX1NFQ1JFVCIsImRhdGEiLCJ1cmwiLCJBUFBMRV9JRCIsIkFQUExFX1NFQ1JFVCIsImNyZWRlbnRpYWxzIiwibGFiZWwiLCJ0eXBlIiwicGFzc3dvcmQiLCJhdXRob3JpemUiLCJFcnJvciIsInVzZXIiLCJmaW5kVW5pcXVlIiwid2hlcmUiLCJzZWxlY3QiLCJpc1ZhbGlkIiwiY29tcGFyZSIsInBhZ2VzIiwic2lnbkluIiwic2lnbk91dCIsImVycm9yIiwidmVyaWZ5UmVxdWVzdCIsImNhbGxiYWNrcyIsImp3dCIsInRva2VuIiwiYWNjb3VudCIsInNlc3Npb24iLCJzdHJhdGVneSIsInNlY3JldCIsIk5FWFRBVVRIX1NFQ1JFVCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(api)/./src/pages/api/auth/[...nextauth].ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(api)/./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES_API&page=%2Fapi%2Fauth%2F%5B...nextauth%5D&preferredRegion=&absolutePagePath=.%2Fsrc%5Cpages%5Capi%5Cauth%5C%5B...nextauth%5D.ts&middlewareConfigBase64=e30%3D!")));
module.exports = __webpack_exports__;

})();