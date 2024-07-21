const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");

const app = express();
const port = 8081;

// const path = require("path");

// Serve static files from the React app
// app.use(express.static(path.join(__dirname, "build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

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
app.use(bodyParser.urlencoded({ extended: true }));

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

// API lấy thông tin người dùng dựa trên userId
app.get("/react/userRoles/:userId", (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT * FROM users WHERE id = ?";

  con.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching user roles:", err);
      return res.status(500).json({ error: "Error fetching user roles" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results[0];
    res.json(user); // Trả về toàn bộ thông tin của user
  });
});

//Add to cart API
app.post("/react/add-to-cart", (req, res) => {
  const { userId, productId, quantity } = req.body;
  const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");

  if (!userId || !productId || !quantity) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const checkSql = "SELECT * FROM carts WHERE user_id = ? AND product_id = ?";
  con.query(checkSql, [userId, productId], (checkErr, checkResult) => {
    if (checkErr) {
      console.error("Error checking cart:", checkErr);
      return res.status(500).json({ error: "Error checking cart" });
    }

    if (checkResult.length > 0) {
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
    SELECT carts.*, products.product_image, products.product_name, products.product_price,products.product_quantity
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
// Endpoint to save cart items
app.post("/react/save-cart", (req, res) => {
  const { userId, cartItems } = req.body;

  if (!userId || !cartItems || !Array.isArray(cartItems)) {
    return res.status(400).json({ error: "Invalid request payload." });
  }

  // Delete existing cart items for the user
  const deleteSql = `DELETE FROM carts WHERE user_id = ?`;
  con.query(deleteSql, [userId], (deleteErr, deleteResults) => {
    if (deleteErr) {
      console.error("Error deleting cart items:", deleteErr);
      return res.status(500).json({ error: "Error deleting cart items" });
    }

    // Insert new cart items
    const insertSql = `INSERT INTO carts (user_id, product_id, quantity) VALUES ?`;
    const values = cartItems.map((item) => [
      userId,
      item.product_id,
      item.quantity,
    ]);

    con.query(insertSql, [values], (insertErr, insertResults) => {
      if (insertErr) {
        console.error("Error inserting cart items:", insertErr);
        return res.status(500).json({ error: "Error inserting cart items" });
      }

      res.json({ message: "Cart saved successfully." });
    });
  });
});

// Delete cart item by ID
app.post("/react/delete-cart/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM carts WHERE id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ message: "An error occurred while deleting the cart item." });
    }

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Cart item deleted successfully." });
    } else {
      res.status(404).json({ message: "Cart item not found." });
    }
  });
});

//Clear cart
app.post("/react/clear-cart", (req, res) => {
  const userId = req.body.userId;
  const sql = "DELETE FROM carts WHERE user_id = ?";

  con.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to clear cart" });
    }
    res.json({ message: "Cart cleared successfully" });
  });
});

//Check out API
//1. Update info user
app.put("/react/update-user", (req, res) => {
  const { userId, fullname, email, phonenumber, address } = req.body;
  const sql = `UPDATE users SET fullname = ?, email = ?, phonenumber = ?, shipping_address = ? WHERE id = ?`;

  con.query(
    sql,
    [fullname, email, phonenumber, address, userId],
    (err, result) => {
      if (err) {
        console.error("Error updating user info:", err);
        res.status(500).send("Failed to update user info");
      } else {
        res.send("User info updated successfully");
      }
    }
  );
});

//2. if has info user, fetch with user_id
app.get("/react/show-user", (req, res) => {
  const userId = req.query.userId; // Lấy userId từ query parameters

  const sql = `SELECT * FROM users WHERE id = ?`;

  con.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching user info:", err);
      res.status(500).send("Failed to fetch user info");
    } else {
      if (result.length > 0) {
        const userInfo = result[0]; // Giả sử chỉ lấy thông tin của user đầu tiên trong kết quả
        res.send(userInfo);
      } else {
        res.status(404).send("User not found");
      }
    }
  });
});

