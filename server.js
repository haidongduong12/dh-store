const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = 8081;

// Phục vụ các file tĩnh trong thư mục uploads
app.use("./public/uploads", express.static("./public/uploads"));

// Cấu hình Multer để lưu trữ file hình ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/"); // Thư mục lưu trữ file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Tên file
  },
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json()); // Sử dụng body-parser để parse JSON body của request

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Thiết lập kết nối MySQL
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "react",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to the database!");
});

//Show all product
app.get("/react/show-product", (req, res) => {
  const sql = "SELECT * FROM products";
  con.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Error fetching products" });
    }
    res.status(200).json(results); // Ensure the response is an array
  });
});

//show product with id
app.get("/react/show-product/:productId", (req, res) => {
  const productId = req.params.productId;
  const sql = "SELECT * FROM products WHERE id = ?";
  con.query(sql, [productId], (err, results) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ error: "Error fetching product" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(results[0]); // Ensure the response is a single object
  });
});

//Add product
app.post("/react/add-product", upload.single("image"), (req, res) => {
  const { name, quantity, price, description, category } = req.body;
  const image = req.file ? req.file.filename : null;
  const createdAt = new Date().toISOString().slice(0, 19).replace("T", " "); // Lấy ngày và thời gian hiện tại

  if (!name || !quantity || !price || !description || !category || !image) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const sql =
    "INSERT INTO products (product_name, product_quantity, product_price, product_description, category_id, product_image, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)";
  con.query(
    sql,
    [name, quantity, price, description, category, image, createdAt],
    (err, result) => {
      if (err) {
        console.error("Error adding product:", err);
        return res.status(500).json({ error: "Error adding product" });
      }
      res.status(201).json({ message: "Product added successfully!" });
    }
  );
});

//Delete product
app.delete("/react/delete-product/:id", (req, res) => {
  const productId = req.params.id;

  // Fetch the product to get the image file name
  con.query(
    "SELECT product_image FROM products WHERE id = ?",
    [productId],
    (err, results) => {
      if (err) {
        console.error("Error fetching product:", err);
        return res.status(500).send("Server error");
      }

      if (results.length > 0) {
        const productImage = results[0].product_image;
        const imagePath = `./public/uploads/${productImage}`;

        // Delete the image file
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image file:", err);
            return res.status(500).send("Server error");
          }

          // Delete the product from the database
          con.query(
            "DELETE FROM products WHERE id = ?",
            [productId],
            (err, results) => {
              if (err) {
                console.error("Error deleting product:", err);
                return res.status(500).send("Server error");
              }

              res.send("Product deleted successfully");
            }
          );
        });
      } else {
        res.status(404).send("Product not found");
      }
    }
  );
});

//Update product
app.put("/react/edit-product/:productId", (req, res) => {
  const productId = req.params.productId;
  const { name, description, price, quantity, category } = req.body; // Adjust these fields as per your product schema
  const updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");

  if (!name || !description || !price || !quantity || !category) {
    return res
      .status(400)
      .send({ message: "Please provide all required fields" });
  }
  const sql =
    "UPDATE products SET product_name = ?, product_description = ?, product_price = ?, product_quantity = ?, category_id = ?, updated_at = ? WHERE id = ?";
  con.query(
    sql,
    [name, description, price, quantity, category, updatedAt, productId],
    (err, result) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).send({ message: "Error updating product" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Product not found" });
      }
      res.send({ message: "Product updated successfully!" });
    }
  );
});

//Show all Category
app.get("/react/show-category", (req, res) => {
  const sql = "SELECT * FROM categories";
  con.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching categories:", err);
      res.status(500).send("Server error");
    } else {
      res.json(results);
    }
  });
});

//Add categories
app.post("/react/add-category", upload.single("image"), (req, res) => {
  const { name, description } = req.body;
  const image = req.file ? req.file.filename : null;
  const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");

  if (!name || !description || !image) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const sql =
    "INSERT INTO categories (category_name, category_description, category_image, created_at) VALUES (?, ?, ?, ?)";
  con.query(sql, [name, description, image, createdAt], (err, result) => {
    if (err) {
      console.error("Error adding category:", err);
      return res.status(500).json({ error: "Error adding category" });
    }
    res.status(201).json({ message: "Category added successfully!" });
  });
});

