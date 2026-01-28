export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="w-full max-w-md rounded-lg border border-red-200 bg-white p-8 shadow-sm dark:border-red-800 dark:bg-zinc-900">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-semibold text-red-600 dark:text-red-400">
            Authentication Error
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            There was a problem signing you in. Please try again.
          </p>
        </div>
        <a
          href="/sign-in"
          className="block w-full rounded-lg bg-black px-4 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
        >
          Return to Sign In
        </a>
      </div>
    </div>
  )
}