//create order
app.post("/react/create-order", async (req, res) => {
  try {
    const { userId, totalAmount, shipFee, status, payment, orderDetails } =
      req.body;
    const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Insert order into 'orders' table
    const insertOrderSql =
      "INSERT INTO orders (user_id, total_amount, ship_fee, status, payment,created_at) VALUES (?, ?, ?, ?, ?,?)";
    con.query(
      insertOrderSql,
      [userId, totalAmount, shipFee, status, payment, createdAt],
      (err, result) => {
        if (err) {
          console.error("Error creating order:", err);
          res.status(500).json({ error: "Failed to create order" });
          return;
        }

        const orderId = result.insertId;

        // Insert order details into 'order_details' table
        const insertOrderDetailsSql =
          "INSERT INTO order_details (order_id, product_id, quantity,created_at) VALUES ?";
        const values = orderDetails.map((detail) => [
          orderId,
          detail.product_id,
          detail.quantity,
          createdAt,
        ]);

        con.query(insertOrderDetailsSql, [values], async (err, result) => {
          if (err) {
            console.error("Error creating order details:", err);
            res.status(500).json({ error: "Failed to create order details" });
            return;
          }

          try {
            // Delete items from cart table
            const deleteCartItemsSql = "DELETE FROM carts WHERE user_id = ?";
            await con.query(deleteCartItemsSql, [userId]);

            console.log("Deleted cart items for user:", userId);

            res.send("Order created successfully");
          } catch (deleteError) {
            console.error("Error deleting cart items:", deleteError);
            res.status(500).json({ error: "Failed to delete cart items" });
          }
        });
      }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

app.get("/react/show-orders", (req, res) => {
  const sql = `
    SELECT o.id, o.user_id, u.fullname, u.shipping_address, u.phonenumber, u.username,
           o.total_amount, o.ship_fee, o.status, o.payment, o.created_at,
           od.product_id, p.product_name AS product_name,
           p.product_price AS product_price,
           p.product_image AS product_image, od.quantity
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_details od ON o.id = od.order_id
    JOIN products p ON od.product_id = p.id
    ORDER BY o.id DESC`;

  con.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Failed to fetch orders" });
      return;
    }

    // Group orders by id and format response
    const orders = results.reduce((acc, row) => {
      const {
        id,
        user_id,
        username,
        fullname,
        shipping_address,
        phonenumber,
        total_amount,
        ship_fee,
        status,
        payment,
        created_at,
        product_id,
        product_name,
        product_price,
        product_image,
        quantity,
      } = row;

      if (!acc[id]) {
        acc[id] = {
          id,
          user: { user_id, fullname, shipping_address, phonenumber, username }, // Object containing user information
          total_amount,
          ship_fee,
          status,
          payment,
          created_at,
          orderDetails: [],
        };
      }

      acc[id].orderDetails.push({
        product_id,
        product_name,
        product_price,
        product_image,
        quantity,
      });

      return acc;
    }, {});

    const ordersArray = Object.values(orders);

    res.json(ordersArray);
  });
});

//fetch order with id to update status
app.get("/react/show-order/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  const sql = "SELECT * FROM orders WHERE id = ?";

  con.query(sql, [orderId], (err, result) => {
    if (err) {
      console.error("Error fetching order:", err);
      res.status(500).json({ error: "Failed to fetch order" });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json(result[0]);
  });
});

// Update order status with restriction to prevent changing from Delivered to any other status
app.put("/react/update-order-status/:orderId", (req, res) => {
  const orderId = req.params.orderId; // Get orderId from URL params
  const { status } = req.body; // Get status from request body

  // SQL query to fetch current status of the order
  const getCurrentStatusSql = "SELECT status FROM orders WHERE id = ?";

  con.query(getCurrentStatusSql, [orderId], (err, result) => {
    if (err) {
      console.error("Error fetching current order status:", err);
      res.status(500).json({ error: "Failed to update order status" });
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: `Order with id ${orderId} not found` });
      return;
    }

    const currentStatus = result[0].status;

    // Define order of statuses with restrictions
    const statusOrder = {
      Pending: ["Processing"],
      Processing: ["Shipped"],
      Shipped: ["Delivered"],
      Delivered: [],
    };

    // Check if current status allows update to new status
    if (
      !statusOrder[currentStatus] ||
      !statusOrder[currentStatus].includes(status)
    ) {
      res.status(400).json({
        error: `Cannot change status from ${currentStatus} to ${status}`,
      });
      return;
    }

    // SQL query to update order status in the database
    const updateStatusSql = "UPDATE orders SET status = ? WHERE id = ?";

    con.query(updateStatusSql, [status, orderId], (err, result) => {
      if (err) {
        console.error("Error updating order status:", err);
        res.status(500).json({ error: "Failed to update order status" });
        return;
      }

      console.log(`Order ${orderId} status updated to ${status}`);
      res.json({ message: `Order ${orderId} status updated to ${status}` });
    });
  });
});

