import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { productsApi } from "../../api/products";
import { client, apiError } from "../../api/client";
import { currency } from "../../utils/format";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/ui/Button";

const FIELDS = [
  "id",
  "title",
  "price",
  "description",
  "category",
  "image",
  "quantity",
];

// Fields the backend allows in PUT /products/:id (id cannot be changed)
const EDITABLE = ["title", "price", "description", "category", "image", "quantity"];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null); // product.id being edited
  const [editForm, setEditForm] = useState({});

  const load = () =>
    productsApi
      .list()
      .then(({ data }) => setProducts(data))
      .catch((error) => toast.error(apiError(error)));

  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      await client.post("/products", {
        ...form,
        id: Number(form.id),
        price: Number(form.price),
        quantity: Number(form.quantity),
      });
      setForm({});
      load();
      toast.success("Product added");
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setEditForm({
      title: product.title ?? "",
      price: product.price ?? "",
      description: product.description ?? "",
      category: product.category ?? "",
      image: product.image ?? "",
      quantity: product.quantity ?? 0,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    try {
      const payload = {};
      EDITABLE.forEach((field) => {
        payload[field] = ["price", "quantity"].includes(field)
          ? Number(editForm[field])
          : editForm[field];
      });
      await client.put(`/products/${id}`, payload);
      toast.success("Product updated");
      cancelEdit();
      load();
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  const remove = async (product) => {
    if (!window.confirm(`Delete "${product.title}"?`)) return;
    try {
      await client.delete(`/products/${product.id}`);
      toast.success("Product deleted");
      if (editingId === product.id) cancelEdit();
      load();
    } catch (error) {
      toast.error(apiError(error));
    }
  };

  return (
    <AdminLayout>
      <div className="page-wrap">
        <h1 className="text-4xl font-extrabold">Products</h1>

        <form
          className="card mt-8 grid gap-3 p-6 sm:grid-cols-3"
          onSubmit={submit}
        >
          {FIELDS.map((field) => (
            <input
              className="field"
              required
              key={field}
              placeholder={field}
              value={form[field] || ""}
              onChange={(event) =>
                setForm({ ...form, [field]: event.target.value })
              }
            />
          ))}
          <Button>Add product</Button>
        </form>

        <div className="card mt-6 overflow-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700">
                {["ID", "Title", "Category", "Price", "Stock", "Actions"].map(
                  (heading) => (
                    <th className="p-4" key={heading}>
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const editing = editingId === product.id;
                return (
                  <tr
                    className="border-b border-slate-100 align-top dark:border-slate-800"
                    key={product._id}
                  >
                    <td className="p-4">{product.id}</td>

                    {editing ? (
                      <>
                        <td className="p-4">
                          <input
                            className="field mb-2"
                            placeholder="title"
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm({ ...editForm, title: e.target.value })
                            }
                          />
                          <input
                            className="field mb-2"
                            placeholder="description"
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                          />
                          <input
                            className="field"
                            placeholder="image URL"
                            value={editForm.image}
                            onChange={(e) =>
                              setEditForm({ ...editForm, image: e.target.value })
                            }
                          />
                        </td>
                        <td className="p-4">
                          <input
                            className="field"
                            placeholder="category"
                            value={editForm.category}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                category: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td className="p-4">
                          <input
                            className="field"
                            type="number"
                            min="0"
                            step="any"
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm({ ...editForm, price: e.target.value })
                            }
                          />
                        </td>
                        <td className="p-4">
                          <input
                            className="field"
                            type="number"
                            min="0"
                            value={editForm.quantity}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                quantity: e.target.value,
                              })
                            }
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              onClick={() => saveEdit(product.id)}
                            >
                              Save
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-4 font-bold">{product.title}</td>
                        <td className="p-4">{product.category}</td>
                        <td className="p-4">{currency(product.price)}</td>
                        <td
                          className={`p-4 ${product.quantity <= 5 ? "font-bold text-coral" : ""}`}
                        >
                          {product.quantity}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => startEdit(product)}
                            >
                              Edit
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={() => remove(product)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
