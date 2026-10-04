import Swal from "sweetalert2";

const toast = (icon, title) => {
  Swal.fire({
    icon,
    title,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });
};

export const showSuccessToast = (message) => toast("success", message);
export const showErrorToast = (message) => toast("error", message);

