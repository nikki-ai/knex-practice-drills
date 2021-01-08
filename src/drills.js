'use strict';

require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});

//#1 find items that contain dynamic search term
function searchByProduceName(searchTerm) {
  knexInstance
    .select('id', 'name', 'price', 'category')
    .from('shopping_list')
    .where('name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result);
    });
}
searchByProduceName('salmock');

//#2 paginate all items
function paginateItems(page) {
  const productsPerPage = 6;
  const offset = productsPerPage * (page - 1);
  knexInstance
    .select('id', 'name', 'price', 'category')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {console.log(result)});
}
paginateItems(1);

//sort items by specified date
function itemsAfterDay(days) {
  knexInstance
    .select('name', 'price')
    .count('date_added')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, days)
    )
    .from('shopping_list')
    .groupBy('name', 'price')
    .then((result) => {
      console.log(result);
    });
}
itemsAfterDay(3);

//total cost for each category
function totalCost() {
  knexInstance
    .select('category')
    .sum('price as total')
    .from('shopping_list')
    .groupBy('category')
    .then((result) => {console.log(result)});
}

totalCost();