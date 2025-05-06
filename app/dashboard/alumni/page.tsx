"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Alumni {
  id: string;
  full_name: string;
  email: string;
  major: string;
  batch_year: number;
  degree: string;
  isAlumni: boolean;
}

export default function KelolaAlumniPage() {
  const [alumniList, setAlumniList] = useState<Alumni[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlumni = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_admin", false);

      if (data) setAlumniList(data);
      setLoading(false);
    };

    fetchAlumni();
  }, []);

  const approveAlumni = async (id: string) => {
    await supabase.from("profiles").update({ isAlumni: true }).eq("id", id);
    setAlumniList((prev) =>
      prev.map((alumni) =>
        alumni.id === id ? { ...alumni, isAlumni: true } : alumni
      )
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-[#0062F2]">Kelola Alumni</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Nama</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Major</th>
              <th className="border p-2">Batch</th>
              <th className="border p-2">Degree</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {alumniList.map((alumni) => (
              <tr key={alumni.id}>
                <td className="border p-2">{alumni.full_name}</td>
                <td className="border p-2">{alumni.email}</td>
                <td className="border p-2">{alumni.major}</td>
                <td className="border p-2">{alumni.batch_year}</td>
                <td className="border p-2">{alumni.degree}</td>
                <td className="border p-2">
                  {alumni.isAlumni ? "Sudah" : "Belum"}
                </td>
                <td className="border p-2">
                  {!alumni.isAlumni && (
                    <button
                      className="text-white bg-[#0062F2] px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => approveAlumni(alumni.id)}
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
