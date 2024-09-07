import React, { useState } from 'react';

const CreatePossessionForm = () => {
    const [libelle, setLibelle] = useState('');
    const [valeur, setValeur] = useState('');
    const [dateDebut, setDateDebut] = useState('');
    const [taux, setTaux] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!libelle || !valeur || !dateDebut || !taux) {
            setError('All fields are required.');
            return;
        }

        const possessionInfo = {
            libelle,
            valeur: parseFloat(valeur),
            dateDebut,
            taux: parseFloat(taux),
        };

        try {
            const response = await fetch('http://localhost:3000/possession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(possessionInfo),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setSuccess('Possession created successfully!');
            setError(null);
            console.log(result);

            // Reset les inputs rehefa avy mitype
            setLibelle('');
            setValeur('');
            setDateDebut('');
            setTaux('');
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to create possession.');
            setSuccess(null);
        }
    };

    return (
        <div>
            <h1>Create a New Possession</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Libelle:
                    <input
                        type="text"
                        value={libelle}
                        onChange={(e) => setLibelle(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Valeur:
                    <input
                        type="number"
                        value={valeur}
                        onChange={(e) => setValeur(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Date Debut:
                    <input
                        type="date"
                        value={dateDebut}
                        onChange={(e) => setDateDebut(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Taux:
                    <input
                        type="number"
                        step="0.01"
                        value={taux}
                        onChange={(e) => setTaux(e.target.value)}
                    />
                </label>
                <br />
                <button type="submit">Create Possession</button>
            </form>
        </div>
    );
};

export default CreatePossessionForm;
