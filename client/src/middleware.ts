import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// تم تعطيل التحقق مؤقتاً
export function middleware(request: NextRequest) {
  // إذا كان المسار /home قم بتحويله إلى الصفحة الرئيسية /
  if (request.nextUrl.pathname === '/home') {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