app.delete("/react/delete-category/:id", (req, res) => {
  const cateId = req.params.id;

  // Fetch the product to get the image file name
  con.query(
    "SELECT category_image FROM categories WHERE id = ?",
    [cateId],
    (err, results) => {
      if (err) {
        console.error("Error fetching category:", err);
        return res.status(500).send("Server error");
      }

      if (results.length > 0) {
        const cateImage = results[0].category_image;
        const imagePath = `./public/uploads/${cateImage}`;

        // Delete the image file
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image file:", err);
            return res.status(500).send("Server error");
          }

          // Delete the product from the database
          con.query(
            "DELETE FROM categories WHERE id = ?",
            [cateId],
            (err, results) => {
              if (err) {
                console.error("Error deleting category:", err);
                return res.status(500).send("Server error");
              }

              res.send(" Category deleted successfully");
            }
          );
        });
      } else {
        res.status(404).send("Product not found");
      }
    }
  );
});

//show category with id
app.get("/react/show-category/:categoryId", (req, res) => {
  const categoryId = req.params.categoryId;
  const sql = "SELECT * FROM categories WHERE id = ?";
  con.query(sql, [categoryId], (err, results) => {
    if (err) {
      console.error("Error fetching category:", err);
      return res.status(500).json({ error: "Error fetching category" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "category not found" });
    }
    res.status(200).json(results[0]); // Ensure the response is a single object
  });
});

//Update Category
app.put("/react/edit-category/:categoryId", (req, res) => {
  const categoryId = req.params.categoryId;
  const { name, description } = req.body; // Adjust these fields as per your product schema
  const updatedAt = new Date().toISOString().slice(0, 19).replace("T", " ");

  const sql =
    "UPDATE categories SET category_name = ?, category_description = ?, updated_at = ? WHERE id = ?";
  con.query(sql, [name, description, updatedAt, categoryId], (err, result) => {
    if (err) {
      console.error("Error updating category:", err);
      return res.status(500).send({ message: "Error updating product" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Category not found" });
    }
    res.send({ message: "Category updated successfully!" });
  });
});

//API addToCart

// Tạo API endpoint để lấy dữ liệu từ MySQL
// app.get("/react/users", (req, res) => {
//   const sql = "SELECT * FROM users";
//   con.query(sql, (err, results) => {
//     if (err) throw err;
//     res.json(results);
//   });
// });

//Register API
app.post("/react/register", async (req, res) => {
  //phai nho cai npm i body-parser
  const { username, email, password } = req.body;
  // console.log("Request body:", req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Thêm người dùng vào cơ sở dữ liệu
    const sql =
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    con.query(sql, [username, email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error adding user:", err);
        return res.status(500).json({ error: "Error adding user" });
      }
      res.status(201).json({ message: "Registration successful!" });
    });
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).json({ error: "Error hashing password" });
  }
});

//Login API
app.post("/react/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const sql = "SELECT * FROM users WHERE username = ?";
  con.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Error fetching user:", err);
      return res.status(500).json({ error: "Error fetching user" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful", id: user.id });
  });
});

//Add to cart API
app.post("/react/add-to-cart", (req, res) => {
  const { userId, productId, quantity } = req.body;
  const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  // Kiểm tra nếu sản phẩm đã có trong giỏ hàng của người dùng
  const checkSql = "SELECT * FROM carts WHERE user_id = ? AND product_id = ?";
  con.query(checkSql, [userId, productId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking cart:", checkErr);
      return res.status(500).json({ error: "Error checking cart" });
    }

    if (checkResult.length > 0) {
      // Nếu sản phẩm đã có trong giỏ hàng, cập nhật số lượng
      const updateSql =
        "UPDATE carts SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?";
      con.query(
        updateSql,
        [quantity, userId, productId],
        (updateErr, updateResult) => {
          if (updateErr) {
            console.error("Error updating cart:", updateErr);
            return res.status(500).json({ error: "Error updating cart" });
          }
          res.status(200).json({ message: "Cart updated successfully!" });
        }
      );
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm mới
      const insertSql =
        "INSERT INTO carts (user_id, product_id, quantity, created_at) VALUES (?, ?, ?,?)";
      con.query(
        insertSql,
        [userId, productId, quantity, createdAt],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error adding to cart:", insertErr);
            return res.status(500).json({ error: "Error adding to cart" });
          }
          res
            .status(201)
            .json({ message: "Product added to cart successfully!" });
        }
      );
    }
  });
});

// Show cart items with userId
// Route to fetch cart items with product details
app.get("/react/cart-items", (req, res) => {
  const userId = req.query.userId; // Extract userId from query parameters
  const sql = `
    SELECT carts.*, products.product_image, products.product_name, products.product_price
    FROM carts
    INNER JOIN products ON carts.product_id = products.id
    WHERE carts.user_id = ?
  `;
  con.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching cart items:", err);
      return res.status(500).json({ error: "Error fetching Cart items" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Cart items not found" });
    }
    res.status(200).json(results); // Return cart items with product details
  });
});
