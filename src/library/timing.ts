export function convertPodcastTimeToSeconds(podcastTime: string): number {
    const parts = podcastTime.split(":");
    if (parts.length !== 3) {
      return 0;
    }
    const weights = [3600, 60, 1];
    let total = 0;
    parts.forEach((p, i) => {
      const w = weights[i];
      const v = w * +p;
      total = total + v;
    });
    return total;
  }
  
  export function convertSecondsToPodcastTime(seconds: number): string {
    const weights = [3600, 60, 1];
    const segments: string[] = [];
    weights.forEach((v, i) => {
      const a = Math.floor(seconds / v);
      seconds = seconds - a * v;
      let c = `${a}`;
      if (c.length === 1) {
        c = `0${c}`;
      }
      if (c !== "00" || i !== 0) {
        segments.push(c);
      }
    });
    const b = segments.join(":");
    return b;
  }
  