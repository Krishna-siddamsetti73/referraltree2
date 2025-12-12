"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [roots, setRoots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setRoots(data.roots);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Root Users (No Predecessor)
      </h2>

      {loading && (
        <div className="animate-pulse text-gray-500">Loading users...</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roots.map((user) => (
          <a
            key={user._id}
            href={`/admin/tree/${user._id}`}
            className="block bg-white shadow-md p-5 rounded-xl border border-gray-200 
                      hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <div className="text-xl font-semibold text-gray-800">
              {user.name || user.phone}
            </div>
            <div className="text-gray-500 text-sm">{user.phone}</div>
          </a>
        ))}
      </div>

      {roots.length === 0 && !loading && (
        <p className="text-gray-500 mt-4">No root users found.</p>
      )}
    </div>
  );
}
