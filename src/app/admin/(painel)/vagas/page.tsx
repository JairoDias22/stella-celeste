import VagasClient from "@/components/admin/vagas/VagasClient";
import { getVagas } from "@/lib/actions/vagas";

export default async function VagasPage() {
  const vagas = await getVagas();

  return <VagasClient initialData={vagas} />;
}
