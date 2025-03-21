# Node.js API with MongoDB and Redis Caching
## 📌 Project Overview



This project is a simple **Node.js API** that fetches product data from a **MongoDB** database and integrates **Redis caching** to optimize performance. Benchmarking is done using **Autocannon** to compare performance before and after caching.

## 🧠 Understanding Redis's Data Structures

### 🔹 Skip List - Data Structure Behind Redis Sorted Sets

Redis's impressive performance in handling sorted sets is largely attributed to its use of a **probabilistic data structure known as a skip list**. Skip lists allow Redis to perform search, insertion, and deletion operations efficiently, typically in **O(log N) time complexity**. This efficiency is achieved through multiple levels of linked lists, where higher levels "skip" over many elements, enabling rapid navigation through the dataset. This design choice simplifies implementation compared to balanced trees and offers excellent performance for a wide range of operations.

### 🔹 Bloom Filter - Probabilistic Data Model

A **Bloom Filter** is a memory-efficient probabilistic data structure introduced by **Burton Howard Bloom in 1970**. It is used to determine whether an element is **possibly present** in a dataset or **definitely absent**, meaning that:
- If an element is found, **it might exist** in the dataset.
- If an element is not found, **it is guaranteed to be absent**.

This makes Bloom Filters particularly useful for applications that require fast membership tests while conserving memory. 

#### **Why Use Bloom Filters?**
In Redis, **Bloom Filters** help optimize performance by **quickly identifying non-existent elements** before querying the database. This significantly reduces unnecessary lookups, leading to **faster query responses and lower memory consumption**.

Redis Bloom Filters are especially beneficial for tasks like:
- **Checking if a key exists before querying the database** (minimizing redundant DB hits)
- **Efficiently detecting cache misses**
- **Optimizing search operations and recommendation systems**

Bloom Filters offer **constant-time O(1) complexity** for membership tests, making them ideal for **high-performance applications like URL shortening services**, where quick lookups and minimal memory usage are critical.

---

## 📊 **Components**
Below are visual representations of the performance differences:



| **Node EndPoint** | **Redis and MongoDB Container** |
|-------------------------|-------------------------|
| ![image](https://github.com/user-attachments/assets/48ed7938-b0b6-4e64-9b88-fcab212dddd1) | ![image](https://github.com/user-attachments/assets/920b5633-5391-4242-9a51-a31666ee7dc3) |



| **MongoDB Compass** | **Redis** |
|--------------------------|------------------------------|
| ![image](https://github.com/user-attachments/assets/81ccc90c-667a-4b26-a390-225e1955fa43) | ![image](https://github.com/user-attachments/assets/c59946ec-5e19-4ee3-97b5-52d0145969cd) |



| **Benchmark Charts: Requests Per Second,Latency Percentiles,Total Requests Comparison** |
|---------------------------------|
| ![image](https://github.com/user-attachments/assets/472ffd6a-716e-4ebe-82d1-cd12229c6fb1) |





---



## 🔹 Key Observations using benchmark.js



| **Metric**                | **Without Redis**  | **With Redis**   | **Improvement** |
|---------------------------|--------------------|------------------|-----------------|
| **Total Requests**        | 71,635             | 91,945           | **+28.4%** 🔼 |
| **Errors**                | 0                  | 0                | No Change ✅ |
| **Timeouts**              | 0                  | 0                | No Change ✅ |
| **Avg Latency (ms)**      | 83.24 ms           | 64.87 ms         | **↓ 22.0%** 🔽 |
| **Max Latency (ms)**      | 360 ms             | 1,379 ms         | **Higher spikes in Redis case ⚠️** |
| **Median Latency (ms)**   | 82 ms              | 38 ms            | **↓ 53.7%** 🔽 |
| **Requests per Second**   | 1,193.92           | 1,532.59         | **+28.3%** 🔼 |
| **Throughput (KB/s)**     | 1,219.53 KB/s      | 1,565.34 KB/s    | **+28.3%** 🔼 |





---
## 🚀 Features
- Fetch products from MongoDB
- Implement **Redis caching** for improved performance
- Benchmark API performance using **Autocannon**
- **Compare results** before and after adding caching



---
## 🛠 Setup and Installation



### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/hasnain393/node-redis.git
cd node-redis
```



### **2️⃣ Install Dependencies**
```bash
npm install
```



### **3️⃣ Start Redis and MongoDB Using Docker**
Run the following commands to set up Redis and MongoDB containers:
```bash
docker run -d --name redis-stack -p 6379:6379 redis/redis-stack-server:latest



docker exec -it redis-stack redis-cli



docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=root mongo
```



Verify the running containers:
```bash
docker ps
```



### **4️⃣ Connect to MongoDB Using Compass**
Use the following connection string:
```
mongodb://root:root@localhost:27017/node_cache?authSource=admin
```



### **5️⃣ Start the Node.js Server**
```bash
node app.js
```
Server will run at:
```
http://localhost:4000/api/products
```



---
## 🏃 Running Performance Benchmarking
### **Without Redis Caching**
Run the benchmark before enabling Redis caching:
```bash
autocannon -c 100 -d 60 http://localhost:4000/api/products
```
This tests **100 concurrent users** for **60 seconds**.



### **With Redis Caching**
Modify `server.js` to integrate Redis caching (already implemented in this repo). Restart the server and re-run:
```bash
autocannon -c 100 -d 60 http://localhost:4000/api/products
```



---
## 📊 Key Performance Metrics
| Metric         | **Without Cache** | **With Redis Cache** | **Improvement** |
|---------------|------------------|---------------------|---------------|
| **Latency (Avg)** | **353.74 ms**    | **102.87 ms**       | **~3.4x faster** |
| **Max Latency** | **1551 ms**      | **239 ms**          | **6.5x better** |
| **Requests/Sec (Avg)** | **282.32**     | **967.52**          | **3.4x more requests handled** |
| **Total Requests** | **17k**         | **58k**             | **3.4x more requests processed** |
| **Data Transferred (Bytes/Sec)** | **2.1 MB/s**      | **7.21 MB/s**       | **3.4x more throughput** |



---
## 📌 What This Means
- **Before Redis**: Every request hit MongoDB directly, causing high latency (**353 ms avg**) and **low throughput** (only **17k requests** in 60 sec).
- **After Redis**: Cached responses were served instantly, **reducing latency to 102 ms** and **handling 3.4x more requests** in the same time.



---
## 🔥 Final Takeaways
✔ **Redis caching massively improves performance**, reducing latency and increasing request handling.  
✔ **API scales efficiently**, handling **3.4x more requests** after caching.  
✔ **Optimized for high-performance read operations**.  



🚀 Now your API is ready for **high-speed performance with Redis caching!**
---
