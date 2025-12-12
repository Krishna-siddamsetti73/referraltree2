"use client";
import { useEffect, useState } from "react";

function TreeNode({ node }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="ml-4 mt-3">
      {/* Node Row */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {/* Toggle Icon */}
        <span
          className="w-5 h-5 flex items-center justify-center rounded-full 
                     bg-gray-800 text-white text-xs transition-transform 
                     hover:scale-110"
        >
          {open ? "-" : "+"}
        </span>

        {/* Node Name */}
        <div className="font-semibold text-gray-900">
          {node.name || node.phone}
        </div>
      </div>

      {/* Children */}
      {open && node.children?.length > 0 && (
        <div
          className="ml-6 border-l border-gray-300 pl-4 mt-2 space-y-2
                     transition-all duration-300 ease-in-out"
        >
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function UserTree({ params }) {
  const { id } = params;
  const [tree, setTree] = useState(null);

  useEffect(() => {
    fetch(`/api/admin/tree/${id}`)
      .then((res) => res.json())
      .then((data) => setTree(data.tree));
  }, [id]);

  if (!tree)
    return (
      <div className="p-6 text-gray-500 animate-pulse">Loading tree...</div>
    );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <a
        href="/admin"
        className="text-blue-600 underline hover:text-blue-800 transition"
      >
        ← Back
      </a>

      <h1 className="text-4xl font-bold text-gray-900 mt-4">
        Referral Tree for {tree.name || tree.phone}
      </h1>

      <p className="text-gray-500 mb-6">
        Click on nodes to expand or collapse
      </p>

      <TreeNode node={tree} />
    </div>
  );
}
