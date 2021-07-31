export function almostEqualTimeBefore(x2: Date): (x1: unknown) => boolean {
  return (x1) => {
    if (!(x1 instanceof Date)) {
      return false;
    }
    const timeDelta = x2.getTime() - x1.getTime();
    return timeDelta < 100 && timeDelta >= 0;
  };
}
