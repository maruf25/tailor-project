const moment = require("moment");

const formatRupiah = (angka) => {
  var number_string = angka.replace(/[^,\d]/g, "").toString(),
    split = number_string.split(","),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    var separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;

  return "Rp. " + rupiah;
};

function CountdownTimer(targetDate) {
  const now = moment();
  const days = moment(targetDate).diff(now, "days");

  const minusClass =
    days < 0
      ? "text-center bg-red-500 text-white p-2 rounded-lg"
      : "text-center p-2 bg-green-500 text-white rounded-lg";

  return `<p class="${minusClass}">${days} hari lagi</p>`;
}

exports.orderHtml = (orders, startNumber) => {
  //    Kurang countDownTimer
  return `<html>
  <head>
    <meta charset="UTF-8">
    <title>Order</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div class="relative mt-5 overflow-x-auto shadow-md sm:rounded-lg">
      <table id="tableorder" class="w-full text-sm text-left text-gray-500 rtl:text-right ">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" class="px-6 py-3">
              No
            </th>
            <th scope="col" class="px-6 py-3">
              Name
            </th>
              <th scope="col" class="px-6 py-3">
                username
              </th>
            <th scope="col" class="px-6 py-3 whitespace-nowrap">
              Size (CM)
            </th>
            <th scope="col" class="px-6 py-3">
              Description
            </th>
            <th scope="col" class="px-6 py-3">
              Price
            </th>
            <th scope="col" class="px-6 py-3">
              Deadline
            </th>
            <th scope="col" class="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          ${
            orders.length === 0 &&
            `<tr class="bg-white border-b ">
              <td
                scope="row"
                colSpan="10"
                class="px-6 py-4 font-medium text-center text-gray-900 "
              >
                No Product Found
              </td>
            </tr>`
          }
          ${orders.map(
            (order, key) =>
              `<tr class="bg-white border-b " key=${key}>
              <td class="px-6 py-4">${startNumber + key + 1}</td>
              <th scope="row" class="px-6 py-4 font-medium text-gray-900 ">
                 (${order.user.name}) ${order.name}
              </th>
              <td class="px-6 py-4">${order.user.username}</td>
              <td class="px-6 py-4 ">
                <ul class="text-right whitespace-nowrap">
                  <li>Panjang Bahu: ${order.bahu}</li>
                  <li>Panjang Dada: ${order.dada}</li>
                  <li>Panjang Tangan: ${order.panjang_tangan}</li>
                  <li>Panjang Bahu: ${order.panjang_badan}</li>
                  <li>Lebar Tangan: ${order.lebar_tangan}</li>
                  <li>Lebar Depan: ${order.lebar_depan}</li>
                  <li>Lebar Belakang: ${order.lebar_belakang}</li>
                  <li>Lebar Pinggang: ${order.lebar_pinggang}</li>
                  <li>Lebar Pinggul: ${order.lebar_pinggul}</li>
                </ul>
              </td>
              <td class="px-6 py-4">${order.description}</td>
              <td class="px-6 py-4">${formatRupiah(order.price.toString())}</td>
              <td class="px-6 py-4">
                <p>${moment(order.deadline).format("dddd, DD/MM/YYYY")}</p>
                ${CountdownTimer(order.deadline)}
              </td>
              <td class="px-6 py-4 font-bold">${order.status.toUpperCase()}</td>
            </tr>`
          )}
        </tbody>
      </table>
    </div>
  </body>
  </html>`;
};

