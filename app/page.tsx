import { PaymentsTable } from "@/components/dashboard/datatable";
import UploadsTable from "@/components/dashboard/UploadsTable";
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <main className="ml-[300px]">   
        <Uploads />
      </main>
    </div>
  );
}

function Uploads() {
    return <UploadsTable />
}
