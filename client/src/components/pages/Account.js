import React from "react";
import { AuthData } from "../../auth/AuthWrapper";

export const Account = () => {
  const { user } = AuthData();
  return <div>Account: {user.email}</div>;
};
