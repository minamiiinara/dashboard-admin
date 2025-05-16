"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
// import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return alert("Login gagal");

    const profile = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.user.id)
      .single();

    if (!profile.data?.is_admin) return alert("Bukan admin");

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f4f7fe] flex items-center justify-center font-[Gilroy] px-4">
      <div className="bg-white rounded-2xl shadow-lg flex max-w-5xl w-full overflow-hidden">
        {/* LEFT ILLUSTRATION */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-[#fff]">
          <img
            src="/illustration.jpg"
            alt="Login illustration"
            className="w-3/4"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-1 text-gray-800">
            Login as an Admin
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Masukkan email & password admin
          </p>

          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">Email</label>
            <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#0062F2]">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0z" />
                <path d="M12 14v4m0 0h4m-4 0H8" />
              </svg>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@xyz.com"
                className="ml-3 flex-1 outline-none bg-transparent text-sm"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-2">Password</label>
            <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#0062F2]">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M12 11c1.38 0 2.5-1.12 2.5-2.5S13.38 6 12 6s-2.5 1.12-2.5 2.5S10.62 11 12 11z" />
                <path d="M18 20H6a2 2 0 01-2-2v-2c0-2.21 3.58-4 8-4s8 1.79 8 4v2a2 2 0 01-2 2z" />
              </svg>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="ml-3 flex-1 outline-none bg-transparent text-sm"
              />
            </div>
          </div>

          <button
            onClick={login}
            className="w-full bg-[#0062F2] text-white py-3 rounded-full font-semibold hover:bg-[#004bb0] transition duration-300"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
