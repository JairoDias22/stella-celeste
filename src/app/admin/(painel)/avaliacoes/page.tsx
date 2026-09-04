import AvaliacoesClient from "@/components/admin/avaliacoes/AvaliacoesClient";
import { getAvaliacoesAdmin } from "@/lib/actions/avaliacoes";

export default async function AvaliacoesPage() {
  const avaliacoes = await getAvaliacoesAdmin();

  return <AvaliacoesClient initialData={avaliacoes} />;
}
