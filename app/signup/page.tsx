import { SignupForm } from '../components/auth/SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-[400px] mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to Spotto</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>
        
        <SignupForm />
      </div>
    </div>
  );
} 