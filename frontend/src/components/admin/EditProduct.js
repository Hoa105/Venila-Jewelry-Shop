import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const [productImg, setProductImg] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);
  const [name, setName] = useState("");
  const [description, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [material, setMaterial] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8081/products/${id}`);
        const data = await response.json();

        const product = data.results;
        if (!product) throw new Error("Product not found");

        setName(product.name || "");
        setDesc(product.description || "");
        setPrice(product.price || "");
        setMaterial(product.material || "");
        setCategory(product.category || "");
        setPreviewImg(product.image || null);
        setSizes(product.variants || []);
      } catch (err) {
        console.error(err);
        alert("Error loading product data");
      }
    };

    fetchProduct();
  }, [id]);

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImg(file);
      setPreviewImg(URL.createObjectURL(file));
    }
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][field] = value;
    setSizes(updatedSizes);
  };

  const addSizeField = () => {
    setSizes([...sizes, { size: "", quantity: "" }]);
  };

  const removeSizeField = (index) => {
    const updatedSizes = sizes.filter((_, i) => i !== index);
    setSizes(updatedSizes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("material", material);
    formData.append("category", category);
    formData.append("sizes", JSON.stringify(sizes));
    if (productImg) {
      formData.append("image", productImg);
    }
    formData.append("id", id);

    try {
      const res = await fetch(
        `http://localhost:8081/products/update-product/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to update product");

      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to update product");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <form onSubmit={handleSubmit} className="style">
        <h3>Edit a Product</h3>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />

        <input
          type="text"
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <br />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <br />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          style={{ width: "400px", height: "50px" }}
        >
          <option value="">Select Category</option>
          <option value="nhẫn">Nhẫn</option>
          <option value="lắc tay">Lắc tay</option>
          <option value="dây chuyền">Dây chuyền</option>
          <option value="bông tai">Bông tai</option>
        </select>
        <br />

        <select
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
          required
          style={{ width: "400px", height: "50px" }}
        >
          <option value="">Select Material</option>
          <option value="vàng">Vàng</option>
          <option value="bạc">Bạc</option>
          <option value="kim cương">Kim cương</option>
        </select>
        <br />

        <h4>Sizes and Quantities</h4>
        {sizes.map((size, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Size"
              value={size.size}
              onChange={(e) => handleSizeChange(index, "size", e.target.value)}
              required
              style={{ marginRight: "10px", width: "100px" }}
            />
            <input
              type="number"
              placeholder="Quantity"
              value={size.quantity}
              onChange={(e) =>
                handleSizeChange(index, "quantity", e.target.value)
              }
              required
              style={{ marginRight: "10px", width: "100px" }}
            />
            <input
              type="button"
              value="❌"
              onClick={() => removeSizeField(index)}
              style={{
                backgroundColor: "white",
                cursor: "pointer",
              }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addSizeField}
          style={{
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          ➕ Add Size
        </button>
        <br />

        <input
          accept="image/*"
          type="file"
          onChange={handleProductImageUpload}
        />
        <br />

        <button type="submit">Update Product</button>
      </form>

      <div style={{ marginLeft: "2rem", marginTop: "5rem" }}>
        {previewImg ? (
          <img src={previewImg} alt="Preview" style={{ maxWidth: "300px" }} />
        ) : (
          <p>Product image preview will appear here!</p>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
