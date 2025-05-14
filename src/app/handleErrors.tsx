import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function handleErrors(err: unknown, router: ReturnType<typeof useRouter>, msg: string) {
  if (err instanceof Error && err.message.includes("Token")) {
    toast.error("Sessão expirada. Faça login novamente.");
    router.replace("/login");
  } else {
    toast.error(msg);
  }
}