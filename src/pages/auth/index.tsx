import { AuthForm } from "@/components/auth/auth-form";

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-between">
      <div className="hidden lg:block w-1/2 h-screen bg-black p-12">
        <div className="flex items-center gap-3 mb-24">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xl font-bold">
            S
          </div>
          <span className="text-white text-2xl font-bold">Spotto</span>
        </div>
        <div className="text-white">
          <h2 className="text-4xl font-bold mb-4">All the experiences. None of the noise. One place.</h2>
          <div className="relative h-[400px]">
            {/* Add your map or illustration here */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
          </div>
          <div className="mt-8">
            <h2 className="text-4xl font-bold mb-4">Discover Stockholm</h2>
            <p className="text-lg text-gray-300">
              Explore the best places, hidden gems, and local favorites in Stockholm. Everything in one place.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <AuthForm />
      </div>
    </div>
  );
} 