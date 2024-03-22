import { ReactFragment } from "react";

function ListGroup() {
  let items = ["New York", "San Franciso", "Tokyo", "London", "Paris"];
  items = [];

  return (
    <div>
      <h1>List</h1>
      {items.length === 0 && <p>No item found</p>}
      <ul className="list-group">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListGroup;
