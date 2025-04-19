import fs from 'fs';
import path from 'path';
import db from '../config/db'; 

async function runSQLFile(filePath: string) {
  const sql = fs.readFileSync(filePath, 'utf-8');
  console.log(`Executing: ${path.basename(filePath)}`);
  await db.query(sql);
}

async function runMigrations() {
  try {
    console.log('Dropping and recreating public schema...');
    await db.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');

    const migrationsDir = path.join(__dirname, 'migrations');
    const seedersDir = path.join(__dirname, 'seeders');

    console.log('Running migrations...');
    const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql'));
    for (const file of migrationFiles) {
      await runSQLFile(path.join(migrationsDir, file));
    }

    console.log('Running seeders...');
    const seederFiles = fs.readdirSync(seedersDir).filter(f => f.endsWith('.sql'));
    for (const file of seederFiles) {
      await runSQLFile(path.join(seedersDir, file));
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

runMigrations();
