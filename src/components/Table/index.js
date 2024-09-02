import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { Divider } from "@nextui-org/divider";

const TableComponent = ({
    headerValues,
    rowValues,
    rowColor,
    withoutHeader = false,
    title,
}) => {
  return (
    <div className="table-container">
        {title && <span className="table-title">{title}</span>}
        {title && <Divider  className="section-divider"/>}
    <Table hideHeader={withoutHeader} removeWrapper aria-label="Example static collection table">
       <TableHeader>
        {headerValues.map((column) =>
          <TableColumn key={`table-header-value-${column.id}`} className="table-header-value">{column.label}</TableColumn>
        )}
      </TableHeader>
      <TableBody>
        {rowValues.map((row) =>
          <TableRow key={`table-row-${row.id}`} className={rowColor === 'lightBlue' ? "table-row-style-light" : "table-row-style-dark"}>
            {(columnKey) => <TableCell className="table-cell-value" >{getKeyValue(row, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    </div>
  );
}

export default TableComponent;
