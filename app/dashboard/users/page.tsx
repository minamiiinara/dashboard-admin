"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type User = {
  id: string;
  full_name: string;
  email: string;
  batch_year: number;
  degree: string;
  isAlumni: boolean;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    setUsers(data || []);
  };

  const approveAlumni = async (id: string) => {
    await supabase.from("profiles").update({ isAlumni: true }).eq("id", id);
    fetchUsers();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Daftar Alumni</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-3 py-2">Nama</th>
            <th className="border px-3 py-2">Email</th>
            <th className="border px-3 py-2">Batch</th>
            <th className="border px-3 py-2">Degree</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border px-3 py-2">{u.full_name}</td>
              <td className="border px-3 py-2">{u.email}</td>
              <td className="border px-3 py-2">{u.batch_year}</td>
              <td className="border px-3 py-2">{u.degree}</td>
              <td className="border px-3 py-2">
                {u.isAlumni ? "Approved" : "Pending"}
              </td>
              <td className="border px-3 py-2">
                {!u.isAlumni && (
                  <button
                    onClick={() => approveAlumni(u.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
