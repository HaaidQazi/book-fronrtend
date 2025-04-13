import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-500 text-white px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Welcome to Peer-2-Peer Book Exchange Portal
      </h1>
      <p className="text-lg md:text-xl mb-8 max-w-xl">
        Discover, share, and exchange academic books easily. Register to get started or login if you already have an account.
      </p>
      <div className="flex gap-4">
        <Link href="/register">
          <button className="px-6 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition">
            Register
          </button>
        </Link>
        <Link href="/login">
          <button className="px-6 py-2 rounded-lg border border-white hover:bg-white hover:text-black transition">
            Login
          </button>
        </Link>
      </div>
    </div>
  );
}
