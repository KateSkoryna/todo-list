import {MongoClient} from 'mongodb'

const url = 'mongodb://root:password@localhost:27017';
const client = new MongoClient(url);

async function main() {
  await client.connect();
  const db = client.db('fyltura');
  const collection = db.collection('documents');
  await collection.insertMany([{name: 'Todolist No. 1'}, {name: 'Todolist No. 2'}]);
  return;
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
