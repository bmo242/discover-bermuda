'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ComponentType, useEffect } from "react";

export function withRoleProtection<T extends object>(
  WrappedComponent: ComponentType<T>,
  allowedRoles: ("USER" | "ADMIN")[]
) {
  return function ProtectedComponent(props: T) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === "loading") return;

      if (!session) {
        router.push("/login");
        return;
      }

      const userRole = session.user?.role;
      if (!userRole || !allowedRoles.includes(userRole)) {
        router.push("/unauthorized");
      }
    }, [session, status, router]);

    if (status === "loading") {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (!session || !session.user?.role || !allowedRoles.includes(session.user.role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
} 