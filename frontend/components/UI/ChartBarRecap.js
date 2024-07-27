import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { formatRupiah } from "@/utils/formatRupiah";
import moment from "moment";

// Register the necessary components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const ChartBarRecap = (props) => {
  // Helper function to group data by date and stack
  const groupDataByDateAndStack = (data) => {
    const groupedData = {};

    data.forEach((item) => {
      const date = item.x;
      const stack = item.stack;
      if (!groupedData[date]) {
        groupedData[date] = {};
      }
      if (!groupedData[date][stack]) {
        groupedData[date][stack] = { total: 0, items: [] };
      }
      groupedData[date][stack].total += item.y;
      groupedData[date][stack].items.push(item);
    });

    return groupedData;
  };

  const rawData = props.recaps.map((recap) => {
    // Extract date part only (YYYY-MM-DD)
    const date = moment(recap.date).format("DD MMMM YYYY");

    return {
      x: date,
      y: recap.amount,
      name: recap.name,
      stack: recap.tipe,
    };
  });

  const groupedData = groupDataByDateAndStack(rawData);
  const labels = Object.keys(groupedData);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Pemasukan",
        data: labels
          .map((date) => ({
            x: date,
            y: groupedData[date]["masuk"] ? groupedData[date]["masuk"].total : 0,
            items: groupedData[date]["masuk"] ? groupedData[date]["masuk"].items : [],
          }))
          .filter((d) => d.y > 0),
        backgroundColor: "green",
        stack: "masuk",
        barPercentage: 0.5, // Adjust the bar width
        categoryPercentage: 0.5, // No spacing between categories
      },
      {
        label: "Pengeluaran",
        data: labels
          .map((date) => ({
            x: date,
            y: groupedData[date]["keluar"] ? groupedData[date]["keluar"].total : 0,
            items: groupedData[date]["keluar"] ? groupedData[date]["keluar"].items : [],
          }))
          .filter((d) => d.y > 0),
        backgroundColor: "red",
        stack: "keluar",
        barPercentage: 0.5, // Adjust the bar width
        categoryPercentage: 0.5, // No spacing between categories
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "category",
        labels: labels,
        stacked: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value, index, values) {
            return formatRupiah(value.toString());
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context) => {
            const category = context[0].dataset.label;
            const date = context[0].label;
            return `${category} - ${date}`;
          },
          label: function (context) {
            const dataPoint = context.raw;
            const items = dataPoint.items || [];
            let tooltipText = [`Total: ${formatRupiah(dataPoint.y.toString())}`];
            items.forEach((item) => {
              tooltipText.unshift(`${item.name}: ${formatRupiah(item.y.toString())}`);
            });
            return tooltipText;
          },
        },
      },
    },
  };

  return (
    <div className="">
      <Bar data={data} options={options} />
      <div className="flex justify-center">
        <div className="mt-[20px] text-gray-700 uppercase text-right font-semibold">
          <p>
            Total Pemasukan :{" "}
            {props.total?.totalIncome ? formatRupiah(props.total.totalIncome.toString()) : 0}
          </p>
          <p>
            Total Pengeluaran :{" "}
            {props.total?.totalSpending ? formatRupiah(props.total.totalSpending.toString()) : 0}
          </p>
          <p>Saldo : {props.total?.saldo ? formatRupiah(props.total.saldo.toString()) : 0}</p>
        </div>
      </div>
    </div>
  );
};

export default ChartBarRecap;
