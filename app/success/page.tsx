import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4 text-center">
      <CheckCircle className="h-16 w-16 text-green-500" />
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p className="text-muted-foreground">
        Thank you for your purchase. You now have full access to the map.
      </p>
    </div>
  );
} 