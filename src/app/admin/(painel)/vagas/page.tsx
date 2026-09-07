import VagasClient from "@/components/admin/vagas/VagasClient";
import { getDisponibilidades } from "@/lib/actions/vagas";

export default async function VagasPage() {
  const disponibilidades = await getDisponibilidades();

  return <VagasClient initialData={disponibilidades} />;
}
