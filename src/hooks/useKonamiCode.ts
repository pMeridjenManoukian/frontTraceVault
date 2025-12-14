'use client';

import { useEffect, useState } from 'react';

/**
 * Hook personnalisé pour détecter une séquence de touches tapée par l'utilisateur
 * @param targetSequence - La séquence à détecter (ex: "moustache")
 * @param callback - Fonction appelée quand la séquence est détectée
 */
export function useSecretCode(
  targetSequence: string,
  callback: () => void
) {
  const [input, setInput] = useState('');

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignorer si l'utilisateur tape dans un input/textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Ajouter la touche pressée à la séquence
      const newInput = (input + event.key).toLowerCase();

      // Garder seulement les derniers caractères (longueur de la séquence cible)
      const trimmedInput = newInput.slice(-targetSequence.length);

      setInput(trimmedInput);

      // Vérifier si la séquence correspond
      if (trimmedInput === targetSequence.toLowerCase()) {
        callback();
        setInput(''); // Réinitialiser après détection
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [input, targetSequence, callback]);

  // Fonction pour réinitialiser manuellement
  const reset = () => setInput('');

  return { reset };
}
