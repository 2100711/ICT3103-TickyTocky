import React from "react";
import { CertMemberTable } from "./CertMemberTable";
import { CertTable } from "./CertTable";

export const CertMember = ({ email }) => {
  console.log("EMAIL:", email);
  return <CertTable role="member" email={email} />;
};
