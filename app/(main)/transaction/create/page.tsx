import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import AddTransactionForm from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function AddTransactionPage({ searchParams }) {
  const { edit: editId } = await searchParams;
  const accounts = await getUserAccounts();
  console.log("🚀 ~ AddTransactionPage ~ editId:", editId);

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    console.log("🚀 ~ AddTransactionPage ~ transaction:", transaction);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title ">Add Transaction</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
}
