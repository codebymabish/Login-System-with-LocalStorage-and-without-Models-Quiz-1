import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
      <p className="text-muted-foreground mb-6">
        You don't have permission to access this page.
      </p>
      <Button onClick={() => navigate("/auth")}>
        Return to Login
      </Button>
    </div>
  );
};

export default UnauthorizedPage;