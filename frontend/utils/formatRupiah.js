export const formatRupiah = (angka) => {
  const number_string = angka.replace(/[^\d]/g, "").toString();
  const sisa = number_string.length % 3;
  let rupiah = number_string.substr(0, sisa);
  const ribuan = number_string.substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  return "Rp. " + rupiah;
};

// export function formatRupiah(number) {
//   // Format angka menjadi string dengan dua desimal
//   const formattedNumber = Number(number).toFixed(2);

//   // Pisahkan bagian angka dan desimal
//   const parts = formattedNumber.toString().split(".");
//   const integerPart = parts[0];
//   const decimalPart = parts[1];

//   // Tambahkan titik sebagai pemisah ribuan
//   const integerFormatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

//   // Gabungkan kembali integer dan desimal
//   const result = `Rp ${integerFormatted},${decimalPart}`;

//   return result;
// }
