import ReservasClient from "@/components/admin/reservas/ReservasClient";
import { getReservasAdmin } from "@/lib/actions/reservas-admin";

export default async function ReservasPage() {
  const reservas = await getReservasAdmin();

  return <ReservasClient initialData={reservas} />;
}
