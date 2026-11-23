const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/Week4';
const PersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  gender: String,
  salary: Number,
  city: String
});
const Person = mongoose.model('Person', PersonSchema, 'personCollection');

async function insertOne() {
  const person = new Person({
    name: 'NHQ', age: 32, gender: 'Male', salary: 1234, city: 'London'
  });
  console.log('Task 1 – Insert one document');
  console.log(await person.save());
}

async function insertMany() {
  console.log('Task 2 – Insert multiple documents');
  const people = await Person.insertMany([
    { name: 'SimonNHQ', age: 42, gender: 'Male', salary: 3456, city: 'London' },
    { name: 'NeeshaNN', age: 53, gender: 'Female', salary: 1000, city: 'Manchester' },
    { name: 'MaryNHQ', age: 27, gender: 'Female', salary: 5402, city: 'London' },
    { name: 'MikeNJQ', age: 40, gender: 'Male', salary: 4519, city: 'Birmingham' }
  ]);
  console.table(people.map(person => person.toObject()));
}

async function findAll() {
  console.log('Task 3 – People sorted by salary');
  console.table(await Person.find().sort({ salary: 1 }).select('name salary age -_id').limit(100).lean());
}

async function findFemalesOver30() {
  console.log('Task 4 – Females aged 30 or above');
  const people = await Person.find({ gender: 'Female', age: { $gte: 30 } })
    .sort({ salary: 1 }).select('name salary age -_id').limit(10).lean();
  console.table(people);
}

async function countDocuments() {
  console.log('Task 5 – Total documents:', await Person.countDocuments());
}

async function deleteManyPersons() {
  const result = await Person.deleteMany({ age: { $gte: 45 } });
  console.log('Task 6 – Documents deleted:', result.deletedCount);
}

async function updateManyPersons() {
  const result = await Person.updateMany({ gender: 'Female' }, { $set: { salary: 5555 } });
  console.log('Task 7 – Salaries updated:', result.modifiedCount);
}

async function findByCity(city) {
  const people = await Person.find({ city }).sort({ name: 1 })
    .select('name age gender salary city -_id').lean();
  console.log('Portfolio Task – People from', city);
  console.table(people);
}

async function main() {
  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to', MONGO_URI);

    // Seed the sample data once so reruns do not add duplicate records.
    if (await Person.countDocuments() === 0) {
      await insertOne();
      await insertMany();
    } else {
      console.log('Tasks 1–2 – Using existing lab records.');
    }
    await findAll();
    await findFemalesOver30();
    await countDocuments();
    await deleteManyPersons();
    await updateManyPersons();
    await findByCity(process.argv.slice(2).join(' ') || 'London');
  } catch (error) {
    console.error('Lab failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
