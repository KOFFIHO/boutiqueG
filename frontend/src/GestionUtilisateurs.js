import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './GestionUtilisateurs.css';

const GestionUtilisateurs = () => {
  const [users, setUsers] = useState([]);
  const [utilisateurActif, setUtilisateurActif] = useState(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('VENDEUR');
  const [isActive, setIsActive] = useState(true);
  const [isStaff, setIsStaff] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log("📡 Chargement des utilisateurs...");
    axios.get('http://127.0.0.1:8000/api/utilisateurs/')
      .then((res) => {
        console.log("✅ Utilisateurs récupérés :", res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("❌ Erreur lors du chargement des utilisateurs :", err);
      });
  }, []);

  const modifierUtilisateur = (user) => {
    console.log("✏️ Modification utilisateur :", user);
    setUtilisateurActif(user);
    setUsername(user.username);
    setEmail(user.email);
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setRole(user.role);
    setIsActive(user.is_active);
    setIsStaff(user.is_staff);
    setIsSuperuser(user.is_superuser);
    setPassword('');
  };

  const nouveauUtilisateur = () => {
    console.log("➕ Ajout d'un nouvel utilisateur");
    setUtilisateurActif({});
    setUsername('');
    setEmail('');
    setFirstName('');
    setLastName('');
    setRole('VENDEUR');
    setIsActive(true);
    setIsStaff(false);
    setIsSuperuser(false);
    setPassword('');
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    console.log("🔄 Rôle sélectionné :", selectedRole);
    setRole(selectedRole);

    if (selectedRole === 'ADMIN') {
      setIsStaff(true);
      setIsSuperuser(true);
    } else {
      setIsSuperuser(false);
    }
  };

  const enregistrerModification = (userId) => {
    console.log(userId ? "💾 Modification utilisateur ID :" : "🆕 Création utilisateur", userId);

    if (!username.trim()) return alert("❌ Le nom d'utilisateur est requis.");
    if (!firstName.trim()) return alert("❌ Le prénom est requis.");
    if (!lastName.trim()) return alert("❌ Le nom est requis.");
    if (!email.trim()) return alert("❌ L'email est requis.");

    const data = {
      username,
      email,
      first_name: firstName,
      last_name: lastName,
      role,
      is_active: isActive,
      is_staff: isStaff,
      is_superuser: isSuperuser,
    };

    if (password.trim()) {
      data.password = password;
    }

    console.log("📤 Données envoyées :", data);

    const url = 'http://127.0.0.1:8000/api/utilisateurs/';
    const endpoint = userId ? `${url}${userId}/` : url;
    const method = userId ? axios.patch : axios.post;

    method(endpoint, data)
      .then((res) => {
        console.log("✅ Utilisateur enregistré :", res.data);

        if (!userId) {
          setUsers(prev => [...prev, res.data]);
        } else {
          setUsers(prev =>
            prev.map(u => u.id === userId ? { ...u, ...data } : u)
          );
        }
        setUtilisateurActif(null);
      })
      .catch((err) => {
        console.error("❌ Erreur lors de l’enregistrement :", err.response?.data || err);
        if (err.response?.data?.email) {
          alert("❌ Erreur : cet email existe déjà.");
        } else {
          alert("❌ Erreur lors de l’enregistrement.");
        }
      });
  };

  const supprimerUtilisateur = (userId) => {
    if (window.confirm("Supprimer cet utilisateur ?")) {
      console.log("🗑️ Suppression utilisateur ID :", userId);
      axios.delete(`http://127.0.0.1:8000/api/utilisateurs/${userId}/`)
        .then(() => {
          console.log("✅ Utilisateur supprimé");
          setUsers(prev => prev.filter(u => u.id !== userId));
        })
        .catch((err) => {
          console.error("❌ Erreur lors de la suppression :", err);
        });
    }
  };

  return (
    <div className="fond" style={{
      backgroundImage: "url('/fond.gif')",
      backgroundSize: 'cover',
      minHeight: '100vh'
    }}>
      <div className="carte">
        <h1 style={{ textAlign: 'center', color: 'white' }}>LISTE DES UTILISATEURS</h1>

        {utilisateurActif && (
          <div className="modale">
            <h2>{utilisateurActif.id ? "Modifier" : "Ajouter"} un utilisateur</h2>

            <label>Nom d'utilisateur :</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} />

            <label>Prénom :</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />

            <label>Nom :</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} />

            <label>Email :</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label>Rôle :</label>
            <select value={role} onChange={handleRoleChange}>
              <option value="ADMIN">Administrateur</option>
              <option value="GERANT">Gestionnaire</option>
              <option value="VENDEUR">Vendeur</option>
            </select>

            <label>
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
              Actif
            </label>

            <label>
              <input type="checkbox" checked={isStaff} disabled /> Admin (activé automatiquement si ADMIN)
            </label>

            <label>
              <input type="checkbox" checked={isSuperuser} disabled /> Statut super-utilisateur (activé automatiquement si ADMIN)
            </label>

            <label>Mot de passe :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={utilisateurActif?.id ? "Laisser vide pour ne pas changer" : "Mot de passe requis"}
            />

            <div className="actions">
              <button onClick={() => enregistrerModification(utilisateurActif.id)}>Enregistrer</button>
              <button onClick={() => setUtilisateurActif(null)}>Annuler</button>
            </div>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Nom d'utilisateur</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actif</th>
              <th>Admin</th>
              <th>Superuser</th>
              <th>
                Actions<br />
                <button onClick={nouveauUtilisateur}>➕ Ajouter</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="9">Aucun utilisateur trouvé.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td>{user.last_name}</td>
                  <td>{user.first_name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.is_active ? '✅' : '❌'}</td>
                  <td>{user.is_staff ? '✅' : '❌'}</td>
                  <td>{user.is_superuser ? '✅' : '❌'}</td>
                  <td>
                    <button onClick={() => modifierUtilisateur(user)}>Modifier</button>
                    <button onClick={() => supprimerUtilisateur(user.id)}>Supprimer</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GestionUtilisateurs;