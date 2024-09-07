import React, { useState, useEffect } from "react";
import { Table, Form, Button, Modal } from "react-bootstrap";
import Patrimoine from "./models/Patrimoine.js";
import Personne from "./models/Personne.js";
import Possession from "./models/possessions/Possession.js";
import Flux from "./models/possessions/Flux.js";
import CreatePossessionForm from "./components/createPossession.jsx";

const PossessionsTable = () => {
  const [possessions, setPossessions] = useState([]);
  const [dateFin, setDateFin] = useState("");
  const [patrimoine, setPatrimoine] = useState(null);
  const [resultat, setResultat] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedPossession, setSelectedPossession] = useState(null);
  const [updateLibelle, setUpdateLibelle] = useState("");
  const [updateDateFin, setUpdateDateFin] = useState("");

  useEffect(() => {
    const possesseur = new Personne("John Doe");
    async function fetchData() {
      try {
        const response = await fetch("https://patrimoine-backend-5ma3.onrender.com/possession");
        const result = await response.json();
        const possessions = result[1].data.possessions;
        const possessionList = [];

        for (const possession of possessions) {
          if (possession.jour === undefined) {
            possessionList.push(
              new Possession(
                possesseur,
                possession.libelle,
                possession.valeur,
                new Date(possession.dateDebut),
                possession.dateFin,
                possession.tauxAmortissement,
              ),
            );
          } else {
            possessionList.push(
              new Flux(
                possesseur,
                possession.libelle,
                possession.valeur,
                new Date(possession.dateDebut),
                possession.dateFin,
                possession.tauxAmortissement,
                possession.jour,
              ),
            );
          }
        }

        const patrimoine = new Patrimoine(possesseur, possessionList);
        setPatrimoine(patrimoine);
        setPossessions(possessionList);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error.message);
        console.error("Détails:", error);
      }
    }

    fetchData();
  }, []);

  const handleCalculate = () => {
    if (patrimoine && dateFin) {
      const date = new Date(dateFin);
      if (isNaN(date.getTime())) {
        setResultat("Format de Date non valide!");
        return;
      }

      const possessionWithInvalidDate = possessions.find(
        (possession) => date < new Date(possession.dateDebut),
      );
      if (possessionWithInvalidDate) {
        setResultat(
          "Le calcul du patrimoine ne peut pas se faire car certaines possessions ne sont pas encore acquises à cette date.",
        );
        return;
      }

      const valeur = patrimoine.getValeur(date);
      if (isNaN(valeur)) {
        setResultat("Les valeurs saisies ne sont pas valides!");
      } else {
        setResultat(
          `Le patrimoine de ${patrimoine.possesseur.nom} à la date ${date.toLocaleDateString()} est de : ${valeur.toFixed(1 )} Ar`,
        );
      }
    } else {
      setResultat("Date de fin ou patrimoine non défini");
    }
  };

  const handleCloseCreateModal = () => setShowCreateModal(false);
  const handleShowCreateModal = () => setShowCreateModal(true);

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedPossession(null);
    setUpdateLibelle("");
    setUpdateDateFin("");
  };

  const handleShowUpdateModal = (possession) => {
    setSelectedPossession(possession);
    setUpdateLibelle(possession.libelle);
    setUpdateDateFin(possession.dateFin || "");
    setShowUpdateModal(true);
  };

  const handleUpdatePossession = () => {
    if (!selectedPossession) return;

    fetch(`https://patrimoine-backend-5ma3.onrender.com/possession/${selectedPossession.libelle}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        libelle: updateLibelle,
        dateFin: updateDateFin
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update possession");
        }
        return response.json();
      })
      .then(() => {
        setPossessions((prev) =>
          prev.map((pos) =>
            pos.libelle === selectedPossession.libelle
              ? { ...pos, libelle: updateLibelle, dateFin: updateDateFin }
              : pos,
          ),
        );
        handleCloseUpdateModal();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Erreur lors de la mise à jour de la possession");
      });
  };

  return (
    <div>
      <h3 id="guy">Propriétaire : {patrimoine?.possesseur.nom}</h3>
      <Table id="table" striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: '10%' }}>Libellé</th>
            <th style={{ width: '10%' }}>Valeur Initiale</th>
            <th style={{ width: '10%' }}>Date Début</th>
            <th style={{ width: '10%' }}>Date Fin</th>
            <th style={{ width: '5%' }}>Amortissement</th>
            <th style={{ width: '15%' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {possessions.map((possession, index) => (
            <tr key={index}>
              <td>{possession.libelle}</td>
              <td>
                {possession instanceof Flux
                  ? "0 Ar"
                  : `${possession.valeur} Ar`}
              </td>
              <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
              <td>
                {possession.dateFin
                  ? new Date(possession.dateFin).toLocaleDateString()
                  : "Non défini"}
              </td>
              <td>
                {possession.tauxAmortissement
                  ? `${possession.tauxAmortissement} %`
                  : ""}
              </td>
              <td className="container d-flex justify-content-around">
                <Button
                  onClick={() => handleShowUpdateModal(possession)}
                  variant="success"
                >
                  Update
                </Button>
                <Button
                  onClick={() => handleClosePossession(possession.libelle)}
                  variant="danger"
                >
                  Close
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

        <Button variant="success" onClick={handleShowCreateModal} className="container d-flex justify-content-center mt-6">
          Ajouter une nouvelle possession
        </Button>

      <div id="dateFinContainer" className="container d-flex justify-content-evenly mt-4">
        <Form.Group controlId="dateFin">
          <Form.Control
            type="date"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className="w-100 border border-dark"
          />
        </Form.Group>
        <Button id="btn" onClick={handleCalculate}>
          Calculer le patrimoine
        </Button>
        
      </div>

      <Form.Group controlId="resultat" className="mt-4">
        <Form.Control
          type="text"
          placeholder="Résultat"
          value={resultat}
          readOnly
          className="container border border-dark"s
        />
      </Form.Group>

      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une nouvelle possession</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreatePossessionForm />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Mettre à jour la possession</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPossession && (
            <Form>
              <Form.Group controlId="updateLibelle">
                <Form.Label>Libellé</Form.Label>
                <Form.Control
                  type="text"
                  value={updateLibelle}
                  onChange={(e) => setUpdateLibelle(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="updateDateFin">
                <Form.Label>Date de Fin</Form.Label>
                <Form.Control
                  type="date"
                  value={updateDateFin}
                  onChange={(e) => setUpdateDateFin(e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleUpdatePossession}>
            update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PossessionsTable;
