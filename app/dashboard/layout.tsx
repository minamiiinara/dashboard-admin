"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/app/dashboard/dashboard.css"; // Import your CSS file here

const menu = [
  { href: "/dashboard", label: "Alumni" },
  { href: "/dashboard/events", label: "Event" },
  { href: "/dashboard/newsletter", label: "Newsletter" },
  { href: "/dashboard/lowongan", label: "Lowongan" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h2 className="logo">IKAPRAMA</h2>
        {menu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`menu-item ${path === item.href ? "active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
      </aside>
      <main className="content">{children}</main>
    </div>
  );
}
