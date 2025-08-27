const STORAGE_KEY = "app_registered_games";

export function getRegisteredGames() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

export function saveRegisteredGame(registration) {
  const games = getRegisteredGames();

  // Optional: Check for duplicates and avoid double registration
  const exists = games.some(
    (r) =>
      r.gameId === registration.gameId &&
      r.userId === registration.userId
  );
  if (exists) throw new Error("Already registered for this game");

  games.push(registration);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

export function confirmPayment(gameId, userId) {
  const games = getRegisteredGames();
  const registration = games.find(
    (r) => r.gameId === gameId && r.userId === userId
  );
  if (registration) {
    registration.paymentConfirmed = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } else {
    throw new Error("Registration not found");
  }
}

export function getUserRegistrations(userId) {
  const games = getRegisteredGames();
  return games.filter((r) => r.userId === userId);
}

export function getPendingPayments() {
  const games = getRegisteredGames();
  return games.filter((r) => !r.paymentConfirmed);
}