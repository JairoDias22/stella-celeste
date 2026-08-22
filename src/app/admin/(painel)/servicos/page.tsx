import ServicosClient from "@/components/admin/servicos/ServicosClient";
import { getServicos } from "@/lib/actions/servicos";

export default async function ServicosPage() {
  const servicos = await getServicos();

  return <ServicosClient initialData={servicos} />;
}
