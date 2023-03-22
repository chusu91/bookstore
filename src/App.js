import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { AgGridReact } from "ag-grid-react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBook from "./AddBook";

function App() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    fetch(
      "https://metropolia-bookstore-default-rtdb.europe-west1.firebasedatabase.app/books.json"
    )
      .then((response) => response.json())
      .then((data) => addKeys(data))
      .catch((err) => console.error(err));
  };

  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, "id", { value: keys[index] })
    );
    setBooks(valueKeys);
  };

  const addBook = (newBook) => {
    fetch(
      "https://metropolia-bookstore-default-rtdb.europe-west1.firebasedatabase.app/books/.json",
      {
        method: "POST",
        body: JSON.stringify(newBook),
      }
    )
      .then((response) => fetchItems())
      .catch((err) => console.error(err));
  };

  const deleteBook = (id) => {
    fetch(
      `https://metropolia-bookstore-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
      { method: "DELETE" }
    )
      .then((response) => fetchItems())
      .catch((err) => console.error(err));
  };

  const deleteBtn = (value) => {
    return (
      <IconButton
        onClick={() => deleteBook(value.data.id)}
        size="small"
        color="error"
      >
        <DeleteIcon />
      </IconButton>
    );
  };

  const [columnDefs] = useState([
    { field: "title" },
    { field: "author" },
    { field: "year", width: 100 },
    { field: "isbn" },
    { field: "price", width: 100 },
    {
      headerName: "",
      field: "id",
      cellRenderer: (value) => deleteBtn(value),
      width: 100,
    },
  ]);
  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
  }));

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">Bookstore</Typography>
        </Toolbar>
      </AppBar>
      <AddBook addBook={addBook} />
      <div
        className="ag-theme-material"
        style={{ height: 400, width: 1000, margin: "auto" }}
      >
        <AgGridReact
          rowData={books}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
        ></AgGridReact>
      </div>
    </div>
  );
}

export default App;
