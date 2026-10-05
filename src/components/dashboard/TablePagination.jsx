import PropTypes from "prop-types";

const TablePagination = ({ page, pageSize, totalPages, onPageChange, onPageSizeChange }) => {
  if (totalPages <= 0) return null;

  return (
    <div className="mt-6 flex items-center justify-between">
      <button
        type="button"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        className="rounded-md border px-4 py-2 disabled:opacity-40"
      >
        Back
      </button>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Page {page + 1} of {totalPages}</span>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          Items per page
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-md border px-2 py-1"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </label>
      </div>
      <button
        type="button"
        disabled={page + 1 >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="rounded-md border px-4 py-2 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

TablePagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
};

export default TablePagination;
