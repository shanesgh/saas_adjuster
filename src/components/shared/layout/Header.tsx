import { FileBadge } from "lucide-react";
import { useUser } from "@clerk/clerk-react";

export const Header = () => {
  const { user } = useUser();
  const companyName = (user?.unsafeMetadata?.company as string) || "ZenAssess";

  return (
    <header className="bg-primary-500 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileBadge size={32} />
            <div>
              <h1 className="text-xl font-bold">{companyName}</h1>
              <p className="text-sm text-primary-100">
                Digital Claims Platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
