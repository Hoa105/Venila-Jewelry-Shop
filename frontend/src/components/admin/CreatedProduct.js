import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const [productImg, setProductImg] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [material, setMaterial] = useState("");
  const [category, setCategory] = useState("");
  const [hasSizes, setHasSizes] = useState(true);
  const [sizes, setSizes] = useState([
    { size: "1.5", quantity: 0 },
    { size: "1.6", quantity: 0 },
    { size: "1.7", quantity: 0 },
    { size: "1.8", quantity: 0 },
    { size: "1.9", quantity: 0 },
  ]);
  const navigate = useNavigate();

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProductImg(file);
    } else {
      setProductImg(null);
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
    formData.append("description", desc);
    formData.append("price", price);
    formData.append("material", material);
    formData.append("category", category);

    if (hasSizes) {
      formData.append("sizes", JSON.stringify(sizes));
    } else {
      formData.append("sizes", JSON.stringify([]));
    }

    if (productImg) {
      formData.append("image", productImg);
    }
    console.log(formData);
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await fetch(
        "http://localhost:8081/products/create-product",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create product");
      }

      alert("Product created successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to create product");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <form onSubmit={handleSubmit} className="style">
        <h3>Create a Product</h3>

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
          value={desc}
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

        <div style={{ marginBottom: "-55px" }}>
          <label>
            <input
              type="checkbox"
              checked={hasSizes}
              onChange={(e) => setHasSizes(e.target.checked)}
              style={{ width: "20px" }}
            />
            Sản phẩm có size
          </label>
        </div>

        {hasSizes && (
          <>
            <h4 style={{ marginBottom: "-20px" }}>Sizes and Quantities</h4>
            {sizes.map((size, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder="Size"
                  value={size.size}
                  onChange={(e) =>
                    handleSizeChange(index, "size", e.target.value)
                  }
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
                    width: "100px",
                  }}
                />
              </div>
            ))}
            <button type="button" onClick={addSizeField}>
              ➕ Add Size
            </button>
          </>
        )}

        <br />

        <input
          accept="image/*"
          type="file"
          onChange={handleProductImageUpload}
          required
        />
        <br />

        <button type="submit">Submit</button>
      </form>

      <div style={{ marginLeft: "2rem", marginTop: "5rem" }}>
        {productImg ? (
          <img
            src={URL.createObjectURL(productImg)}
            alt="Preview"
            style={{ maxWidth: "300px" }}
          />
        ) : (
          <p>Product image upload preview will appear here!</p>
        )}
      </div>
    </div>
  );
};

export default CreateProduct;
