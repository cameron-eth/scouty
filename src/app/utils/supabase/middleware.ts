import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Avoid writing logic here between createServerClient and getUser.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Allow access to /, /login, /signup, and /auth for unauthenticated users
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/signup') && // Allow access to /signup
    request.nextUrl.pathname !== '/' // Allow access to homepage
  ) {
    // Redirect unauthenticated users to /login if they attempt to access other pages
    //const url = request.nextUrl.clone()
    //url.pathname = '/login'
    //return NextResponse.redirect(url)
  }

  // Return the supabaseResponse object as it is.
  return supabaseResponse
}
