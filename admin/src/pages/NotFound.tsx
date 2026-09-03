import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 text-center">
      <p className="text-6xl font-semibold text-primary">404</p>
      <h1 className="mt-4 text-xl font-semibold text-foreground">Page not found</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="mt-6">
        <Link to="/admin">Back to Overview</Link>
      </Button>
    </div>
  );
}
