require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./db');
const { ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Kết nối với MongoDB trước khi chạy server
connectDB().then(() => {
  const db = getDB();
  const controlCollection = db.collection('mau');

  // Lấy danh sách control
  app.get('/control', async (req, res) => {
    try {
      const controls = await db.collection('mau').find().toArray();
      res.json(controls);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Thêm một control mới
  app.post('/control', async (req, res) => {
    const {val,id}=req.body
    if (!val&&!id)
      return res.status(401).status("khong co truong data va id")
    try {
      const result = await controlCollection.updateOne({_id: id},{$set:{val}});
      res.status(201).json(req.body);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app.post('/chart', async (req, res) => {
    const { data, id } = req.body;
    
    if (!data || !id)  
      return res.status(401).json({ message: "Không có trường data và id" });
  
    try {
      const result = await db.collection("mausac").updateOne(
        { _id: new ObjectId(id) },
        { $set: { data: data } }, // Đặt data vào một field cụ thể
        { upsert: true } 
      );
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  
  app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
  });
}).catch((err) => console.error(err));
