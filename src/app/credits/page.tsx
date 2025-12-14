import styles from "../page.module.css";
import { User, Code, Users } from 'lucide-react';

export default function Credits() {
  const team = [
    {
      name: "Pablo MERIDJEN-MANOUKIAN",
      role: "Développeur",
      icon: <Code size={48} />,
      color: "var(--primary-color)"
    },
    {
      name: "Eric Izquierdo",
      role: "Consultant",
      icon: <Users size={48} />,
      color: "var(--secondary-color)"
    },
    {
      name: "Marc Rouchvarger",
      role: "Consultant",
      icon: <Users size={48} />,
      color: "var(--secondary-color)"
    },
    {
      name: "Joachim Ménager",
      role: "Consultant",
      icon: <Users size={48} />,
      color: "var(--secondary-color)"
    },
    {
      name: "Gary Wajdenbaum",
      role: "Consultant",
      icon: <Users size={48} />,
      color: "var(--secondary-color)"
    }
  ];

  return (
    <div className={`credits-container ${styles.page}`}>
      <div className="credits-content">
        <div className="credits-header">
          <h1 className="credits-main-title">Crédits</h1>
          <p className="credits-subtitle">
            L'équipe derrière TraceVault
          </p>
        </div>

        <div className="credits-grid">
          {team.map((member, index) => (
            <div key={index} className="credit-card">
              <div className="credit-avatar" style={{ backgroundColor: member.color }}>
                <div className="credit-avatar-icon">
                  {member.icon}
                </div>
              </div>
              <div className="credit-info">
                <h3 className="credit-name">{member.name}</h3>
                <p className="credit-role">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="credits-footer">
          <p className="credits-thank-you">
            Merci à toute l'équipe pour leur contribution au projet TraceVault
          </p>
          <div className="credits-year">
            {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
}
