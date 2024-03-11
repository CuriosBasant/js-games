function create2DArray (row) {
  const empty = [];
  const array = Array.from({ length: row }).fill(empty.slice());
  return array;
}