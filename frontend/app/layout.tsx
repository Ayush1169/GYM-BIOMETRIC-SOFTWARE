import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Gym Admin Panel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0f172a] text-white">
        <div className="flex h-screen">

          {/* Sidebar */}
          <div className="w-64 bg-[#111827] border-r border-gray-700 p-6 flex flex-col">

            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src="/Screenshot 2026-03-06 165057.png"
                alt="Gym Logo"
                width={140}
                height={140}
                className="rounded-xl"
              />
            </div>

            <nav className="flex flex-col gap-3 text-gray-300">

              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg hover:bg-cyan-500 hover:text-black transition"
              >
                📊 Dashboard
              </Link>

              <Link
                href="/members"
                className="px-4 py-2 rounded-lg hover:bg-cyan-500 hover:text-black transition"
              >
                👥 Members
              </Link>

              <Link
                href="/attendance"
                className="px-4 py-2 rounded-lg hover:bg-cyan-500 hover:text-black transition"
              >
                🕒 Attendance
              </Link>

              <Link
                href="/archived"
                className="px-4 py-2 rounded-lg hover:bg-cyan-500 hover:text-black transition"
              >
                🙍🏻‍♂️ Archived Members
              </Link>

               <Link
                href="/analytics"
                className="px-4 py-2 rounded-lg hover:bg-cyan-500 hover:text-black transition"
              >
                 📅 Analytics
              </Link>

              <Link
href="/expired"
className="px-4 py-2 rounded-lg hover:bg-cyan-500 hover:text-black transition"
>

⛔ Expired Members

</Link>

            </nav>

            <div className="mt-auto text-xs text-gray-500 pt-10">
              © 2026 Gym System
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-[#0f172a] overflow-y-auto p-8">
            {children}
          </div>

        </div>
      </body>
    </html>
  );
} 