//fetching theo order_id
app.get("/react/view-order/:orderId", (req, res) => {
  const orderId = req.params.orderId;

  const sql = `
    SELECT o.id, o.user_id, u.fullname, u.shipping_address, u.phonenumber, u.username,
           o.total_amount, o.ship_fee, o.status, o.payment, o.created_at,
           od.product_id, p.product_name AS product_name,
           p.product_price AS product_price,
           p.product_image AS product_image, od.quantity
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_details od ON o.id = od.order_id
    JOIN products p ON od.product_id = p.id
    WHERE o.id = ?
    ORDER BY o.id DESC`;

  con.query(sql, [orderId], (err, results) => {
    if (err) {
      console.error("Error fetching order:", err);
      res.status(500).json({ error: "Failed to fetch order" });
      return;
    }

    // Check if any results were returned
    if (results.length === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    // Group orders by id and format response
    const orders = results.reduce((acc, row) => {
      const {
        id,
        user_id,
        username,
        fullname,
        shipping_address,
        phonenumber,
        total_amount,
        ship_fee,
        status,
        payment,
        created_at,
        product_id,
        product_name,
        product_price,
        product_image,
        quantity,
      } = row;

      if (!acc[id]) {
        acc[id] = {
          id,
          user: { user_id, fullname, shipping_address, phonenumber, username }, // Object containing user information
          total_amount,
          ship_fee,
          status,
          payment,
          created_at,
          orderDetails: [],
        };
      }

      acc[id].orderDetails.push({
        product_id,
        product_name,
        product_price,
        product_image,
        quantity,
      });

      return acc;
    }, {});

    const ordersArray = Object.values(orders);

    res.json(ordersArray);
  });
});

//delete order
app.delete("/react/delete-order/:orderId", (req, res) => {
  const orderId = req.params.orderId;

  const sql = `
    DELETE FROM orders
    WHERE id = ?
  `;

  con.query(sql, [orderId], (err, results) => {
    if (err) {
      console.error("Error deleting order:", err);
      res.status(500).json({ error: "Failed to delete order" });
      return;
    }

    // Check if any rows were affected (meaning an order was deleted)
    if (results.affectedRows === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json({ message: "Order deleted successfully" });
  });
});

//fetch with user_id
app.get("/react/view-orders", (req, res) => {
  const userId = req.query.userId;

  const sql = `
    SELECT o.id, o.user_id, u.fullname, u.shipping_address, u.phonenumber, u.username,
           o.total_amount, o.ship_fee, o.status, o.payment, o.created_at,
           od.product_id, p.product_name AS product_name,
           p.product_price AS product_price,
           p.product_image AS product_image, od.quantity
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_details od ON o.id = od.order_id
    JOIN products p ON od.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.id DESC`;

  con.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Failed to fetch orders" });
      return;
    }

    // Check if any results were returned
    if (results.length === 0) {
      res.status(404).json({ error: "No orders found for this user" });
      return;
    }

    // Group orders by id and format response
    const orders = results.reduce((acc, row) => {
      const {
        id,
        user_id,
        username,
        fullname,
        shipping_address,
        phonenumber,
        total_amount,
        ship_fee,
        status,
        payment,
        created_at,
        product_id,
        product_name,
        product_price,
        product_image,
        quantity,
      } = row;

      if (!acc[id]) {
        acc[id] = {
          id,
          user: { user_id, fullname, shipping_address, phonenumber, username }, // Object containing user information
          total_amount,
          ship_fee,
          status,
          payment,
          created_at,
          orderDetails: [],
        };
      }

      acc[id].orderDetails.push({
        product_id,
        product_name,
        product_price,
        product_image,
        quantity,
      });

      return acc;
    }, {});

    const ordersArray = Object.values(orders);

    res.json(ordersArray);
  });
});

