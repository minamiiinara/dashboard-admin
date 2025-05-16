"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function OverviewPage() {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const [stats, setStats] = useState({
    alumni: 0,
    events: 0,
    sig: 0,
    jobs: 0,
  });

  interface Alumni {
    id: string;
    full_name: string;
    email: string;
    major: string;
    isAlumni: boolean;
  }

  const [pendingAlumni, setPendingAlumni] = useState<Alumni[]>([]);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single();

    if (error || !data?.is_admin) {
      alert("Akses ditolak");
      router.push("/login");
    } else {
      setAuthorized(true);
      fetchStats();
      fetchPendingAlumni();
    }

    setIsChecking(false);
  };

  const fetchStats = async () => {
    const [alumni, events, sig, jobs] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("sig_groups").select("*", { count: "exact", head: true }),
      supabase.from("job_listings").select("*", { count: "exact", head: true }),
    ]);

    setStats({
      alumni: alumni.count || 0,
      events: events.count || 0,
      sig: sig.count || 0,
      jobs: jobs.count || 0,
    });
  };

  const fetchPendingAlumni = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("isAlumni", false);

    console.log("DATA:", data);
    console.error("ERROR:", error);

    setPendingAlumni(data || []);
  };

  const approveAlumni = async (id: string) => {
    await supabase.from("profiles").update({ isAlumni: true }).eq("id", id);
    fetchPendingAlumni();
  };

  if (isChecking) return null; // atau loading spinner
  if (!authorized) return null;
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-[#0062F2]">Dashboard Overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Alumni", count: stats.alumni },
          { label: "Total Events", count: stats.events },
          { label: "Total SIG", count: stats.sig },
          { label: "Job Listings", count: stats.jobs },
        ].map((item) => (
          <div key={item.label} className="bg-[#F5F9FF] p-4 rounded shadow-sm">
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="text-xl font-bold text-[#0062F2]">{item.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-4">
          Recent Alumni Registrations
        </h2>
        {pendingAlumni.length === 0 ? (
          <p className="text-sm text-gray-500">
            No pending alumni registrations.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Major</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingAlumni.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="py-2">{a.full_name}</td>
                  <td>{a.email}</td>
                  <td>{a.major}</td>
                  <td>
                    <button
                      onClick={() => approveAlumni(a.id)}
                      className="bg-[#0062F2] text-white px-3 py-1 text-xs rounded"
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