exports.transactionHtml = (transactions, role, startNumber) => {
  return `
    <html>
  <head>
    <meta charset="UTF-8">
    <title>Order</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table
        id="tabletransaction"
        class="w-full text-sm text-left text-gray-500 rtl:text-right "
      >
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
          <tr>
            <th scope="col" class="px-6 py-3">
              No
            </th>
            <th scope="col" class="px-6 py-3 w-80">
              Date
            </th>
            ${
              role === "admin" &&
              `<th scope="col" class="px-6 py-3">
                Customer Name
              </th>`
            }
            <th scope="col" class="px-6 py-3">
              Product Name
            </th>
            <th scope="col" class="px-6 py-3 whitespace-nowrap">
              Size (CM)
            </th>
            ${
              role === "admin" &&
              `<th scope="col" class="px-6 py-3">
                Image
              </th>`
            }
            <th scope="col" class="px-6 py-3">
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          ${
            transactions.length === 0 &&
            `<tr class="bg-white border-b hover:bg-gray-50 ">
              <td
                scope="row"
                colSpan="5"
                class="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap "
              >
                No Transaction Found
              </td>
            </tr>`
          }
          ${transactions.map(
            (transaction, key) =>
              `<tr key=${key} class="bg-white border-b hover:bg-gray-50 ">
              <td class="px-6 py-4">${startNumber + key + 1}</td>
              <td class="px-6 py-4">${moment(transaction.updatedAt).format("LLLL")}</td>
              ${
                role === "admin" &&
                `<th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                >
                  <a href="">${transaction.user.name}</a>
                </th>`
              }
              <td class="px-6 py-4">${transaction.name}</td>
              <td class="px-6 py-4 ">
                <ul class="text-right whitespace-nowrap">
                  <li>Panjang Bahu: ${transaction.bahu}</li>
                  <li>Panjang Dada: ${transaction.dada}</li>
                  <li>Panjang Tangan: ${transaction.panjang_tangan}</li>
                  <li>Panjang Bahu: ${transaction.panjang_badan}</li>
                  <li>Lebar Tangan: ${transaction.lebar_tangan}</li>
                  <li>Lebar Depan: ${transaction.lebar_depan}</li>
                  <li>Lebar Belakang: ${transaction.lebar_belakang}</li>
                  <li>Lebar Pinggang: ${transaction.lebar_pinggang}</li>
                  <li>Lebar Pinggul: ${transaction.lebar_pinggul}</li>
                </ul>
              </td>
              ${
                role === "admin" &&
                `<td class="px-6 py-4">
                  <img
                    src=${"../" + transaction.image}
                    alt="image"
                    class="h-[200px] w-[200px] object-contain"
                  />
                </td>`
              }
              <td class="px-6 py-4">${formatRupiah(transaction.price.toString())}</td>
            </tr>`
          )}
        </tbody>
      </table>
    </div>
  </body>
   </html>`;
};

exports.spendingHtml = (spendings, startNumber) => {
  const regex = /kain/i;

  return `
   <html>
  <head>
    <meta charset="UTF-8">
    <title>Spending</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          id="tablespending"
          class="w-full text-sm text-left text-gray-500 rtl:text-right "
        >
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" class="px-6 py-3">
                No
              </th>
              <th scope="col" class="px-6 py-3">
                Name
              </th>
              <th scope="col" class="px-6 py-3">
                Price
              </th>
              <th scope="col" class="px-6 py-3">
                Quantity
              </th>
              <th scope="col" class="px-6 py-3">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            ${
              spendings.length === 0 &&
              `<tr class="bg-white border-b hover:bg-gray-50 ">
                <td
                  scope="row"
                  colSpan="6"
                  class="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap "
                >
                  No Transaction Found
                </td>
              </tr>`
            }
            ${spendings.map(
              (spending, key) =>
                `<tr key=${key} class="bg-white border-b hover:bg-gray-50 ">
                <td class="px-6 py-4">${startNumber + key + 1}</td>
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  ${spending.inventory.name}
                </th>
                <td class="px-6 py-4">${formatRupiah(spending.price.toString())}</td>
                <td class="px-6 py-4">
                  ${spending.quantity} ${regex.test(spending.inventory.name) ? "m" : "pcs"}
                </td>
                <td class="px-6 py-4">${moment(spending.createdAt).format("LLLL")}</td>
              </tr>`
            )}
          </tbody>
        </table>
      </div>
  </body>
   </html>`;
};

exports.inventoryHtml = (inventories, startNumber) => {
  const regex = /kain/i;

  return `
   <html>
  <head>
    <meta charset="UTF-8">
    <title>Inventory</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
  <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table
          id="tableinventory"
          class="w-full text-sm text-left text-gray-500 rtl:text-right "
        >
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" class="px-6 py-3">
                No
              </th>
              <th scope="col" class="px-6 py-3">
                Name
              </th>
              <th scope="col" class="px-6 py-3">
                Description
              </th>
              <th scope="col" class="px-6 py-3">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody>
            ${
              inventories.length === 0 &&
              `<tr class="bg-white border-b hover:bg-gray-50 ">
                <td
                  scope="row"
                  colSpan="6"
                  class="px-6 py-4 font-medium text-center text-gray-900 whitespace-nowrap "
                >
                  No Inventory Found
                </td>
              </tr>`
            }
            ${inventories.map(
              (inventory, key) =>
                `<tr key=${key} class="bg-white border-b hover:bg-gray-50 ">
                <td class="px-6 py-4">${startNumber + key + 1}</td>
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                  ${inventory.name}
                </th>
                <td class="px-6 py-4">${inventory.description}</td>
                <td class="px-6 py-4">
                  ${inventory.quantity} ${regex.test(inventory.name) ? "m" : "pcs"}
                </td>
              </tr>`
            )}
          </tbody>
        </table>
      </div>
  </body>
   </html>`;
};
