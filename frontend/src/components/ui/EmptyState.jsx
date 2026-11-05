export default function EmptyState({ title, message, action }) {
  return (
    <div className="card p-12 text-center">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-slate-500">{message}</p>
      {action}
    </div>
  );
}
