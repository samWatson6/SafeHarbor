import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Safe Harbor</h1>
        <p className="text-lg text-gray-600 mb-8">Your digital identity security dashboard</p>
        <a
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
