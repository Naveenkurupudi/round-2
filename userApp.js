const { Pool } = require('pg');
const exp = require('express');
const userApp = exp.Router();

const pool = new Pool({
  user: 'postgres',
  host: '52.62.219.4',//insert here new public api
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

async function createUsersTable() {
    const exists = await tableExists('usersTable');
    if (!exists) {
      try {
        await pool.query(`
          CREATE TABLE usersTable (
            sno SERIAL PRIMARY KEY,customer_name VARCHAR(100),age INT,phone VARCHAR(20),location VARCHAR(100),created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);
        console.log('usersTable created successfully');
      } catch (error) {
        console.error('Error creating users table:', error);
      }
    }
}

async function tableExists(tableName) {
    const result = await pool.query(`SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`, [tableName]);
    return result.rows[0].exists;
}

async function createUser(customer_name, age, phone, location) {
    try {
        const query = 'INSERT INTO usersTable(customer_name, age, phone, location) VALUES($1, $2, $3, $4) RETURNING *';
        const values = [customer_name, age, phone, location];
        const result = await pool.query(query, values);
        return result.rows[0];
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
}

userApp.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usersTable');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


userApp.post('/users', async (req, res) => {
  const {name, age, phone, location} = req.body;
  try {
      await createUsersTable(); // Check and create table if it doesn't exist
      const newUser = await createUser(name, age, phone, location);
      res.json(newUser);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = { userApp, createUsersTable };
