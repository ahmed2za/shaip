import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { activityService } from '@/services/activityService';
import { UAParser } from 'ua-parser-js';

export async function activityTrackingMiddleware(req: NextRequest) {
  try {
    // Skip tracking for static files and API routes
    if (
      req.nextUrl.pathname.startsWith('/_next') ||
      req.nextUrl.pathname.startsWith('/api') ||
      req.nextUrl.pathname.startsWith('/static')
    ) {
      return NextResponse.next();
    }

    // Get user information from session
    const token = await getToken({ req });
    const userId = token?.sub || null;

    // Parse user agent
    const ua = new UAParser(req.headers.get('user-agent') || '');
    const browser = ua.getBrowser();
    const os = ua.getOS();
    const device = ua.getDevice();

    // Track page view
    await activityService.trackPageView(userId, req.nextUrl.pathname, req.headers.get('referer') || undefined);

    // If user is logged in, track detailed activity
    if (userId) {
      const sessionData = {
        userId,
        startTime: new Date(),
        pages: [req.nextUrl.pathname],
        bounced: true, // Will be updated when user visits another page
        device: device.type || 'desktop',
        browser: `${browser.name} ${browser.version}`,
        os: `${os.name} ${os.version}`,
      };

      const session = await activityService.startSession(sessionData);

      // Set session ID in cookie for tracking
      const response = NextResponse.next();
      response.cookies.set('session_id', session?.id || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 60, // 30 minutes
      });

      return response;
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Activity tracking error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