//search api
app.get("/react/search", (req, res) => {
  const query = req.query.query;
  const sql = "SELECT * FROM products WHERE product_name LIKE ?";
  con.query(sql, [`%${query}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Related products endpoint
app.get("/react/related-products/:productId", (req, res) => {
  const productId = req.params.productId;
  const sqlGetProductCategory = "SELECT category_id FROM products WHERE id = ?";

  con.query(sqlGetProductCategory, [productId], (err, productResult) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (productResult.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const category_id = productResult[0].category_id;

    const sqlGetRelatedProducts =
      "SELECT * FROM products WHERE category_id = ? AND id != ?";

    con.query(
      sqlGetRelatedProducts,
      [category_id, productId],
      (err, relatedProducts) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        res.json(relatedProducts); // Trả về dữ liệu relatedProducts thay vì câu truy vấn sqlGetRelatedProducts
      }
    );
  });
});

//Reviews
//show
app.get("/react/comments/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    const selectCommentsSql = `
      SELECT comments.*, users.username, users.fullname
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.product_id = ?
    `;

    con.query(selectCommentsSql, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ error: "Failed to fetch comments" });
        return;
      }

      res.status(200).json(results);
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

//create
app.post("/react/add-review/:productId", async (req, res) => {
  try {
    const { userId, rating, review } = req.body;
    const productId = req.params.productId; // Lấy productId từ URL params
    const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
    const status = "Pending"; // Mặc định trạng thái là pending

    // Kiểm tra xem người dùng đã mua sản phẩm này chưa
    const checkOrderSql = `
      SELECT od.product_id 
      FROM orders o 
      JOIN order_details od ON o.id = od.order_id 
      WHERE o.user_id = ? AND od.product_id = ?
    `;
    con.query(checkOrderSql, [userId, productId], (err, results) => {
      if (err) {
        console.error("Error checking order:", err);
        res.status(500).json({ error: "Failed to check order" });
        return;
      }

      if (results.length === 0) {
        // Nếu sản phẩm không tồn tại trong đơn hàng của người dùng
        res.status(403).json({ error: "User has not purchased this product" });
      } else {
        // Nếu sản phẩm tồn tại trong đơn hàng của người dùng, thêm đánh giá vào bảng 'comments'
        const insertReviewSql =
          "INSERT INTO comments (product_id, user_id, rating, review, status, created_at) VALUES (?, ?, ?, ?, ?, ?)";
        con.query(
          insertReviewSql,
          [productId, userId, rating, review, status, createdAt],
          (err, result) => {
            if (err) {
              console.error("Error adding review:", err);
              res.status(500).json({ error: "Failed to add review" });
              return;
            }

            res.status(200).json({ message: "Review added successfully" });
          }
        );
      }
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
});
