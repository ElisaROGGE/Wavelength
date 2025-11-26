const RED_ZONE = 23;
const YELLOW_ZONE = 13;
const BLUE_ZONE = 5;

export function calculatePoints(
  angle: number,
  targetAngle: number,
  streak: number
) {
  const diff = Math.abs(angle - targetAngle);

  let base = 0;
  let newStreak = streak;

  if (diff <= BLUE_ZONE) {
    base = 3;
    newStreak++;
  } else if (diff <= YELLOW_ZONE) {
    base = 2;
    newStreak = 0;
  } else if (diff <= RED_ZONE) {
    base = 1;
    newStreak = 0;
  } else {
    base = 0;
    newStreak = 0;
  }

  const multiplier = 1 + Math.floor(newStreak / 2);

  return {
    points: base * multiplier,
    streak: newStreak
  };
}
