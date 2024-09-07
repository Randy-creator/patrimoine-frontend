import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import './Patrimoine.css'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Patrimoine = () => {
  const [dateDebut, setDateDebut] = useState(new Date());
  const [dateFin, setDateFin] = useState(new Date());
  const [jour, setJour] = useState(1);
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: "Valeur du Patrimoine",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        borderWidth: 1,
      },
    ],
  });

  const handleGetValeur = async () => {
    try {
      const response = await fetch("https://patrimoine-backend-5ma3.onrender.com/patrimoine/range", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateDebut, dateFin, jour }),
      });
      const result = await response.json();
      console.log("Données reçues:", result);

      const label = Object.keys(result.data);
      const value = Object.values(result.data);

      const chartData = {
        labels: label,
        datasets: [
          {
            label: "Valeur du Patrimoine",
            data: value,
            backgroundColor: "rgb(76, 145, 115, 0.2)",
            borderColor: "rgb(75, 192, 192)",
            borderWidth: 1,
          },
        ],
      };

      setData(chartData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center flex-column">
      <h1 className="d-flex justify-content-center fs-1 fw-bolder bg-success text-light">Statistique graphique du Patrimoine</h1>
      <div className="d-flex border w-50 justify-content-between align-center">
        <DatePicker
          selected={dateDebut}
          onChange={(date) => setDateDebut(date)}
          className="datePicker"
        />
        <h1>to</h1>
        <DatePicker selected={dateFin} onChange={(date) => setDateFin(date)} className="datePicker" />
      </div>
      <select value={jour} onChange={(e) => setJour(e.target.value)} className="mt-4">
        {[...Array(31).keys()].map((day) => (
          <option key={day + 1} value={day + 1}>
            {day + 1}
          </option>
        ))}
      </select>
      <button onClick={handleGetValeur} className="btn btn-success mt-4">Valider</button>
      <Bar
        data={data}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.raw}`;
                },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        }}
      />
      <Link to="/" className="btn btn-primary mb-3">
        Retourner a l'acceuil
      </Link>
    </div>
  );
};

export default Patrimoine;
