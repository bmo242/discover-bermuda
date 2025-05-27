import { ComponentType } from "react";
import ProtectedWrapper from "./ProtectedWrapper";

export function withRoleProtection<T extends object>(
  WrappedComponent: ComponentType<T>,
  allowedRoles: ("USER" | "ADMIN")[]
) {
  return function WithRoleProtection(props: T) {
    return (
      <ProtectedWrapper allowedRoles={allowedRoles}>
        <WrappedComponent {...props} />
      </ProtectedWrapper>
    );
  };
} 