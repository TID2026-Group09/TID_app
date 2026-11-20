export function sortDoneDateDescending(list) {
  const sortedToDos = [...list].sort((a, b) => {
    const aTime = a.doneDate ? new Date(a.doneDate).getTime() : null;
    const bTime = b.doneDate ? new Date(b.doneDate).getTime() : null;

    if (aTime === null && bTime === null) return 0;
    if (aTime === null) return 1;
    if (bTime === null) return -1;
    return bTime - aTime; 
  });

  return sortedToDos;
}
