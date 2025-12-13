'use client';

import React from 'react';
import { X } from 'lucide-react';
import { HelpContent } from '../utils/helpContent';
import '../styles/helpModal.scss';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: HelpContent;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  // Fermer la modal en cliquant sur le backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Gérer la touche Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Empêcher le scroll du body quand la modal est ouverte
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <div className="help-modal-backdrop" onClick={handleBackdropClick}>
      <div className="help-modal-content">
        <div className="help-modal-header">
          <h2>{content.title}</h2>
          <button
            className="help-modal-close"
            onClick={onClose}
            aria-label="Fermer l'aide"
          >
            <X size={24} />
          </button>
        </div>

        <div className="help-modal-body">
          {content.sections.map((section, index) => (
            <div key={index} className="help-section">
              {section.subtitle && (
                <h3 className="help-subtitle">{section.subtitle}</h3>
              )}
              <p className="help-content">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="help-modal-footer">
          <button className="help-modal-button" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
