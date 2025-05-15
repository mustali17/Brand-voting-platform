"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";

const AdminLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "loading") return; // Do nothing while loading
    if (!session || !session.user || session.user.role !== "admin") {
      router.replace("/login");
    }
    console.log("AdminLayout session:", session);
  }, [session, sessionStatus, router]);

  return <>{children}</>;
};

export default AdminLayout;
