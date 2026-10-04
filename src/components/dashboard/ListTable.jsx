/* eslint-disable react/prop-types */
import "../../pages/dashboard/dashboardTables.css";

const ListTable = ({ columns, children, emptyMessage }) => (
  <div className="dashboard-table-wrapper">
    <table className="dashboard-table">
      <thead>
        <tr>
          {columns.map(({ label, className = "" }) => (
            <th key={label} className={className}>
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {children || (
          <tr>
            <td colSpan={columns.length} className="dashboard-table-empty">
              {emptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default ListTable;
