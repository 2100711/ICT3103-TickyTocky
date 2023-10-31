import React, { useState } from "react";
import { CertMemberTable } from "./CertMemberTable";
import { CertTable } from "./CertTable";

export const CertMember = ({ email }) => {
  return <CertTable role="member" email={email} />;
};
