import ClientesClient from "@/components/admin/clientes/ClientesClient";
import { getClientes } from "@/lib/actions/clientes";

export default async function ClientesPage() {
  const clientes = await getClientes();

  return <ClientesClient initialData={clientes} />;
}
