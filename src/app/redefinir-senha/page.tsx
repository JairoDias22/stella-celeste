import { Suspense } from "react";
import RedefinirSenhaClient from "@/components/auth/RedefinirSenhaClient";

export default function RedefinirSenhaPage() {
  return (
    <Suspense>
      <RedefinirSenhaClient />
    </Suspense>
  );
}
